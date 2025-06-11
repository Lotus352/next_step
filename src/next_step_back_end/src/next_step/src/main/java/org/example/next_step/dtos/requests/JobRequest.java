package org.example.next_step.dtos.requests;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobRequest {
    private Long jobId;
    private String title;
    private String shortDescription;
    private String detailedDescription;
    private LocationRequest location;
    private String employmentType;
    private String jobUrl;
    private Boolean remoteAllowed;
    private Boolean isDeleted;
    private Boolean isFeatured;
    private String status;
    private LocalDateTime expiryDate;
    private Long userId;
    private Set<Long> experienceLevelIds;
    private Set<Long> skillIds;
    private Set<Long> applicationIds;
    private JobSalaryRequest salary;
    private Integer interviewProcess;
    private String benefits;
}
