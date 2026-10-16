# RAAHA Prototype

Simple modular-monolith prototype for demonstrating government interoperability and workflow orchestration.

- Backend: FastAPI + Pydantic + SQLAlchemy + SQLite
- Mock departments: Education JSON, Income JSON, Welfare XML
- Adapters normalize department responses
- Workflow: consent -> education -> income -> welfare -> completed/failed
- Audit logging records workflow actions
- No real government integrations or citizen data

Keep the project simple and runnable. Avoid microservices, Kubernetes, Kafka, Redis, blockchain, AI/ML, and unnecessary infrastructure.
