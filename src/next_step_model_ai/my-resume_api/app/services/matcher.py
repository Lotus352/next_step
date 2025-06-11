from typing import Dict, Any, List
from sentence_transformers import SentenceTransformer, util

# Load embedding model once (can be moved to higher scope in a real service)
model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")

# Mapping from human-readable level to numeric order
LEVELS = {
    "Internship": 0,
    "Entry level": 1,
    "Associate": 2,
    "Mid-Senior level": 3,
    "Executive": 4,
    "Director": 5,
}


def normalize_text(s: str) -> str:
    """
    Lower-case, strip accents, remove non-alphanumerics, collapse spaces.
    """
    import re, unicodedata

    s = s.lower().strip()
    s = unicodedata.normalize("NFKD", s)
    s = re.sub(r"[^a-z0-9.+\\s]", " ", s)
    return " ".join(s.split())


# ───────────────────────────── Skills ──────────────────────────────
def calculate_skill_mapping(
    cv_skills: List[str], jd_skills: List[str], threshold: float = 0.6
) -> List[Dict[str, Any]]:
    """
    Return SkillMatch list with keys: cv_skill, jd_skill, match, score.
    """
    if not cv_skills or not jd_skills:
        return []

    cv_norm = [normalize_text(x) for x in cv_skills]
    jd_norm = [normalize_text(x) for x in jd_skills]

    emb_cv = model.encode(cv_norm, convert_to_tensor=True)
    emb_jd = model.encode(jd_norm, convert_to_tensor=True)
    sim_matrix = util.cos_sim(emb_cv, emb_jd)

    results: List[Dict[str, Any]] = []
    for i, cv_item in enumerate(cv_skills):
        best_jd_idx = int(sim_matrix[i].argmax())
        best_score = sim_matrix[i][best_jd_idx].item()
        results.append(
            {
                "cv_skill": cv_item,
                "jd_skill": jd_skills[best_jd_idx],
                "match": 1 if best_score >= threshold else 0,
                "score": round(best_score, 2),
            }
        )
    return results


# ────────────────────────── Certifications ─────────────────────────
def calculate_cert_mapping(
    cv_certs: List[Dict[str, Any]],
    jd_certs: List[Dict[str, Any]],
    threshold: float = 0.6,
) -> List[Dict[str, Any]]:
    """
    Return CertMatch list with keys: jd_cert, cv_cert, jd_score, cv_score, match.
    A match needs (name similarity ≥ threshold) AND (cv_score ≥ jd_score).
    """
    if not cv_certs or not jd_certs:
        return []

    cv_names = [c.get("name", "") for c in cv_certs]
    jd_names = [c.get("name", "") for c in jd_certs]

    # Re-use skill matcher for name similarity only
    name_matches = calculate_skill_mapping(cv_names, jd_names, threshold)

    cert_matches: List[Dict[str, Any]] = []
    for m in name_matches:
        cv_idx = cv_names.index(m["cv_skill"])
        jd_idx = jd_names.index(m["jd_skill"])

        cv_raw_score = float(cv_certs[cv_idx].get("score", 0))
        jd_raw_score = float(jd_certs[jd_idx].get("score", 0))

        final_match = 1 if (m["match"] and cv_raw_score >= jd_raw_score) else 0

        cert_matches.append(
            {
                "jd_cert": m["jd_skill"],
                "cv_cert": m["cv_skill"],
                "jd_score": str(jd_raw_score),
                "cv_score": str(cv_raw_score),
                "match": final_match,
            }
        )
    return cert_matches


# ────────────────────────────── Master ─────────────────────────────
def match_cv_with_jd(cv_data: Dict[str, Any], jd_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Compare CV & JD → return overall score + detail sections
    (skills, certifications, experience level).
    """
    # --------- Skills ---------
    cv_skills = [s.split(" (")[0] for s in cv_data.get("skills", [])]
    jd_skills = jd_data.get("skills", [])
    skills_detail = calculate_skill_mapping(cv_skills, jd_skills)
    skill_matches = sum(x["match"] for x in skills_detail)
    skill_score = f"{skill_matches}/{len(jd_skills)}" if jd_skills else "0/0"

    # -------- Certifications -----
    cv_cert_raw = cv_data.get("certifications", [])
    jd_cert_raw = jd_data.get("certifications", [])
    certs_detail = calculate_cert_mapping(cv_cert_raw, jd_cert_raw)
    cert_matches = sum(x["match"] for x in certs_detail)
    cert_score = f"{cert_matches}/{len(jd_cert_raw)}" if jd_cert_raw else "0/0"

    # -------- Experience --------
    cv_level_name = cv_data.get("experienceLevel", "")
    cv_level_num = LEVELS.get(cv_level_name, -1)
    jd_levels = jd_data.get("experienceLevels", [])
    jd_level_nums = [LEVELS.get(lvl, -1) for lvl in jd_levels if lvl in LEVELS]

    exp_match_flag = any(cv_level_num >= lvl for lvl in jd_level_nums)
    exp_score = "1/1" if exp_match_flag else "0/1"

    # -------- Overall score -----
    parts: List[float] = []
    if jd_skills:
        parts.append(skill_matches / len(jd_skills))
    if jd_cert_raw:
        parts.append(cert_matches / len(jd_cert_raw))
    if jd_level_nums:
        parts.append(1.0 if exp_match_flag else 0.0)

    overall = round(sum(parts) / len(parts), 2) if parts else 0.0

    return {
        "score": overall,
        "details": {
            "skill_score": skill_score,
            "cert_score": cert_score,
            "exp_score": exp_score,
            "exp_match": 1 if exp_match_flag else 0,
            "exp_detail": {
                "cv_level": cv_level_name,
                "jd_required_levels": jd_levels,
                "match": 1 if exp_match_flag else 0,
            },
            "skills_detail": skills_detail,
            "certs_detail": certs_detail,
        },
    }
