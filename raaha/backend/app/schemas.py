from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, ConfigDict

class ApplicationCreate(BaseModel):
    citizen_id: str
    name: str
    service: str = "Scholarship Verification"

class ApplicationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    citizen_id: str
    citizen_name: Optional[str] = None
    service: str
    status: str
    eligible: Optional[bool] = None
    decision: Optional[str] = None
    created_at: datetime

class ConsentCreate(BaseModel):
    citizen_id: str
    service: str = "Scholarship Verification"
    granted: bool = True

class VerificationResult(BaseModel):
    department: str
    verified: bool
    message: str
    data: dict[str, Any] = {}
    raw_response: str = ""
    format: str = "JSON"

class DepartmentResultOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    application_id: str
    department: str
    verified: bool
    message: str
    raw_data: str
    format: str
    normalized_data: str
    created_at: datetime

class CitizenVerification(BaseModel):
    citizen_id: str
    citizen_name: str
    education_verified: bool
    income_eligible: bool
    welfare_eligible: bool
    overall_eligible: bool
    status: str
    timestamp: datetime

class AuditOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    application_id: str
    message: str
    created_at: datetime
