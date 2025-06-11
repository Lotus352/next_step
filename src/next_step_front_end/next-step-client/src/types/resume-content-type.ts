export interface Certification {
    name: string
    score: number
}

export interface Education {
    degree: string
    school: string
    graduationYear: number
}

export interface WorkExperience {
    company: string
    role: string
    duration: string
    description: string
}

export interface Award {
    name: string
    issuer?: string
    date?: string
    description?: string
}

export interface Project {
    name: string
    description: string
    technologies: string[]
    role: string
    url?: string
}

export interface ResumeContent {
    summary: string
    experienceLevel: string
    skills: string[]
    certifications: Certification[]
    education: Education[]
    workExperience: WorkExperience[]
    awards: Award[]
    projects: Project[]
}
