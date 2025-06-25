import JobType, { JobRequest } from "@/types/job-type";
import ExperienceLevelType from "@/types/experience-level-type";
import SkillType from "@/types/skill-type";

export const mapJobTypeToJobRequest = (job: JobType): JobRequest => {
  return {
    jobId: job.jobId,
    title: job.title,
    shortDescription: job.shortDescription,
    detailedDescription: job.detailedDescription,
    location: job.location,
    benefits: job.benefits,
    employmentType: job.employmentType,
    jobUrl: job.jobUrl,
    remoteAllowed: job.remoteAllowed,
    isDeleted: job.isDeleted,
    isFeatured: job.isFeatured,
    status: job.status,
    expiryDate: job.expiryDate,
    userId: job.postedBy.userId ?? 0, 
    companyId: job.postedBy.company ? job.postedBy.company.companyId : 0, 
    experienceLevelIds: job.experienceLevels.map((level: ExperienceLevelType) => level.experienceId),
    skillIds: job.skills.map((skill: SkillType) => skill.skillId),
    applicationIds: [], 
    salary: job.salary,
    interviewProcess: job.interviewProcess ?? 0,
    certifications: job.certifications ?? [],
  };
}; 