import PermissionType from "@/types/permission-type.ts";

export default interface RoleType {
    roleId: number;
    roleName: string;
    description: string;
    permissions: PermissionType[];
}
