from pathlib import Path
import xml.etree.ElementTree as ET
from .base import DepartmentAdapter
from ..schemas import VerificationResult

class WelfareAdapter(DepartmentAdapter):
    def verify(self, citizen_id: str) -> VerificationResult:
        raw_text = (Path(__file__).parent.parent / "mock_departments/welfare.xml").read_text()
        root = ET.fromstring(raw_text)
        
        for citizen_el in root.findall('citizen'):
            c_id = citizen_el.findtext('citizen_id')
            if c_id == citizen_id:
                data = {child.tag: (child.text or "") for child in citizen_el}
                verified = data.get("eligible") == "true" and data.get("existing_benefit") == "false"
                return VerificationResult(
                    department="Welfare Department", 
                    verified=verified,
                    message="Welfare eligibility verified" if verified else "Welfare eligibility failed", 
                    data=data,
                    raw_response=raw_text,
                    format="XML"
                )
                
        return VerificationResult(
            department="Welfare Department", 
            verified=False,
            message=f"No welfare records found for {citizen_id}", 
            data={},
            raw_response=raw_text,
            format="XML"
        )
