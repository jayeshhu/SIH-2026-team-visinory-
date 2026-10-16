import json
from pathlib import Path
from .base import DepartmentAdapter
from ..schemas import VerificationResult

class EducationAdapter(DepartmentAdapter):
    def verify(self, citizen_id: str) -> VerificationResult:
        raw_text = (Path(__file__).parent.parent / "mock_departments/education.json").read_text()
        full_data = json.loads(raw_text)
        
        student_data = full_data.get("students", {}).get(citizen_id)
        if not student_data:
            return VerificationResult(
                department="Education Department", 
                verified=False,
                message=f"No education records found for {citizen_id}", 
                data={},
                raw_response=raw_text,
                format="JSON"
            )
            
        verified = student_data.get("enrolled", False)
        return VerificationResult(
            department="Education Department", 
            verified=verified,
            message="Enrollment verified" if verified else "Enrollment not verified", 
            data=student_data,
            raw_response=raw_text,
            format="JSON"
        )
