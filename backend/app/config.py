from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite:///./scoolize.db"
    # Secret de dev (>= 32 octets) — À REMPLACER en production via la variable d'env JWT_SECRET
    jwt_secret: str = "scoolize-dev-only-secret-change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24
    # Origines autorisées pour le front (séparées par des virgules)
    cors_origins: str = "http://localhost:3000"


settings = Settings()
