from fastapi import APIRouter
from ..database import engine, Base

router = APIRouter(prefix="/demo", tags=["demo"])

@router.post("/reset")
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    return {"message": "Database reset successful"}
