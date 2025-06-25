package org.example.next_step.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Formula;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Long jobId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "salary_id", unique = true)
    private JobSalary salary;

    @Column(nullable = false)
    private String title;

    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;

    @Column(name = "detailed_description", columnDefinition = "LONGTEXT")
    private String detailedDescription;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "location_id")
    private Location location;

    @Column(name = "employment_type", length = 50)
    private String employmentType;

    @Column(name = "job_url", columnDefinition = "TEXT")
    private String jobUrl;

    @Column(name = "remote_allowed", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean remoteAllowed;

    @Column(name = "is_featured", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isFeatured;

    @Column(name = "interview_process")
    private Integer interviewProcess;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "status", columnDefinition = "VARCHAR(50) DEFAULT 'OPEN'")
    private String status;

    @Column(name = "is_deleted", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isDeleted;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "benefits", columnDefinition = "TEXT")
    private String benefits;

    @ManyToMany
    @JoinTable(
            name = "job_experience_levels",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "experience_id")
    )
    private Set<ExperienceLevel> experienceLevels;

    @ManyToMany
    @JoinTable(
            name = "job_skills",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    private Set<JobApplication> applications;

    @Formula("(SELECT COUNT(*) FROM job_applications ja WHERE ja.job_id = job_id)")
    private Integer appliedCount;

    @ManyToMany
    @JoinTable(
            name = "user_job_favorites",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> favoriteUsers = new HashSet<>();

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    private Set<Notification> notifications;

    @ManyToMany
    @JoinTable(
            name = "job_certifications",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "certification_id"))
    private Set<Certification> certifications;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<JobCertification> jobCertifications;


    public Boolean isFavorite(String username) {
        return favoriteUsers.stream().anyMatch(user -> user.getUsername().equals(username));
    }


}
