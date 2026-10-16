import json
from sqlalchemy.orm import Session
from ..models import Application, AuditLog, Consent, WorkflowState as WorkflowStateModel, DepartmentResult
from ..adapters.education import EducationAdapter
from ..adapters.income import IncomeAdapter
from ..adapters.welfare import WelfareAdapter
from .states import WorkflowState

class WorkflowEngine:
    def __init__(self, db: Session):
        self.db = db
        self.adapter_config = [
            (WorkflowState.EDUCATION_VERIFICATION, "EDUCATION", EducationAdapter()),
            (WorkflowState.INCOME_VERIFICATION, "INCOME", IncomeAdapter()),
            (WorkflowState.WELFARE_VERIFICATION, "WELFARE", WelfareAdapter()),
        ]

    def log(self, application_id, message):
        self.db.add(AuditLog(application_id=application_id, message=message))

    def set_state(self, application, state):
        application.status = state
        self.db.add(WorkflowStateModel(application_id=application.id, state=state))

    def run(self, application: Application):
        consent = self.db.query(Consent).filter_by(citizen_id=application.citizen_id, service=application.service, granted=True).first()
        if not consent:
            raise ValueError("Citizen consent is required before verification")

        self.log(application.id, "Application workflow started")
        
        all_verified = True
        
        for state, prefix, adapter in self.adapter_config:
            self.set_state(application, state)
            self.log(application.id, f"{prefix}_REQUESTED")
            
            result = adapter.verify(application.citizen_id)
            
            dept_res = DepartmentResult(
                application_id=application.id,
                department=result.department,
                verified=result.verified,
                message=result.message,
                raw_data=result.raw_response,
                format=result.format,
                normalized_data=json.dumps(result.data)
            )
            self.db.add(dept_res)
            
            if result.verified:
                self.log(application.id, f"{prefix}_VERIFIED")
            else:
                self.log(application.id, f"{prefix}_FAILED")
                all_verified = False
                
        application.eligible = all_verified
        application.decision = "APPROVED" if all_verified else "REJECTED"
        
        if all_verified:
            self.set_state(application, WorkflowState.COMPLETED)
            self.log(application.id, "Scholarship verification completed - APPROVED")
        else:
            self.set_state(application, WorkflowState.FAILED)
            self.log(application.id, "Application failed verification - REJECTED")
            
        self.db.commit()
        return application
