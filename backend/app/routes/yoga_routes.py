from fastapi import APIRouter, HTTPException
from ..services.yoga_service import YogaService
from ..models.model import YogaPosture

router = APIRouter()
yoga_service = YogaService()

@router.post("/yoga/posture")
async def monitor_yoga_posture(posture: YogaPosture):
    try:
        result = await yoga_service.analyze_posture(posture)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/yoga/postures")
async def get_all_postures():
    try:
        postures = await yoga_service.get_all_postures()
        return {"postures": postures}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))