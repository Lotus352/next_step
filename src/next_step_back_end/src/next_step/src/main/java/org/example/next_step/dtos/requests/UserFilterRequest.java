package org.example.next_step.dtos.requests;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFilterRequest {
    private String keyword;
    private String role;
    private Boolean isDeleted;
    private String sortBy;
    private String sortDirection;
}
