export default interface UserFilterType {
    keyword?: string;
    role?: string;
    isDeleted?: boolean;
    sortBy?: string;
    sortDirection?: "ASC" | "DESC";
}
