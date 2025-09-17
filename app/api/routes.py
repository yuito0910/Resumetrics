from fastapi import APIRouter, UploadFile, File
from app.services.matcher import Matcher
from app.models.schemas import Resume, MatchResult

router = APIRouter()
matcher = Matcher()

@router.post("/match", response_model=MatchResult)
async def match_resumes(resume: UploadFile = File(...)):
    contents = await resume.read()
    result = matcher.match(contents)
    return result

@router.get("/health")
async def health_check():
    return {"status": "healthy"}