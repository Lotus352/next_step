package org.example.next_step.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobSalaryRangeResponse {
    private Double minSalary;
    private Double maxSalary;
}