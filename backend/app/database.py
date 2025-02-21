from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Database engine configuration
engine = create_engine(
    url = settings.DATABASE_URL,
    pool_pre_ping=True,  # Detect and recover from connection issues
    pool_size=20,        # Maximum number of persistent connections
    max_overflow=10      # Temporary connections beyond pool_size
)

# Session factory configuration
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False
)

# Base class for models
Base = declarative_base()

def get_db():
    """
    Dependency function to yield database sessions
    Use in FastAPI endpoints like:
    
    def example_endpoint(db: Session = Depends(get_db)):
        # db operations here
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """
    Initialize database connection and create tables
    """
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")
    except Exception as e:
        print(f"Error creating database tables: {e}")