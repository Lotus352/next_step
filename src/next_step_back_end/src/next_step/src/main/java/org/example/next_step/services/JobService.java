package org.example.next_step.services;

import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.JobFilterRequest;
import org.example.next_step.dtos.requests.JobRequest;
import org.example.next_step.dtos.responses.JobFeaturedResponse;
import org.example.next_step.dtos.responses.JobResponse;
import org.example.next_step.mappers.JobMapper;
import org.example.next_step.models.Job;
import org.example.next_step.models.Role;
import org.example.next_step.models.User;
import org.example.next_step.repositories.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobRepo;
    private final CompanyRepository companyRepo;
    private final JobSalaryRepository jobSalaryRepo;
    private final SkillRepository skillRepo;
    private final ExperienceLevelRepository experienceRepo;
    private final UserRepository userRepo;

    @Transactional(readOnly = true)
    public Set<String> getEmploymentTypes() {
        return jobRepo.findAll()
                .stream()
                .map(Job::getEmploymentType)
                .filter(StringUtils::hasText)
                .collect(Collectors.toSet());
    }

    @Transactional(readOnly = true)
    public Set<JobFeaturedResponse> getFeaturedJobs(int size,
                                                    String filterEmploymentType,
                                                    String username) {

        return jobRepo.findByIsFeaturedTrueAndIsDeletedFalse()
                .stream()
                .filter(j -> filterEmploymentType.isBlank()
                        || filterEmploymentType.equalsIgnoreCase(j.getEmploymentType()))
                .limit(size)
                .map(j -> JobMapper.toJobFeaturedResponse(j, username))
                .collect(Collectors.toSet());
    }

    @Transactional(readOnly = true)
    public JobResponse findById(Long id, String username) {
        Job job = jobRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return JobMapper.toDTO(job, username);
    }

    @Transactional(readOnly = true)
    public Page<JobResponse> filter(int page,
                                    int size,
                                    JobFilterRequest request,
                                    String username) {

        normalizeAllFields(request);

        Pageable pageable = PageRequest.of(
                page, size,
                Sort.by(Sort.Direction.fromString(
                                StringUtils.hasText(request.getSortDirection()) ? request.getSortDirection() : "DESC"),
                        StringUtils.hasText(request.getSortBy()) ? request.getSortBy() : "createdAt")
        );

        LocalDateTime createdAfter = resolveCreatedAfter(request.getDatePosted());

        final String candidateUsername;
        final String employerUsername;

        if (StringUtils.hasText(username)) {
            User user = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Set<Role> roles = user.getRoles();
            candidateUsername = roles.stream().anyMatch(r -> "CANDIDATE".equals(r.getRoleName())) ? user.getUsername() : null;
            employerUsername = roles.stream().anyMatch(r -> "EMPLOYER".equals(r.getRoleName())) ? user.getUsername() : null;
        } else {
            candidateUsername = null;
            employerUsername = null;
        }

        // 5. Query job filter
        Page<Job> jobs = jobRepo.findJobsByFilter(
                request.getCountry(),
                request.getCity(),
                request.getEmploymentType(),
                request.getSalaryRange() != null ? request.getSalaryRange().getMinSalary() : null,
                request.getSalaryRange() != null ? request.getSalaryRange().getMaxSalary() : null,
                (request.getExperienceLevels() != null && !request.getExperienceLevels().isEmpty()) ? request.getExperienceLevels() : null,
                (request.getSkills() != null && !request.getSkills().isEmpty()) ? request.getSkills() : null,
                createdAfter,
                request.getKeyword(),
                request.getCurrency(),
                request.getPayPeriod(),
                employerUsername,
                pageable
        );

        return jobs.map(job -> JobMapper.toDTO(job, candidateUsername));
    }

    /* ---------- commands ---------- */

    @Transactional
    public JobResponse create(JobRequest request) {
        Job entity = JobMapper.toEntity(
                request,
                userRepo,
                skillRepo,
                experienceRepo);

        return JobMapper.toDTO(jobRepo.save(entity), null);
    }

    @Transactional
    public JobResponse update(Long id, JobRequest request) {
        Job existing = jobRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        JobMapper.updateEntity(
                existing,
                request,
                companyRepo,
                jobSalaryRepo,
                skillRepo,
                experienceRepo);

        return JobMapper.toDTO(jobRepo.save(existing), null);
    }

    @Transactional
    public void toggleFavoriteJob(Long id, String username) {
        Job job = jobRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (job.isFavorite(username)) {
            job.getFavoriteUsers().remove(user);
        } else {
            job.getFavoriteUsers().add(user);
        }
    }

    @Transactional
    public void delete(Long id) {
        Job job = jobRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with id: " + id));

        if (Boolean.TRUE.equals(job.getIsDeleted())) {
            throw new IllegalStateException("Job is already deleted");
        }

        job.setIsDeleted(true);
        job.setUpdatedAt(LocalDateTime.now());
        jobRepo.save(job);
    }

    private void normalizeAllFields(JobFilterRequest request) {
        if ("all".equalsIgnoreCase(request.getEmploymentType())) {
            request.setEmploymentType(null);
        }
        if ("all".equalsIgnoreCase(request.getCity())) {
            request.setCity(null);
        }
        if ("all".equalsIgnoreCase(request.getCountry())) {
            request.setCountry(null);
        }
        if ("all".equalsIgnoreCase(request.getCurrency())) {
            request.setCurrency(null);
        }
        if ("all".equalsIgnoreCase(request.getPayPeriod())) {
            request.setPayPeriod(null);
        }
    }

    private LocalDateTime resolveCreatedAfter(String datePosted) {
        if (!StringUtils.hasText(datePosted) || "all".equalsIgnoreCase(datePosted)) return null;

        return switch (datePosted.toLowerCase()) {
            case "day" -> LocalDateTime.now().minusDays(1);
            case "week" -> LocalDateTime.now().minusWeeks(1);
            case "month" -> LocalDateTime.now().minusMonths(1);
            default -> null;
        };
    }

}
