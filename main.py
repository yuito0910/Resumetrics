from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber, docx, re
from typing import List
from datetime import datetime

# AI / NLP
import spacy
from sentence_transformers import SentenceTransformer, util
from rapidfuzz import fuzz


app = FastAPI(title="Resume Parser API")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

nlp = spacy.load("en_core_web_sm")
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# --- Configurable thresholds ---
FUZZY_THRESHOLD = 80
EMBEDDING_THRESHOLD = 0.8

# --- Skills DB (can be replaced with DB/Excel later) ---
SKILLS_DB = [
    "python", "sql", "react", "aws",
    "verbal communication", "time management",
    "inventory management", "community management"
]

# Load embeddings model once
model = SentenceTransformer("all-MiniLM-L6-v2")

# --- Helpers ---
def extract_text_from_pdf(file) -> str:
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += (page.extract_text() or "") + "\n"
    return text

def extract_text_from_docx(file) -> str:
    doc = docx.Document(file)
    return "\n".join(p.text for p in doc.paragraphs)

def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()

def split_sections(text: str) -> dict:
    """Split resume into sections: education and experience."""
    text_lower = text.lower()
    sections = {"education": "", "experience": ""}

    if "education" in text_lower:
        edu_start = text_lower.index("education")
        exp_start = text_lower.index("experience") if "experience" in text_lower else len(text_lower)

        sections["education"] = text[edu_start:exp_start].strip()
        sections["experience"] = text[exp_start:].strip() if exp_start < len(text) else ""
    else:
        sections["education"] = text
    return sections

def extract_education(text: str):
    education = []
    degree_pattern = r"(B\.S\.|B\.Sc|BS|Bachelor|M\.S\.|MS|Master|Ph\.D\.|PhD)"
    duration_pattern = r"(19|20)\d{2}\s*[-–]\s*(present|(19|20)\d{2})"

    # Match full "degree + school + duration"
    matches = re.findall(rf"({degree_pattern}.*?(?:{duration_pattern}))", text, flags=re.IGNORECASE)

    for match in matches:
        full_text = match[0]

        # Extract degree
        degree_match = re.search(degree_pattern, full_text, flags=re.IGNORECASE)
        degree = degree_match.group(0).upper().replace(".", "") if degree_match else "Unknown"

        # Extract duration
        duration_match = re.search(duration_pattern, full_text, flags=re.IGNORECASE)
        duration = duration_match.group(0) if duration_match else "unknown"

        # Use spaCy to get school name (ORG entity)
        doc = nlp(full_text)
        school = "unknown"
        for ent in doc.ents:
            if ent.label_ == "ORG":
                school = ent.text
                break

        education.append({
            "degree": degree if degree != "Unknown" else "Unknown",
            "school": school,
            "duration": duration
        })

    return education

def extract_experience(text: str) -> List[dict]:
    """Extract multiple experience entries (role, company, duration)."""
    experience = []
    text = re.sub(r"experience", "", text, flags=re.IGNORECASE)

    matches = re.findall(r"([^-]+)-([^(]+)\((.*?)\)", text)
    for match in matches:
        role = match[0].strip()
        company = match[1].strip()
        duration = match[2].strip()
        experience.append({"role": role, "company": company, "duration": duration})

    return experience

def calculate_experience_years(experiences: List[dict]) -> int:
    """Sum total years of experience from durations."""
    total_years = 0
    for exp in experiences:
        duration = exp.get("duration", "").lower()
        match = re.match(r"(19|20)\d{2}\s*[-–]\s*(present|(19|20)\d{2})", duration, re.IGNORECASE)
        if match:
            start = match.group(0).split("–")[0].split("-")[0].strip()
            end = match.group(0).split("–")[-1].split("-")[-1].strip()
            try:
                start_year = int(re.findall(r"\d{4}", start)[0])
                if "present" in end:
                    end_year = datetime.now().year
                else:
                    end_year = int(re.findall(r"\d{4}", end)[0])
                total_years += max(0, end_year - start_year)
            except:
                continue
    return total_years

# --- Skills Matching ---
def extract_skills(text: str, predefined_skills: List[str],
                   fuzzy_threshold: int = FUZZY_THRESHOLD,
                   embedding_threshold: float = EMBEDDING_THRESHOLD) -> List[str]:
    """
    Extracts skills using fuzzy matching (for short skills)
    and embeddings (for multi-word/soft skills).
    """
    found = []
    text_clean = text.lower()

    # Encode resume text once
    text_embedding = model.encode([text], convert_to_tensor=True)

    for skill in predefined_skills:
        skill_lower = skill.lower()

        # Fuzzy match for single/short words
        if len(skill_lower.split()) <= 2:
            if fuzz.partial_ratio(skill_lower, text_clean) >= fuzzy_threshold:
                found.append(skill)
        else:
            # Embedding similarity for multi-word skills
            skill_embedding = model.encode([skill], convert_to_tensor=True)
            sim = util.cos_sim(text_embedding, skill_embedding).item()
            if sim >= embedding_threshold:
                found.append(skill)

    return list(set(found))

# --- API Endpoint ---
@app.post("/analyze")
async def analyze_resume(resume: UploadFile = File(...)):
    # Parse resume file
    if resume.filename.lower().endswith(".pdf"):
        resume_text = extract_text_from_pdf(resume.file)
    elif resume.filename.lower().endswith(".docx"):
        resume_text = extract_text_from_docx(resume.file)
    else:
        return JSONResponse({"error": "Only PDF and DOCX supported"}, status_code=400)

    resume_text = clean_text(resume_text)

    # Split into sections
    sections = split_sections(resume_text)

    # Extract education & experience
    education = extract_education(sections["education"])
    experience = extract_experience(sections["experience"])
    total_exp = calculate_experience_years(experience)

    # Extract skills
    matched_skills = extract_skills(resume_text, SKILLS_DB,
                                    fuzzy_threshold=FUZZY_THRESHOLD,
                                    embedding_threshold=EMBEDDING_THRESHOLD)
    missing_skills = list(set(SKILLS_DB) - set(matched_skills))

    return {
        "education": education,
        "experience": experience,
        "total_experience_years": total_exp,
        "experience_met": total_exp >= 3,  # Example: require at least 3 years
        "skills_matched": matched_skills,
        "missing_skills": missing_skills,
        "suitability_score": int((len(matched_skills) / len(SKILLS_DB)) * 100),
        "predefined_skills": SKILLS_DB,
        "confidence_settings": {
            "fuzzy_threshold": FUZZY_THRESHOLD,
            "embedding_threshold": EMBEDDING_THRESHOLD
        }
    }
