import CompanyType from "@/types/company-type.ts";

export default interface PostedBy {
    userId: number;
    username: string;
    email: string;
    fullName: string;
    avatarUrl: string | null;
    resumeUrl: string | null;
    company: CompanyType;
}