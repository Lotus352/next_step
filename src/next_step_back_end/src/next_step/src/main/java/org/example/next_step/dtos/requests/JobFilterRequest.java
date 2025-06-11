package org.example.next_step.dtos.requests;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobFilterRequest {
    private String country;
    private String city;
    private String employmentType;
    private List<String> experienceLevels;
    private String payPeriod;
    private JobSalaryRangeRequest salaryRange;
    private List<String> skills;
    private String datePosted;
    private String keyword;
    private String sortBy;
    private String sortDirection;
    private String currency;
}