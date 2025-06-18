import IndustryType from "@/types/industry-type.ts";
import LocationType, {LocationRequest} from "@/types/location-type.ts";

export default interface CompanyType {
  companyId: number;
  name: string;
  description: string | null;
  countEmployees: number | null;
  zipCode: string | null;
  location: LocationType;
  companyUrl: string | null;
  logoUrl: string | null;
  isDeleted: boolean | null;
  specialities: string[];
  industries: IndustryType[];
  founded: boolean | null;

  countJobOpening: number | 0;
  countReview: number | 0;
  averageRating: number | 5;
}

export interface CompanyRequest {
  name: string;
  description: string | null;
  location: LocationRequest;
  zipCode: string | null;
  companyUrl: string | null;
  logoUrl: string | null;
  isDeleted: boolean | null;
  specialities: string[];
  industryIds: number[];
  jobIds: number[];
  userIds: number[];
  countEmployees: number | null;
  founded: boolean | null;
}
