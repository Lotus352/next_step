package org.example.next_step.dtos.requests;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PermissionRequest {
    private Long permissionId;
    private String permissionName;
    private String description;
    private Set<Long> roleIds;
}
