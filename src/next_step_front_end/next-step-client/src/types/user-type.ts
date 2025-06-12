import CompanyType from "@/types/company-type.ts";
import experienceLevelType from "@/types/experience-level-type.ts";
import SkillType from "@/types/skill-type.ts";
import RoleType from "@/types/role-type.ts";
import { DEFAULT_STATUS } from "@/constants";

export default interface UserType {
    userId: number;
    roles: RoleType[];
    username: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    resumeUrl: string | null;
    nationality: string | null;
    phoneNumber: string;
    status: string | typeof DEFAULT_STATUS;
    company: CompanyType | null;
    experienceLevel: experienceLevelType | null;
    skills: SkillType[];
}
