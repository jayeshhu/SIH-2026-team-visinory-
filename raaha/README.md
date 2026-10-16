# RAAHA Prototype

Simple hackathon proof-of-concept for government interoperability and workflow orchestration.

## Run backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Open http://localhost:8000/docs

## Run tests
```bash
cd backend
pytest -q
```

## Run frontend
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL, normally http://localhost:5173

## Demo
1. Create an application.
2. Consent is granted for the demo citizen.
3. Select the application.
4. Run Verification Workflow.
5. RAAHA reads Education JSON, Income JSON and Welfare XML through adapters.
6. The workflow becomes COMPLETED and the audit trail shows each step.

This is a mock prototype. It does not connect to real government systems or use real citizen data.
