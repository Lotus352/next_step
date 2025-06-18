import type UserType from "@/types/user-type"

export interface SkillMatch {
    cv_skill: string
    jd_skill: string
    match: number // Binary: 0 = no match, 1 = match
    score: number // Similarity score between 0 and 1
}

export interface CertMatch {
    jd_cert: string
    cv_cert: string
    jd_score: string
    cv_score: string
    match: number // Binary: 0 = no match, 1 = match
}

export interface ExpDetail {
    cv_level: string
    jd_required_levels: string[]
    match: number
}

export interface ScoreDetails {
    skill_score: string // Format: "x/y" where x is matches and y is total
    cert_score: string // Format: "x/y" where x is matches and y is total
    exp_score: string // Format: "x/y" where x is matches and y is total
    exp_match: number // Binary: 0 = no match, 1 = match
    exp_detail: ExpDetail
    skills_detail: SkillMatch[]
    certs_detail: CertMatch[] // Updated to use CertMatch type
}

export interface ScoreData {
    score: number
    details: ScoreDetails
}

export default interface JobApplicationType {
    applicationId: number
    applicant: UserType
    jobId: number
    resumeUrl: string
    score: string | ScoreData
    scoreMean?: number
    resumeContent: string | null
    coverLetter: string
    status: string | "PENDING"
    appliedAt: string
}

export interface JobApplicationRequest {
    userId: number
    jobId: number
    resumeUrl: string
    resumeContent: string | null
    score: string | ScoreData
    scoreMean?: number
    coverLetter: string
    status: string | "PENDING"
    appliedAt: string
}
