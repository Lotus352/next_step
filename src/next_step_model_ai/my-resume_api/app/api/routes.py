from fastapi import APIRouter, UploadFile, File, Body
from app.services.parser import extract_text_from_pdf, parse_resume_text_with_api
from app.services.matcher import match_cv_with_jd

router = APIRouter()

@router.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """
    Extracts and parses resume PDF to structured JSON.
    """
    file_bytes = await file.read()
    text = extract_text_from_pdf(file_bytes)
    return parse_resume_text_with_api(text)

@router.post("/match-score")
async def match_score(
    cv_data: dict = Body(...),
    jd_data: dict = Body(...)
):
    """
    Calculates matching score between parsed CV and Job Description.
    """
    return match_cv_with_jd(cv_data, jd_data)
