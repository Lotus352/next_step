package org.example.next_step.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "experience_levels")
public class ExperienceLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "experience_id")
    private Long experienceId;

    @Column(name = "experience_name", unique = true, nullable = false, length = 100)
    private String experienceName;

    @OneToMany(mappedBy = "experienceLevel", cascade = CascadeType.ALL)
    private Set<User> users;
}
