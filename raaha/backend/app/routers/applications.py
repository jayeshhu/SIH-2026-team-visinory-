from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Application, Citizen, AuditLog, DepartmentResult
from ..schemas import ApplicationCreate, ApplicationOut, AuditOut, DepartmentResultOut, CitizenVerification

router = APIRouter(prefix="/applications", tags=["applications"])

@router.post("", response_model=ApplicationOut)
def create_application(payload: ApplicationCreate, db: Session = Depends(get_db)):
    citizen = db.get(Citizen, payload.citizen_id)
    if not citizen:
        citizen = Citizen(id=payload.citizen_id, name=payload.name)
        db.add(citizen)
    app = Application(
        id=f"RAAHA-2026-{uuid4().hex[:5].upper()}", 
        citizen_id=payload.citizen_id, 
        citizen_name=payload.name,
        service=payload.service
    )
    db.add(app)
    db.add(AuditLog(application_id=app.id, message="Application submitted"))
    db.commit()
    db.refresh(app)
    return app

@router.get("", response_model=list[ApplicationOut])
def list_applications(db: Session = Depends(get_db)):
    return db.query(Application).order_by(Application.created_at.desc()).all()

@router.get("/{application_id}", response_model=ApplicationOut)
def get_application(application_id: str, db: Session = Depends(get_db)):
    app = db.get(Application, application_id)
    if not app: raise HTTPException(404, "Application not found")
    return app

@router.get("/{application_id}/audit", response_model=list[AuditOut])
def audit(application_id: str, db: Session = Depends(get_db)):
    return db.query(AuditLog).filter_by(application_id=application_id).order_by(AuditLog.created_at).all()

@router.get("/{application_id}/status")
def get_application_status(application_id: str, db: Session = Depends(get_db)):
    app = db.get(Application, application_id)
    if not app: raise HTTPException(404, "Application not found")
    audit_logs = db.query(AuditLog).filter_by(application_id=application_id).order_by(AuditLog.created_at).all()
    return {
        "application": ApplicationOut.model_validate(app), 
        "timeline": [AuditOut.model_validate(l) for l in audit_logs]
    }

@router.get("/{application_id}/department-results", response_model=list[DepartmentResultOut])
def get_department_results(application_id: str, db: Session = Depends(get_db)):
    return db.query(DepartmentResult).filter_by(application_id=application_id).order_by(DepartmentResult.created_at).all()

@router.get("/{application_id}/verification", response_model=CitizenVerification)
def get_verification(application_id: str, db: Session = Depends(get_db)):
    app = db.get(Application, application_id)
    if not app: raise HTTPException(404, "Application not found")
    
    results = db.query(DepartmentResult).filter_by(application_id=application_id).all()
    
    edu = next((r for r in results if r.department == "Education Department"), None)
    inc = next((r for r in results if r.department == "Income Department"), None)
    wel = next((r for r in results if r.department == "Welfare Department"), None)
    
    return CitizenVerification(
        citizen_id=app.citizen_id,
        citizen_name=app.citizen_name or "",
        education_verified=edu.verified if edu else False,
        income_eligible=inc.verified if inc else False,
        welfare_eligible=wel.verified if wel else False,
        overall_eligible=app.eligible if app.eligible is not None else False,
        status=app.status,
        timestamp=app.created_at
    )
