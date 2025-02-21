from pathlib import Path
from pydantic_settings import BaseSettings # NEW
from pydantic import Field

class Settings(BaseSettings):
    # Database configuration
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    
    # File storage configuration
    UPLOAD_DIR: Path = Path("static/results")
    ALLOWED_EXTENSIONS: set = {".jpg", ".jpeg", ".png", ".webp"}
    
    # Model configuration
    MODEL_NAME: str = "yolov8n"
    CONFIDENCE_THRESHOLD: float = 0.5
    
    # Application settings
    MAX_FILE_SIZE_MB: int = 10  # in megabytes
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

    def __init__(self, **values):
        super().__init__(**values)
        # Create upload directory if it doesn't exist
        self.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Instantiate settings object
settings = Settings()