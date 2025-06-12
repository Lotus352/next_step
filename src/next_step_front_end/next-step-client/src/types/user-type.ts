import CompanyType from "@/types/company-type.ts";
import experienceLevelType from "@/types/experience-level-type.ts";
import SkillType from "@/types/skill-type.ts";
import RoleType from "@/types/role-type.ts";
import { DEFAULT_STATUS } from "@/constants";

export interface UserExperienceType {
    userId: number;
    experienceId: number;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string | null;
    description: string;
    experienceLevel: experienceLevelType;
}

export default interface UserType {
    userId: number;
    roles: RoleType[];
    username: string;
    email: string;
    bio: string | null;
    fullName: string | null;
    avatarUrl: string | null;
    resumeUrl: string | null;
    nationality: string | null;
    phoneNumber: string;
    status: string | typeof DEFAULT_STATUS;
    company: CompanyType | null;
    experiences: UserExperienceType[] | null;
    skills: SkillType[];
}

export interface UserRequest {
    username: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    resumeUrl: string | null;
    phoneNumber: string;
    nationality: string | null;
    bio: string | null;
    status: string | null;
    companyId: number | null;
    skillIds: number[];
    roleIds: number[];
    experiences: UserExperienceType[];
}
