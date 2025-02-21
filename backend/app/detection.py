import cv2
from PIL import Image
from ultralytics import YOLO
from ultralytics.utils.plotting import Annotator  # ultralytics.yolo.utils.plotting is deprecated
from app.config import settings
model = YOLO(settings.MODEL_NAME)

def detect_people(img_path:str, output_path:str) ->int:
    img = Image.open(img_path)
    results = model.predict(img, classes=[0],conf=settings.CONFIDENCE_THRESHOLD)
    for r in results:
        annotator = Annotator(img)
        boxes = r.boxes
        for box in boxes:
            b = box.xyxy[0]  
            c = box.cls
            annotator.box_label(b, model.names[int(c)])
    annotated_img = annotator.result()  
    cv2.imwrite(output_path, cv2.cvtColor(annotated_img, cv2.COLOR_BGR2RGB) )
    return(len(results[0].boxes))