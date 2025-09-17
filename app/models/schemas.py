from pydantic import BaseModel
from typing import List, Optional

class Resume(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    skills: List[str]
    experience: List[str]
    education: List[str]

class JobDescription(BaseModel):
    title: str
    requirements: List[str]
    preferred_skills: List[str]

class MatchResult(BaseModel):
    resume: Resume
    job_description: JobDescription
    score: float
    matched_skills: List[str]