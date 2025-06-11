package org.example.next_step.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "job_salaries")
public class JobSalary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "salary_id")
    private Long salaryId;

    @Column(name = "min_salary", nullable = false)
    private Double minSalary;

    @Column(name = "max_salary", nullable = false)
    private Double maxSalary;

    @Column(name = "currency", nullable = false, length = 10)
    private String currency;

    @Column(name = "pay_period", nullable = false, length = 50)
    private String payPeriod;

    @OneToOne(mappedBy = "salary")
    private Job job;
}
