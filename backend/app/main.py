from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import applications, auth, matching, prepare, programs, schools, students

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Scoolize API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    # Tolère n'importe quel port localhost en dev (sans effet en prod : ne matche aucun domaine réel).
    allow_origin_regex=r"https?://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for module in (auth, students, programs, schools, matching, applications, prepare):
    app.include_router(module.router)


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok", "service": "scoolize-api", "version": app.version}
