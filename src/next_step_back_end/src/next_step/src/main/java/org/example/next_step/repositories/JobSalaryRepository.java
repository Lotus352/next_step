package org.example.next_step.repositories;

import org.example.next_step.models.JobSalary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobSalaryRepository extends JpaRepository<JobSalary, Long> {

    @Query("SELECT js FROM JobSalary js WHERE js.currency = :currency AND js.payPeriod = :payPeriod")
    List<JobSalary> findByCurrencyAndPayPeriod(String currency, String payPeriod);

    @Query("SELECT DISTINCT js.currency FROM JobSalary js")
    List<String> findDistinctCurrencies();

    @Query("SELECT DISTINCT js.payPeriod FROM JobSalary js")
    List<String> findDistinctPayPeriods();

    @Query("SELECT MIN(js.minSalary) FROM JobSalary js")
    double findMinSalary();

    @Query("SELECT MAX(js.maxSalary) FROM JobSalary js")
    double findMaxSalary();
}