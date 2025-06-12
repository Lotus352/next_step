package org.example.next_step.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "user_experience_levels")
@IdClass(UserExperienceId.class)
public class UserExperience {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Id
    @Column(name = "experience_id")
    private Long experienceId;

    @Column(name = "title")
    private String title;

    @Column(name = "company")
    private String company;

    @Column(name = "location")
    private String location;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // Relationship mapping
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "experience_id", insertable = false, updatable = false)
    private ExperienceLevel experienceLevel;
}