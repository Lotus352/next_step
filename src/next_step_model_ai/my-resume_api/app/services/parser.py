import fitz
import requests
import json
import re
from app.config import OPENROUTER_API_KEY


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract all text content from a PDF file."""
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    return "".join(page.get_text() for page in doc)


def clean_gpt_json_output(raw_text: str) -> str:
    """Cleans GPT response to extract valid JSON and remove invalid escape sequences."""
    cleaned = re.sub(r"```(json)?", "", raw_text.strip(), flags=re.IGNORECASE)
    match = re.search(r"(\{.*\})", cleaned, re.DOTALL)
    json_block = match.group(1) if match else cleaned

    # Fix common invalid escape characters
    json_block = json_block.replace("\\xa0", " ")
    json_block = json_block.replace("\\u202f", " ")
    json_block = json_block.replace("\\ ", " ")
    json_block = json_block.replace("\\•", "*")
    json_block = re.sub(r'\\(?!["\\/bfnrtu])', "", json_block)

    return json_block


def parse_resume_text_with_api(text: str) -> dict:
    """Send extracted resume text to GPT and parse structured JSON (without resumeContent)."""
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "ResumeParser",
    }

    prompt = f"""
    From the following resume text, extract and return a valid JSON object with the following fields:

    - summary: A brief 1–3 line professional summary.
    - experienceLevel: One of the following values: "Internship", "Entry level", "Associate", "Mid-Senior level", "Executive", "Director".
    - skills: A complete list of all relevant skills and technologies found anywhere in the resume. Each item must be in the format "SkillName (type or description)".
    - certifications: List of all certifications, especially English language certifications (such as TOEIC, IELTS, TOEFL, CEFR levels: B1, B2, C1, etc.). Each certification must be an object with the following fields:
        - name (e.g., TOEIC, IELTS)
        - score (e.g., 850, 7.5, B2)
        - issuer (if available)
    Always include the score if mentioned in the resume.
    - education: List of objects with fields: degree, school, graduationYear.
    - workExperience: List of objects with fields: company, role, duration, description.
    - awards: List of strings (if any).
    - projects: List of objects with fields: name, description, technologies, role, url (if available).

    Ensure that all relevant information is extracted, even if it is embedded in job descriptions, project content, certifications, or education history. Do not omit any skill or important detail that appears anywhere in the resume.
    Only return the JSON object. Do not include any explanation or formatting outside the JSON.
    Resume text:
    {text}
    """

    payload = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant that extracts structured resume data for HR systems.",
            },
            {"role": "user", "content": prompt},
        ],
    }

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
        )
        result = response.json()
        raw_output = result["choices"][0]["message"]["content"]
        cleaned_output = clean_gpt_json_output(raw_output)
        return json.loads(cleaned_output)
    except Exception as e:
        return {
            "error": "Failed to parse structured output",
            "reason": str(e),
            "raw_output": result.get("choices", [{}])[0]
            .get("message", {})
            .get("content", ""),
        }
