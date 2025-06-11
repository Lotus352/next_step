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
@Table(name = "certifications")
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certification_id")
    private Long certificationId;

    @Column(name = "certification_name", unique = true, nullable = false)
    private String certificationName;

    @OneToMany(mappedBy = "certification", cascade = CascadeType.ALL)
    private Set<JobCertification> jobCertifications;
}
