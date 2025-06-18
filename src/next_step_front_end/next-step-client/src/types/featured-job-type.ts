import SkillType from "@/types/skill-type.ts";
import SalaryType from "@/types/salary-type.ts";
import LocationType from "@/types/location-type.ts";

export default interface FeaturedJobType {
    jobId: number;
    title: string ;
    shortDescription: string | null;
    location: LocationType | null;
    employmentType: string |null;
    companyName: string;
    companyLogo: string | null;
    skills: SkillType[];
    salary: SalaryType | null;
    createdAt: string;
    isFavorite: boolean | null;
}