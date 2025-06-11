package org.example.next_step.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.OptionalDouble;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "companies")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Long companyId;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String state;

    @Column(name = "zip_code", length = 20)
    private String zipCode;

    @Column(name = "count_employees")
    private String countEmployees;

    @Column(name = "company_url", columnDefinition = "TEXT")
    private String companyUrl;

    @Column(name = "logo_url", columnDefinition = "TEXT")
    private String logoUrl;

    @Column(name = "is_deleted", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isDeleted;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private Set<Job> jobs;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private Set<User> users;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private Set<User> employees;

    @Column(nullable = true)
    private String founded;

    @Column(name = "is_featured", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isFeatured;

    @ManyToMany
    @JoinTable(name = "company_industries", joinColumns = @JoinColumn(name = "company_id"), inverseJoinColumns = @JoinColumn(name = "industry_id"))
    private Set<Industry> industries;

    @ElementCollection
    @CollectionTable(name = "company_specialities", joinColumns = @JoinColumn(name = "company_id"))
    @Column(name = "speciality_name")
    private Set<String> specialities;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private Set<CompanyReview> companyReviews;

    public Float getAverageRating() {
        if (this.companyReviews == null || this.companyReviews.isEmpty()) {
            return 0.0f;
        }
        OptionalDouble average = this.companyReviews.stream().mapToDouble(review -> review.getRating().doubleValue()).average();
        return average.isPresent() ? (float) average.getAsDouble() : 0.0f;
    }

    public Integer getCountReview() {
        return this.companyReviews != null ? this.companyReviews.size() : 0;
    }

    public Set<Job> getJobOpening() {
        if (this.jobs == null) {
            return Collections.emptySet();
        }

        return this.jobs.stream()
                .filter(job -> Boolean.FALSE.equals(job.getIsDeleted()))
                .filter(job -> "OPEN".equalsIgnoreCase(job.getStatus()))
                .filter(job -> job.getExpiryDate() == null || job.getExpiryDate().isAfter(LocalDateTime.now()))
                .collect(Collectors.toSet());
    }

    public Integer getCountJobOpening() {
        return this.getJobOpening().size();
    }

}
