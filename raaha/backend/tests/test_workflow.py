import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
os.environ["DATABASE_URL"] = "sqlite:///./test.db"
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
client = TestClient(app)

def test_health():
    assert client.get("/health").json() == {"status": "ok"}

def test_demo_reset():
    assert client.post("/demo/reset").status_code == 200

def test_complete_workflow_cit001():
    # Application
    r = client.post("/applications", json={"citizen_id":"CIT001","name":"Demo Student"})
    assert r.status_code == 200
    app_id = r.json()["id"]
    
    # Consent
    assert client.post(f"/applications/{app_id}/consent", json={"granted":True}).status_code == 200
    
    # Workflow
    result = client.post(f"/workflows/{app_id}/start")
    assert result.status_code == 200
    assert result.json()["status"] == "COMPLETED"
    assert result.json()["eligible"] is True
    assert result.json()["decision"] == "APPROVED"
    
    # Department Results
    dept_res = client.get(f"/applications/{app_id}/department-results")
    assert dept_res.status_code == 200
    assert len(dept_res.json()) == 3
    
    # Status / Timeline
    status_res = client.get(f"/applications/{app_id}/status")
    assert status_res.status_code == 200
    assert "timeline" in status_res.json()
    
    # Verification common model
    verif = client.get(f"/applications/{app_id}/verification")
    assert verif.status_code == 200
    v_data = verif.json()
    assert v_data["overall_eligible"] is True
    assert v_data["income_eligible"] is True

def test_workflow_cit002_failure():
    # Application
    r = client.post("/applications", json={"citizen_id":"CIT002","name":"Amit Patel"})
    app_id = r.json()["id"]
    
    # Consent
    client.post(f"/applications/{app_id}/consent", json={"granted":True})
    
    # Workflow
    result = client.post(f"/workflows/{app_id}/start")
    assert result.status_code == 200
    assert result.json()["status"] == "FAILED"
    assert result.json()["eligible"] is False
    assert result.json()["decision"] == "REJECTED"
    
    verif = client.get(f"/applications/{app_id}/verification").json()
    assert verif["income_eligible"] is False
    assert verif["overall_eligible"] is False

def test_workflow_requires_consent():
    r = client.post("/applications", json={"citizen_id":"CIT003","name":"No Consent"})
    result = client.post(f"/workflows/{r.json()['id']}/start")
    assert result.status_code == 400
