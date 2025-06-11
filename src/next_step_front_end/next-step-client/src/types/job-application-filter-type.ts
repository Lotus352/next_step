export default interface JobApplicationFilterType {
  status: string | null;
  keyword: string | null;
  sortBy: string | "createdAt";
  sortDirection: string | "DESC";
}
