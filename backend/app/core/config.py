from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite:///./vespera.db"
    secret_key: str = "change-this-secret-key-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080
    cors_origins: str = "http://localhost:3000,http://localhost:5173,http://localhost:8080"

    admin_name: str = "Vespera Admin"
    admin_email: str = "admin@vespera.shop"
    admin_password: str = "Admin123!"

    demo_name: str = "Mariam Khalil"
    demo_email: str = "mariam@vespera.shop"
    demo_password: str = "Demo1234!"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origin_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
