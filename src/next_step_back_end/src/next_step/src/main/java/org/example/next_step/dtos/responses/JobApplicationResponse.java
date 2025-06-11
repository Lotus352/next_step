package org.example.next_step.dtos.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.example.next_step.models.enums.ApplicationStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobApplicationResponse {
    private Long applicationId;
    private UserResponse applicant;
    private JobResponse job;
    private String resumeUrl;
    private String resumeContent;
    private String score;
    private Double scoreMean;
    private String coverLetter;
    private ApplicationStatus status;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime appliedAt;
}
