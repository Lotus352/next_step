package org.example.next_step.dtos.responses;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobSalaryResponse {
    private Long salaryId;
    private Double minSalary;
    private Double maxSalary;
    private String currency;
    private String payPeriod;
}
