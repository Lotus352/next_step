package org.example.next_step.mappers;

import org.example.next_step.dtos.requests.JobRequest;
import org.example.next_step.dtos.responses.JobFeaturedResponse;
import org.example.next_step.dtos.responses.JobResponse;
import org.example.next_step.models.*;
import org.example.next_step.repositories.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class JobMapper {

    public static JobResponse toDTO(Job job, String username) {
        if (job == null) return null;

        return JobResponse.builder()
                .jobId(job.getJobId())
                .title(job.getTitle())
                .shortDescription(job.getShortDescription())
                .detailedDescription(job.getDetailedDescription())
                .location(job.getLocation() != null ? LocationMapper.toDTO(job.getLocation()) : null)
                .employmentType(job.getEmploymentType())
                .jobUrl(job.getJobUrl())
                .remoteAllowed(job.getRemoteAllowed())
                .status(job.getStatus())
                .isDeleted(job.getIsDeleted())
                .isFeatured(job.getIsFeatured())
                .expiryDate(job.getExpiryDate())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .postedBy(job.getUser() != null ? UserMapper.toDTO(job.getUser()) : null)
                .salary(job.getSalary() != null ? JobSalaryMapper.toDTO(job.getSalary()) : null)
                .skills(job.getSkills() != null ? job.getSkills().stream().map(SkillMapper::toDTO).collect(Collectors.toSet()) : null)
                .experienceLevels(job.getExperienceLevels() != null ? job.getExperienceLevels().stream().map(ExperienceLevelMapper::toDTO).collect(Collectors.toSet()) : null)
                .benefits(job.getBenefits())
                .isFavorite(username != null ? job.isFavorite(username) : false)
                .appliedCount(job.getAppliedCount())
                .certifications(
                        job.getJobCertifications() != null
                                ? job.getJobCertifications().stream()
                                .map(JobCertificationMapper::toDTO)
                                .collect(Collectors.toSet())
                                : null
                )
                .build();
    }

    public static Job toEntity(JobRequest request,
                               UserRepository userRepo,
                               SkillRepository skillRepo,
                               ExperienceLevelRepository experienceLevelRepo) {
        if (request == null) return null;

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setShortDescription(request.getShortDescription());
        job.setDetailedDescription(request.getDetailedDescription());

        if (request.getLocation() != null) {
            Location location = Location.builder()
                    .city(request.getLocation().getCity())
                    .state(request.getLocation().getState())
                    .city(request.getLocation().getCity())
                    .countryName(request.getLocation().getCountryName())
                    .street(request.getLocation().getStreet())
                    .houseNumber(request.getLocation().getHouseNumber())
                    .build();
            job.setLocation(location);
        }

        job.setJobUrl(request.getJobUrl());
        job.setRemoteAllowed(request.getRemoteAllowed() != null ? request.getRemoteAllowed() : false);
        job.setIsDeleted(request.getIsDeleted() != null ? request.getIsDeleted() : false);
        job.setIsFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false);
        job.setStatus("OPEN");
        job.setCreatedAt(LocalDateTime.now());
        job.setUpdatedAt(LocalDateTime.now());
        job.setExpiryDate(request.getExpiryDate());
        job.setInterviewProcess(request.getInterviewProcess());
        job.setEmploymentType(request.getEmploymentType());

        User user = userRepo.findById(request.getUserId()).orElse(null);
        if (user != null) {
            job.setUser(user);
            job.setCompany(user.getCompany());
        }

        if (request.getSalary().getMinSalary() != null && request.getSalary().getMaxSalary() != null) {
            JobSalary salary = JobSalary.builder()
                    .minSalary(request.getSalary().getMinSalary())
                    .maxSalary(request.getSalary().getMaxSalary())
                    .currency(request.getSalary().getCurrency())
                    .payPeriod(request.getSalary().getPayPeriod())
                    .build();
            job.setSalary(salary);
        }

        if ((request.getSkillIds() != null) && !request.getSkillIds().isEmpty()) {
            Set<Skill> skills = new HashSet<>(skillRepo.findAllById(request.getSkillIds()));
            job.setSkills(skills);
        }

        if (request.getExperienceLevelIds() != null && !request.getExperienceLevelIds().isEmpty()) {
            Set<ExperienceLevel> experienceLevels = new HashSet<>(experienceLevelRepo.findAllById(request.getExperienceLevelIds()));
            job.setExperienceLevels(experienceLevels);
        }

        if (request.getBenefits() != null) {
            job.setBenefits(request.getBenefits());
        }

        if (request.getCertifications() != null && !request.getCertifications().isEmpty()) {
            Set<JobCertification> jobCertifications = request.getCertifications().stream()
                    .map(certReq -> JobCertificationMapper.toEntity(certReq, job))
                    .collect(Collectors.toSet());

            job.setJobCertifications(jobCertifications);
        }

        return job;
    }

    public static JobFeaturedResponse toJobFeaturedResponse(Job job, String username) {
        if (job == null) return null;

        Boolean isFavorite = job.isFavorite(username);

        return JobFeaturedResponse.builder()
                .jobId(job.getJobId())
                .title(job.getTitle())
                .shortDescription(job.getShortDescription())
                .location(job.getLocation() != null ? LocationMapper.toDTO(job.getLocation()) : null)
                .employmentType(job.getEmploymentType())
                .companyName(job.getCompany() != null ? job.getCompany().getName() : "Unknown Company")
                .companyLogo(job.getCompany() != null ? job.getCompany().getLogoUrl() : null)
                .skills(job.getSkills() != null ? job.getSkills().stream().map(SkillMapper::toDTO).collect(Collectors.toSet()) : null)
                .salary(JobSalaryMapper.toDTO(job.getSalary()))
                .createdAt(job.getCreatedAt())
                .isFavorite(isFavorite)
                .build();
    }


    public static void updateEntity(Job job, JobRequest request, CompanyRepository companyRepo,
                                    JobSalaryRepository jobSalaryRepo,
                                    SkillRepository skillRepo,
                                    ExperienceLevelRepository experienceLevelRepo) {
        if (request == null) return;

        if (request.getTitle() != null) job.setTitle(request.getTitle());
        if (request.getShortDescription() != null) job.setShortDescription(request.getShortDescription());
        if (request.getDetailedDescription() != null) job.setDetailedDescription(request.getDetailedDescription());
        if (request.getLocation() != null) job.setLocation(LocationMapper.toEntity(request.getLocation()));
        if (request.getEmploymentType() != null) job.setEmploymentType(request.getEmploymentType());
        if (request.getJobUrl() != null) job.setJobUrl(request.getJobUrl());
        if (request.getRemoteAllowed() != null) job.setRemoteAllowed(request.getRemoteAllowed());
        if (request.getIsDeleted() != null) job.setIsDeleted(request.getIsDeleted());
        if (request.getIsFeatured() != null) job.setIsFeatured(request.getIsFeatured());
        if (request.getExpiryDate() != null) job.setExpiryDate(request.getExpiryDate());
        if (request.getInterviewProcess() != null) job.setInterviewProcess(request.getInterviewProcess());

        if (request.getSalary().getMinSalary() != null && request.getSalary().getMaxSalary() != null) {
            if (job.getSalary() == null) {
                job.setSalary(new JobSalary());
            }
            job.getSalary().setMinSalary(request.getSalary().getMinSalary());
            job.getSalary().setMaxSalary(request.getSalary().getMaxSalary());
            job.getSalary().setCurrency(request.getSalary().getCurrency());
            job.getSalary().setPayPeriod(request.getSalary().getPayPeriod());
        }

        if (request.getSkillIds() != null && !request.getSkillIds().isEmpty()) {
            Set<Skill> skills = new HashSet<>(skillRepo.findAllById(request.getSkillIds()));
            job.setSkills(skills);
        }

        if (request.getExperienceLevelIds() != null && !request.getExperienceLevelIds().isEmpty()) {
            Set<ExperienceLevel> experienceLevels = new HashSet<>(experienceLevelRepo.findAllById(request.getExperienceLevelIds()));
            job.setExperienceLevels(experienceLevels);
        }

        if (request.getBenefits() != null) {
            job.setBenefits(request.getBenefits());
        }

        if (request.getCertifications() != null && !request.getCertifications().isEmpty()) {
            Set<JobCertification> jobCertifications = request.getCertifications().stream()
                    .map(certReq -> JobCertificationMapper.toEntity(certReq, job))
                    .collect(Collectors.toSet());

            job.setJobCertifications(jobCertifications);
        }

        job.setUpdatedAt(LocalDateTime.now());
    }
}
