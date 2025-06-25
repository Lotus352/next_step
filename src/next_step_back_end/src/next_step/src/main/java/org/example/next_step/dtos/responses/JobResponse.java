package org.example.next_step.dtos.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobResponse {
    private Long jobId;
    private String title;
    private String shortDescription;
    private String detailedDescription;
    private LocationResponse location;
    private String employmentType;
    private String jobUrl;
    private Boolean remoteAllowed;
    private String status;
    private Boolean isDeleted;
    private Boolean isFeatured;
    private Integer interviewProcess;
    private String benefits;
    private Integer appliedCount;
    private Set<JobCertificationResponse> certifications;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expiryDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    private UserResponse postedBy;
    private Set<SkillResponse> skills;
    private Set<ExperienceLevelResponse> experienceLevels;
    private JobSalaryResponse salary;
    private Boolean isFavorite;
}
