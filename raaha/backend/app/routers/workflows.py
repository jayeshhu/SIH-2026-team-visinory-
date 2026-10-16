from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Application, WorkflowState as WorkflowStateModel
from ..workflow.engine import WorkflowEngine
router = APIRouter(prefix="/workflows", tags=["workflows"])
@router.post("/{application_id}/start")
def start_workflow(application_id: str, db: Session = Depends(get_db)):
    app = db.get(Application, application_id)
    if not app: raise HTTPException(404, "Application not found")
    try: result = WorkflowEngine(db).run(app)
    except ValueError as e: raise HTTPException(400, str(e))
    return {"application_id": result.id, "status": result.status, "eligible": getattr(result, "eligible", False), "decision": getattr(result, "decision", "REJECTED")}
@router.get("/{application_id}")
def get_workflow(application_id: str, db: Session = Depends(get_db)):
    app = db.get(Application, application_id)
    if not app: raise HTTPException(404, "Application not found")
    states = db.query(WorkflowStateModel).filter_by(application_id=application_id).order_by(WorkflowStateModel.created_at).all()
    return {"application_id": application_id, "status": app.status, "states": [s.state for s in states]}
