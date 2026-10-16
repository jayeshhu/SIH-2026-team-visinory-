from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Consent, Application, AuditLog

router = APIRouter(tags=["consent"])

class ConsentPayload(BaseModel):
    granted: bool = True

@router.post("/applications/{application_id}/consent")
def create_consent(application_id: str, payload: ConsentPayload, db: Session = Depends(get_db)):
    app = db.get(Application, application_id)
    if not app:
        raise HTTPException(404, "Application not found")
    consent = Consent(citizen_id=app.citizen_id, service=app.service, granted=payload.granted)
    db.add(consent)
    db.add(AuditLog(application_id=app.id, message="Citizen consent granted" if payload.granted else "Citizen consent denied"))
    db.commit()
    db.refresh(consent)
    return {"id": consent.id, "citizen_id": consent.citizen_id, "service": consent.service, "granted": consent.granted}

@router.get("/consents/{citizen_id}")
def get_consent(citizen_id: str, db: Session = Depends(get_db)):
    return db.query(Consent).filter_by(citizen_id=citizen_id).order_by(Consent.created_at.desc()).first()
