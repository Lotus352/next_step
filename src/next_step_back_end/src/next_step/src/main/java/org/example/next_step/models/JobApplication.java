package org.example.next_step.models;

import jakarta.persistence.*;
import lombok.*;
import org.example.next_step.models.enums.ApplicationStatus;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "job_applications")
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "resume_url", columnDefinition = "TEXT")
    private String resumeUrl;

    @Column(name = "resume_content", columnDefinition = "TEXT")
    private String resumeContent;

    @Column(columnDefinition = "TEXT")
    private String score;

    @Column(name = "score_mean")
    private Double scoreMean;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ApplicationStatus status;

    @Column(name = "applied_at")
    private LocalDateTime appliedAt;
}
