import json
from pathlib import Path
from .base import DepartmentAdapter
from ..schemas import VerificationResult

class IncomeAdapter(DepartmentAdapter):
    def verify(self, citizen_id: str) -> VerificationResult:
        raw_text = (Path(__file__).parent.parent / "mock_departments/income.json").read_text()
        full_data = json.loads(raw_text)
        
        citizen_data = full_data.get("citizens", {}).get(citizen_id)
        if not citizen_data:
            return VerificationResult(
                department="Income Department", 
                verified=False,
                message=f"No income records found for {citizen_id}", 
                data={},
                raw_response=raw_text,
                format="JSON"
            )
            
        verified = citizen_data.get("income_eligible", False)
        return VerificationResult(
            department="Income Department", 
            verified=verified,
            message="Income eligible" if verified else "Income eligibility failed", 
            data=citizen_data,
            raw_response=raw_text,
            format="JSON"
        )
