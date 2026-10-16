from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import applications, consent, health, services, workflows, demo

Base.metadata.create_all(bind=engine)
app = FastAPI(title="RAAHA Prototype", version="1.0.0", description="Simple interoperability and workflow orchestration prototype")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(health.router)
app.include_router(applications.router)
app.include_router(consent.router)
app.include_router(workflows.router)
app.include_router(services.router)
app.include_router(demo.router)
