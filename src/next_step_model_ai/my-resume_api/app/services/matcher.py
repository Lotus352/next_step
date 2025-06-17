import re
import unicodedata
from typing import Dict, Any, List, Optional, Tuple
from dataclasses import dataclass
from enum import IntEnum

from sentence_transformers import SentenceTransformer, util
import torch


class ExperienceLevel(IntEnum):
    """Experience levels mapped to numeric values for comparison."""
    INTERNSHIP = 0
    ENTRY_LEVEL = 1
    ASSOCIATE = 2
    MID_SENIOR = 3
    EXECUTIVE = 4
    DIRECTOR = 5


# Mapping from human-readable level to enum
EXPERIENCE_LEVEL_MAP = {
    "Internship": ExperienceLevel.INTERNSHIP,
    "Entry level": ExperienceLevel.ENTRY_LEVEL,
    "Associate": ExperienceLevel.ASSOCIATE,
    "Mid-Senior level": ExperienceLevel.MID_SENIOR,
    "Executive": ExperienceLevel.EXECUTIVE,
    "Director": ExperienceLevel.DIRECTOR,
}


@dataclass
class SkillMatch:
    """Represents a skill matching result."""
    cv_skill: str
    jd_skill: str
    score: float
    is_match: bool


@dataclass
class CertificationMatch:
    """Represents a certification matching result."""
    cv_cert: str
    jd_cert: str
    cv_score: float
    jd_score: float
    is_match: bool


@dataclass
class ExperienceMatch:
    """Represents experience level matching result."""
    cv_level: str
    jd_levels: List[str]
    is_match: bool


@dataclass
class MatchResult:
    """Complete matching result between CV and JD."""
    overall_score: float
    skill_matches: List[SkillMatch]
    cert_matches: List[CertificationMatch]
    experience_match: ExperienceMatch
    skill_score_ratio: str
    cert_score_ratio: str
    experience_score_ratio: str


class CVJDMatcher:
    """
    Enhanced CV-JD matching system with improved logic and error handling.
    """
    
    def __init__(self, model_name: str = "sentence-transformers/all-mpnet-base-v2"):
        """Initialize the matcher with a sentence transformer model."""
        try:
            self.model = SentenceTransformer(model_name)
        except Exception as e:
            raise RuntimeError(f"Failed to load model {model_name}: {e}")
    
    @staticmethod
    def normalize_text(text: str) -> str:
        """
        Normalize text by lowercasing, removing accents, and cleaning special characters.
        
        Args:
            text: Input text to normalize
            
        Returns:
            Normalized text string
        """
        if not isinstance(text, str):
            return ""
            
        # Convert to lowercase and strip whitespace
        text = text.lower().strip()
        
        # Normalize unicode characters (remove accents)
        text = unicodedata.normalize("NFKD", text)
        
        # Keep only alphanumeric characters, dots, plus signs, and spaces
        text = re.sub(r"[^a-z0-9.+\s]", " ", text)
        
        # Collapse multiple spaces into single spaces
        return " ".join(text.split())
    
    def calculate_skill_matches(
        self, 
        cv_skills: List[str], 
        jd_skills: List[str], 
        threshold: float = 0.6
    ) -> List[SkillMatch]:
        """
        Calculate skill matching between CV and JD skills using semantic similarity.
        
        Args:
            cv_skills: List of skills from CV
            jd_skills: List of required skills from JD
            threshold: Minimum similarity score for a match
            
        Returns:
            List of SkillMatch objects
        """
        if not cv_skills or not jd_skills:
            return []
        
        try:
            # Normalize skill names
            cv_normalized = [self.normalize_text(skill) for skill in cv_skills]
            jd_normalized = [self.normalize_text(skill) for skill in jd_skills]
            
            # Generate embeddings
            cv_embeddings = self.model.encode(cv_normalized, convert_to_tensor=True)
            jd_embeddings = self.model.encode(jd_normalized, convert_to_tensor=True)
            
            # Calculate similarity matrix
            similarity_matrix = util.cos_sim(cv_embeddings, jd_embeddings)
            
            matches = []
            for i, cv_skill in enumerate(cv_skills):
                # Find best matching JD skill
                best_jd_idx = int(similarity_matrix[i].argmax())
                best_score = float(similarity_matrix[i][best_jd_idx].item())
                
                matches.append(SkillMatch(
                    cv_skill=cv_skill,
                    jd_skill=jd_skills[best_jd_idx],
                    score=round(best_score, 3),
                    is_match=best_score >= threshold
                ))
            
            return matches
            
        except Exception as e:
            print(f"Error calculating skill matches: {e}")
            return []
    
    def calculate_certification_matches(
        self,
        cv_certs: List[Dict[str, Any]],
        jd_certs: List[Dict[str, Any]],
        threshold: float = 0.6
    ) -> List[CertificationMatch]:
        """
        Calculate certification matching between CV and JD certifications.
        
        Args:
            cv_certs: List of CV certifications with 'name' and 'score' keys
            jd_certs: List of JD certifications with 'name' and 'score' keys
            threshold: Minimum similarity score for name matching
            
        Returns:
            List of CertificationMatch objects
        """
        if not cv_certs or not jd_certs:
            return []
        
        try:
            # Extract certification names
            cv_names = [cert.get("name", "") for cert in cv_certs]
            jd_names = [cert.get("name", "") for cert in jd_certs]
            
            # Use skill matching for name similarity
            name_matches = self.calculate_skill_matches(cv_names, jd_names, threshold)
            
            cert_matches = []
            for name_match in name_matches:
                # Find original certification objects
                cv_idx = cv_names.index(name_match.cv_skill)
                jd_idx = jd_names.index(name_match.jd_skill)
                
                cv_score = float(cv_certs[cv_idx].get("score", 0))
                jd_score = float(jd_certs[jd_idx].get("score", 0))
                
                # Match requires both name similarity AND CV score >= JD score
                is_match = name_match.is_match and cv_score >= jd_score
                
                cert_matches.append(CertificationMatch(
                    cv_cert=name_match.cv_skill,
                    jd_cert=name_match.jd_skill,
                    cv_score=cv_score,
                    jd_score=jd_score,
                    is_match=is_match
                ))
            
            return cert_matches
            
        except Exception as e:
            print(f"Error calculating certification matches: {e}")
            return []
    
    def calculate_experience_match(
        self,
        cv_experience_level: str,
        jd_experience_levels: List[str]
    ) -> ExperienceMatch:
        """
        Calculate experience level matching.
        
        Args:
            cv_experience_level: CV experience level
            jd_experience_levels: List of acceptable JD experience levels
            
        Returns:
            ExperienceMatch object
        """
        if not cv_experience_level or not jd_experience_levels:
            return ExperienceMatch(
                cv_level=cv_experience_level,
                jd_levels=jd_experience_levels,
                is_match=False
            )
        
        try:
            cv_level_value = EXPERIENCE_LEVEL_MAP.get(cv_experience_level)
            if cv_level_value is None:
                return ExperienceMatch(
                    cv_level=cv_experience_level,
                    jd_levels=jd_experience_levels,
                    is_match=False
                )
            
            # Check if CV level meets any of the JD requirements
            is_match = any(
                cv_level_value >= EXPERIENCE_LEVEL_MAP.get(jd_level, float('inf'))
                for jd_level in jd_experience_levels
                if jd_level in EXPERIENCE_LEVEL_MAP
            )
            
            return ExperienceMatch(
                cv_level=cv_experience_level,
                jd_levels=jd_experience_levels,
                is_match=is_match
            )
            
        except Exception as e:
            print(f"Error calculating experience match: {e}")
            return ExperienceMatch(
                cv_level=cv_experience_level,
                jd_levels=jd_experience_levels,
                is_match=False
            )
    
    def match_cv_with_jd(
        self, 
        cv_data: Dict[str, Any], 
        jd_data: Dict[str, Any]
    ) -> MatchResult:
        """
        Perform comprehensive matching between CV and JD.
        
        Args:
            cv_data: CV data dictionary
            jd_data: JD data dictionary
            
        Returns:
            MatchResult object with detailed matching information
        """
        try:
            # Extract and clean CV skills (remove confidence scores in parentheses)
            cv_skills_raw = cv_data.get("skills", [])
            cv_skills = [skill.split(" (")[0] for skill in cv_skills_raw]
            jd_skills = jd_data.get("skills", [])
            
            # Calculate skill matches
            skill_matches = self.calculate_skill_matches(cv_skills, jd_skills)
            skill_match_count = sum(1 for match in skill_matches if match.is_match)
            skill_score_ratio = f"{skill_match_count}/{len(jd_skills)}" if jd_skills else "0/0"
            
            # Calculate certification matches
            cv_certs = cv_data.get("certifications", [])
            jd_certs = jd_data.get("certifications", [])
            cert_matches = self.calculate_certification_matches(cv_certs, jd_certs)
            cert_match_count = sum(1 for match in cert_matches if match.is_match)
            cert_score_ratio = f"{cert_match_count}/{len(jd_certs)}" if jd_certs else "0/0"
            
            # Calculate experience match
            cv_exp_level = cv_data.get("experienceLevel", "")
            jd_exp_levels = jd_data.get("experienceLevels", [])
            experience_match = self.calculate_experience_match(cv_exp_level, jd_exp_levels)
            exp_score_ratio = "1/1" if experience_match.is_match else "0/1"
            
            # Calculate overall score
            overall_score = self._calculate_overall_score(
                skill_matches, cert_matches, experience_match, jd_skills, jd_certs, jd_exp_levels
            )
            
            return MatchResult(
                overall_score=overall_score,
                skill_matches=skill_matches,
                cert_matches=cert_matches,
                experience_match=experience_match,
                skill_score_ratio=skill_score_ratio,
                cert_score_ratio=cert_score_ratio,
                experience_score_ratio=exp_score_ratio
            )
            
        except Exception as e:
            print(f"Error in CV-JD matching: {e}")
            return self._create_empty_result()
    
    def _calculate_overall_score(
        self,
        skill_matches: List[SkillMatch],
        cert_matches: List[CertificationMatch],
        experience_match: ExperienceMatch,
        jd_skills: List[str],
        jd_certs: List[Dict[str, Any]],
        jd_exp_levels: List[str]
    ) -> float:
        """Calculate weighted overall matching score."""
        score_components = []
        
        # Skills component
        if jd_skills:
            skill_score = sum(1 for match in skill_matches if match.is_match) / len(jd_skills)
            score_components.append(skill_score)
        
        # Certifications component
        if jd_certs:
            cert_score = sum(1 for match in cert_matches if match.is_match) / len(jd_certs)
            score_components.append(cert_score)
        
        # Experience component
        if jd_exp_levels:
            exp_score = 1.0 if experience_match.is_match else 0.0
            score_components.append(exp_score)
        
        return round(sum(score_components) / len(score_components), 3) if score_components else 0.0
    
    def _create_empty_result(self) -> MatchResult:
        """Create an empty MatchResult for error cases."""
        return MatchResult(
            overall_score=0.0,
            skill_matches=[],
            cert_matches=[],
            experience_match=ExperienceMatch(cv_level="", jd_levels=[], is_match=False),
            skill_score_ratio="0/0",
            cert_score_ratio="0/0",
            experience_score_ratio="0/0"
        )
    
    def to_dict(self, result: MatchResult) -> Dict[str, Any]:
        """
        Convert MatchResult to dictionary format for backward compatibility.
        
        Args:
            result: MatchResult object
            
        Returns:
            Dictionary representation of the match result
        """
        return {
            "score": result.overall_score,
            "details": {
                "skill_score": result.skill_score_ratio,
                "cert_score": result.cert_score_ratio,
                "exp_score": result.experience_score_ratio,
                "exp_match": 1 if result.experience_match.is_match else 0,
                "exp_detail": {
                    "cv_level": result.experience_match.cv_level,
                    "jd_required_levels": result.experience_match.jd_levels,
                    "match": 1 if result.experience_match.is_match else 0,
                },
                "skills_detail": [
                    {
                        "cv_skill": match.cv_skill,
                        "jd_skill": match.jd_skill,
                        "match": 1 if match.is_match else 0,
                        "score": match.score,
                    }
                    for match in result.skill_matches
                ],
                "certs_detail": [
                    {
                        "jd_cert": match.jd_cert,
                        "cv_cert": match.cv_cert,
                        "jd_score": str(match.jd_score),
                        "cv_score": str(match.cv_score),
                        "match": 1 if match.is_match else 0,
                    }
                    for match in result.cert_matches
                ],
            },
        }


# Legacy function for backward compatibility
def match_cv_with_jd(cv_data: Dict[str, Any], jd_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Legacy function wrapper for backward compatibility.
    
    Args:
        cv_data: CV data dictionary
        jd_data: JD data dictionary
        
    Returns:
        Dictionary with matching results
    """
    matcher = CVJDMatcher()
    result = matcher.match_cv_with_jd(cv_data, jd_data)
    return matcher.to_dict(result)