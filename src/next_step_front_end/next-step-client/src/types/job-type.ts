import SkillType from "@/types/skill-type.ts";
import SalaryType from "@/types/salary-type.ts";
import LocationType from "@/types/location-type.ts";
import PostedBy from "@/types/post-py-type.ts";
import ExperienceLevelType from "@/types/experience-level-type.ts";

export default interface JobType {  
  jobId: number;
  title: string;
  shortDescription: string | null;
  detailedDescription: string;
  location: LocationType | null;
  benefits: string | null;
  employmentType: string | null;
  jobUrl: string | null;
  remoteAllowed: boolean | null;
  status: string;
  isDeleted: boolean ;
  isFeatured: boolean;
  interviewProcess: number | null;
  expiryDate: string | null;
  createdAt: string;
  updatedAt: string;
  postedBy: PostedBy;
  skills: SkillType[];
  experienceLevels: ExperienceLevelType[];
  salary: SalaryType;
  isFavorite: boolean;
}

export interface JobRequest {
  jobId: number | null;
  title: string;
  shortDescription: string | null;
  detailedDescription: string;
  location: LocationType | null;
  benefits: string | null;
  employmentType: string | null;
  jobUrl: string | null;
  remoteAllowed: boolean | null;
  isDeleted: boolean;
  isFeatured: boolean;
  status: string;
  expiryDate: string | null;
  userId: number | null;
  companyId: number ;
  experienceLevelIds: number[];
  skillIds: number[];
  applicationIds: number[];
  salary: SalaryType;
  interviewProcess: number;
}

