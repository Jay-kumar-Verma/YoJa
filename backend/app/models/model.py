from pydantic import BaseModel
from typing import List, Optional

class YogaPosture(BaseModel):
    name: str
    description: str
    video_url: str
    correct_posture: List[float]  # Coordinates for the correct posture
    user_posture: Optional[List[float]] = None  # Coordinates for the user's posture

class PostureCorrectionResponse(BaseModel):
    is_correct: bool
    correction_vector: Optional[List[float]]  # Vector to correct the user's posture
    message: str