from sqlalchemy.orm import Session
from app import models, schemas
from datetime import datetime,time
def create_record(db: Session, record: schemas.DetectionRecordCreate):
    db_record = models.DetectionRecord(**record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def get_records(db: Session, offset: int = 0, limit: int = 100):
    return db.query(models.DetectionRecord)\
             .order_by(models.DetectionRecord.timestamp.desc())\
             .offset(offset)\
             .limit(limit)\
             .all()

def search_detection_records(db: Session, num_people: int = None, date: datetime = None):
    query = db.query(models.DetectionRecord)
    
    if num_people is not None:
        query = query.filter(models.DetectionRecord.num_people == num_people)
    
    if date is not None:
        # Create datetime boundaries for the given date
        start_datetime = datetime.combine(date, time.min)
        end_datetime = datetime.combine(date, time.max)
        query = query.filter(
            models.DetectionRecord.timestamp >= start_datetime,
            models.DetectionRecord.timestamp <= end_datetime
        )
    
    return query.order_by(models.DetectionRecord.timestamp.desc()).all()
