package org.example.next_step.dtos.requests;

import lombok.*;
import org.example.next_step.models.enums.ApplicationStatus;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobApplicationFilterRequest {
    private ApplicationStatus status;
    private String keyword;
    private String sortBy;
    private String sortDirection;
}
