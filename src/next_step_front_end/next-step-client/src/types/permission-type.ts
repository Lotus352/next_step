import RoleType from "@/types/role-type.ts";

export default interface PermissionType {
    permissionId: number;
    permissionName: string;
    description: string;
    assignedRoles: RoleType[];
}
