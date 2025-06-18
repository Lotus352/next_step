from fastapi import APIRouter, UploadFile, File, Body, HTTPException
from app.services.parser import extract_text_from_pdf, parse_resume_text_with_api
from app.services.matcher import match_cv_with_jd

router = APIRouter()

@router.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """
    Extracts and parses resume PDF to structured JSON.
    """
    try:
        # Basic file validation
        if not file.filename or not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Please upload a PDF file")
        
        file_bytes = await file.read()
        
        if len(file_bytes) == 0:
            raise HTTPException(status_code=400, detail="File is empty")
        
        text = extract_text_from_pdf(file_bytes)
        
        if not text or len(text.strip()) < 10:
            raise HTTPException(status_code=422, detail="Could not extract text from PDF")
        
        result = parse_resume_text_with_api(text)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@router.post("/match-score")
async def match_score(
    cv_data: dict = Body(...),
    jd_data: dict = Body(...)
):
    """
    Calculates matching score between parsed CV and Job Description.
    """
    try:
        # Basic validation
        if not cv_data or not jd_data:
            raise HTTPException(status_code=400, detail="Both cv_data and jd_data are required")
        
        result = match_cv_with_jd(cv_data, jd_data)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating match: {str(e)}")