import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app


@pytest.fixture()
def client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSession = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture()
def register(client):
    """Renvoie une fonction qui crée un étudiant et retourne (id, headers authentifiés)."""

    def _register(email: str) -> tuple[int, dict]:
        created = client.post(
            "/api/students",
            json={
                "first_name": "Test",
                "last_name": "User",
                "email": email,
                "password": "secret123",
            },
        )
        sid = created.json()["id"]
        token = client.post(
            "/api/auth/login", json={"email": email, "password": "secret123"}
        ).json()["access_token"]
        return sid, {"Authorization": f"Bearer {token}"}

    return _register
