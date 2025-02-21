from pydantic import BaseModel
from datetime import datetime

class DetectionRecordResponse(BaseModel):
    id: int
    timestamp: datetime
    num_people: int
    image_path: str

    class Config:
        orm_mode = True
        
class  DetectionRecordCreate(BaseModel):
    num_people: int
    image_path: str