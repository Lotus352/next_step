package org.example.next_step.dtos.requests;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import org.example.next_step.models.enums.ApplicationStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobApplicationRequest {
    private Long applicationId;
    private Long userId;
    private Long jobId;
    private String resumeUrl;
    private String resumeContent;
    private String score;
    private Double scoreMean;
    private String coverLetter;


    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    private LocalDateTime appliedAt;
}
