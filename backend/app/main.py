from fastapi import FastAPI, File, UploadFile, HTTPException, staticfiles
from fastapi.middleware.cors import CORSMiddleware
from app.detection import detect_people
from app import models, schemas, crud
from app.database import SessionLocal, engine
import shutil
import os
from datetime import datetime
from pathlib import Path
from typing import List

from app.config import settings
app = FastAPI()

models.Base.metadata.create_all(bind=engine)
app.mount("/static", staticfiles.StaticFiles(directory="static"), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    try:
        file_path = settings.UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        output_path = settings.UPLOAD_DIR / f"processed_{file.filename}"
        num_people = detect_people(str(file_path), str(output_path))
        
        record = schemas.DetectionRecordCreate(
            num_people=num_people,
            image_path=str(output_path)
        )
        db = SessionLocal()
        crud.create_record(db, record)
        db.close()
        
        return {
            "num_people": num_people,
            "image_url": f"/static/results/{output_path.name}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search/", response_model=List[schemas.DetectionRecordResponse])
def get_search_result(num_people: int = None, date: datetime = None):
    db = SessionLocal()
    records = crud.search_detection_records(db, num_people=num_people, date=date)
    db.close()
    return records

@app.get("/history/")
def get_history( limit: int = 10):
    db = SessionLocal()
    records = crud.get_records(db, limit=limit)
    db.close()
    return records

