package org.example.next_step.dtos.requests;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobSalaryRangeRequest {
    private Double minSalary;
    private Double maxSalary;
}