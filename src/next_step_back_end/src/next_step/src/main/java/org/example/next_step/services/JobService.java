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

        if (request.getEmploymentType() != null && request.getEmploymentType().equals("all")) {
            request.setEmploymentType(null);
        }
        if (request.getCity() != null && request.getCity().equals("all")) {
            request.setCity(null);
        }
        if (request.getCountry() != null && request.getCountry().equals("all")) {
            request.setCountry(null);
        }

        String candidateUsername = username;

        if (username != null) {
            User user = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException(""));
            Set<Role> roles = user.getRoles();
            if (roles.stream().anyMatch(r -> r.getRoleName().equals("CANDIDATE"))) {
                username = null;
            }
        }

        Pageable pageable = PageRequest.of(
                page, size,
                Sort.by(Sort.Direction.fromString(
                                StringUtils.hasText(request.getSortDirection())
                                        ? request.getSortDirection()
                                        : "DESC"),
                        StringUtils.hasText(request.getSortBy())
                                ? request.getSortBy()
                                : "createdAt"));

        LocalDateTime createdAfter = null;
        String datePosted = request.getDatePosted();

        if (StringUtils.hasText(datePosted) && !"all".equalsIgnoreCase(datePosted)) {
            switch (datePosted.toLowerCase()) {
                case "day":
                    createdAfter = LocalDateTime.now().minusDays(1);
                    break;
                case "week":
                    createdAfter = LocalDateTime.now().minusWeeks(1);
                    break;
                case "month":
                    createdAfter = LocalDateTime.now().minusMonths(1);
                    break;
            }
        }

        Page<Job> jobs = jobRepo.findJobsByFilter(
                StringUtils.hasText(request.getCountry()) ? request.getCountry() : null,
                StringUtils.hasText(request.getCity()) ? request.getCity() : null,
                StringUtils.hasText(request.getEmploymentType()) ? request.getEmploymentType() : null,
                request.getSalaryRange() != null ? request.getSalaryRange().getMinSalary() : null,
                request.getSalaryRange() != null ? request.getSalaryRange().getMaxSalary() : null,
                request.getExperienceLevels() != null && !request.getExperienceLevels().isEmpty()
                        ? request.getExperienceLevels() : null,
                request.getSkills() != null && !request.getSkills().isEmpty()
                        ? request.getSkills() : null,
                createdAfter,
                StringUtils.hasText(request.getKeyword()) ? request.getKeyword() : null,
                StringUtils.hasText(request.getCurrency()) ? request.getCurrency() : null,
                StringUtils.hasText(request.getPayPeriod()) ? request.getPayPeriod() : null,
                username,
                pageable);

        return jobs.map(j -> JobMapper.toDTO(j, candidateUsername));
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
}
