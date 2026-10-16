from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from .database import Base

class Citizen(Base):
    __tablename__ = "citizens"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)

class Application(Base):
    __tablename__ = "applications"
    id = Column(String, primary_key=True)
    citizen_id = Column(String, nullable=False)
    citizen_name = Column(String, nullable=True)
    service = Column(String, nullable=False)
    status = Column(String, default="SUBMITTED")
    eligible = Column(Boolean, nullable=True)
    decision = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Consent(Base):
    __tablename__ = "consents"
    id = Column(Integer, primary_key=True, autoincrement=True)
    citizen_id = Column(String, nullable=False)
    service = Column(String, nullable=False)
    granted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class WorkflowState(Base):
    __tablename__ = "workflow_states"
    id = Column(Integer, primary_key=True, autoincrement=True)
    application_id = Column(String, nullable=False)
    state = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    application_id = Column(String, nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class DepartmentResult(Base):
    __tablename__ = "department_results"
    id = Column(Integer, primary_key=True, autoincrement=True)
    application_id = Column(String, nullable=False)
    department = Column(String, nullable=False)
    verified = Column(Boolean, nullable=False)
    message = Column(String, nullable=False)
    raw_data = Column(Text, nullable=False)
    format = Column(String, nullable=False)
    normalized_data = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
