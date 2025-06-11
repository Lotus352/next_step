package org.example.next_step.mappers;

import org.example.next_step.dtos.requests.RoleRequest;
import org.example.next_step.dtos.responses.RoleResponse;
import org.example.next_step.models.Permission;
import org.example.next_step.models.Role;
import org.example.next_step.repositories.PermissionRepository;

import java.util.HashSet;
import java.util.stream.Collectors;

public class RoleMapper {

    public static RoleResponse toDTO(Role role) {
        if (role == null) {
            return null;
        }
        return RoleResponse.builder()
                .roleId(role.getRoleId())
                .roleName(role.getRoleName())
                .description(role.getDescription())
                .permissions(role.getPermissions() != null
                        ? role.getPermissions().stream()
                        .map(PermissionMapper::toDTO)
                        .collect(Collectors.toSet())
                        : null)
                .build();
    }

    public static Role toEntity(RoleRequest request, PermissionRepository permissionRepo) {
        if (request == null) {
            return null;
        }
        Role role = new Role();
        role.setRoleName(request.getRoleName());
        role.setDescription(request.getDescription());
        if (request.getPermissionIds() != null && !request.getPermissionIds().isEmpty()) {
            var permissions = new HashSet<Permission>(permissionRepo.findAllById(request.getPermissionIds()));
            role.setPermissions(permissions);
        }
        return role;
    }
}
