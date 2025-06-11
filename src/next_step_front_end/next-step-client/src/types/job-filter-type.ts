import SalaryRangeType from "@/types/salary-range-type.ts";

export default interface jobFilterType {
  country: string | null;
  city: string | null;
  employmentType: string | null;
  experienceLevels: string[];
  salaryRange: SalaryRangeType;
  payPeriod: string | null;
  currency: string | null;
  skills: string[];
  datePosted: string | null;

  keyword: string | null;
  sortBy: string | "createdAt";
  sortDirection: string | "DESC";
}
