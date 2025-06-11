package org.example.next_step.dtos.responses;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmploymentTypeResponse {
    private Long employmentTypeId;
    private String employmentTypeName;
}