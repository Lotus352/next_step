package org.example.next_step.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "industries")
public class Industry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "industry_id")
    private Long industryId;

    @Column(name = "industry_name", unique = true, nullable = false)
    private String industryName;

    @ManyToMany(mappedBy = "industries")
    private Set<Company> companies;

    @Column(columnDefinition = "TEXT")
    private String icon;

    public Integer getCountJobs() {
        Set<Job> jobs = new HashSet<>();
        this.companies.stream().map(Company::getJobs).flatMap(Set::stream).forEach(jobs::add);
        return jobs.size();
    }
}
