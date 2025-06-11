package org.example.next_step.mappers;

import org.example.next_step.dtos.requests.PermissionRequest;
import org.example.next_step.dtos.responses.PermissionResponse;
import org.example.next_step.models.Permission;

import java.util.stream.Collectors;

/**
 * Converts between Permission entity and DTOs.
 */
public class PermissionMapper {

    /* entity → dto */
    public static PermissionResponse toDTO(Permission permission) {
        if (permission == null) return null;
        return PermissionResponse.builder()
                .permissionId(permission.getPermissionId())
                .permissionName(permission.getPermissionName())
                .description(permission.getDescription())
                .build();
    }

    /* dto → entity */
    public static Permission toEntity(PermissionRequest request) {
        if (request == null) return null;
        Permission p = new Permission();
        p.setPermissionName(request.getPermissionName());
        p.setDescription(request.getDescription());
        return p;
    }

    public static void updateEntity(Permission target, PermissionRequest src) {
        if (src == null) return;
        if (src.getPermissionName() != null)
            target.setPermissionName(src.getPermissionName());
        if (src.getDescription() != null)
            target.setDescription(src.getDescription());
    }

    private PermissionMapper() {
    }
}
