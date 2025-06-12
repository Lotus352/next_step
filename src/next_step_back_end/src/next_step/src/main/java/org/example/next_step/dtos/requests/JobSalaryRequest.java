package org.example.next_step.dtos.requests;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobSalaryRequest {
    private Double minSalary;
    private Double maxSalary;
    private String currency;
    private String payPeriod;
}
