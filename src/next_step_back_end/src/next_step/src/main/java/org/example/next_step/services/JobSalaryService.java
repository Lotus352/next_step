package org.example.next_step.services;

import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.JobSalaryRequest;
import org.example.next_step.dtos.responses.JobSalaryRangeResponse;
import org.example.next_step.dtos.responses.JobSalaryResponse;
import org.example.next_step.mappers.JobSalaryMapper;
import org.example.next_step.models.JobSalary;
import org.example.next_step.repositories.JobSalaryRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Business logic for JobSalary entity.
 */
@Service
@RequiredArgsConstructor
public class JobSalaryService {

    private final JobSalaryRepository repo;

    /* ---------- queries ---------- */

    @Transactional(readOnly = true)
    public Page<JobSalaryResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("currency", "payPeriod"));
        return repo.findAll(pageable).map(JobSalaryMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<String> findAllCurrencies() {
        return repo.findDistinctCurrencies();
    }

    @Transactional(readOnly = true)
    public List<String> findAllPayPeriods() {
        return repo.findDistinctPayPeriods();
    }

    /**
     * Returns min / max salary for a given currency + pay period.
     */
    @Transactional(readOnly = true)
    public JobSalaryRangeResponse findSalaryRange(String currency, String payPeriod) {
        List<JobSalary> list = repo.findByCurrencyAndPayPeriod(currency, payPeriod);

        if (list.isEmpty()) {
            throw new RuntimeException(
                    "No salary records for currency '" + currency + "' and pay period '" + payPeriod + "'.");
        }

        double min = list.stream().mapToDouble(JobSalary::getMinSalary).min().orElseThrow();
        double max = list.stream().mapToDouble(JobSalary::getMaxSalary).max().orElseThrow();

        return new JobSalaryRangeResponse(min, max);
    }

    @Transactional(readOnly = true)
    public JobSalaryRangeResponse findMaxMinSalary() {
        double min = repo.findMinSalary();
        double max = repo.findMaxSalary();
        return new JobSalaryRangeResponse(min, max);
    }

    @Transactional(readOnly = true)
    public JobSalaryResponse findById(Long id) {
        JobSalary salary = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Salary record not found"));
        return JobSalaryMapper.toDTO(salary);
    }

    /* ---------- commands ---------- */

    @Transactional
    public JobSalaryResponse create(JobSalaryRequest request) {
        JobSalary entity = JobSalaryMapper.toEntity(request);
        return JobSalaryMapper.toDTO(repo.save(entity));
    }

    @Transactional
    public JobSalaryResponse update(Long id, JobSalaryRequest request) {
        JobSalary existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Salary record not found"));
        JobSalaryMapper.updateEntity(existing, request);
        return JobSalaryMapper.toDTO(repo.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
