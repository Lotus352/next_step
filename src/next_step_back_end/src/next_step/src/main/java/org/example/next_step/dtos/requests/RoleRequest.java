package org.example.next_step.dtos.requests;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoleRequest {
    private Long roleId;
    private String roleName;
    private String description;
    private Set<Long> permissionIds;
}
