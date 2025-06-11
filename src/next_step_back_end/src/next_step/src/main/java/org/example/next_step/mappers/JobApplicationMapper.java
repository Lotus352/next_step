package org.example.next_step.mappers;

import org.example.next_step.dtos.requests.JobApplicationRequest;
import org.example.next_step.dtos.responses.JobApplicationResponse;
import org.example.next_step.models.Job;
import org.example.next_step.models.JobApplication;
import org.example.next_step.models.User;
import org.example.next_step.repositories.JobRepository;
import org.example.next_step.repositories.UserRepository;

public class JobApplicationMapper {

    public static JobApplicationResponse toDTO(JobApplication application) {
        if (application == null) {
            return null;
        }
        return JobApplicationResponse.builder()
                .applicationId(application.getApplicationId())
                .applicant(UserMapper.toDTO(application.getUser()))
                .job(JobMapper.toDTO(application.getJob(), null))
                .resumeUrl(application.getResumeUrl())
                .resumeContent(application.getResumeContent())
                .coverLetter(application.getCoverLetter())
                .score(application.getScore())
                .scoreMean(application.getScoreMean())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .build();
    }

    public static JobApplication toEntity(
            JobApplicationRequest request,
            UserRepository userRepository,
            JobRepository jobRepository
    ) {
        if (request == null) {
            return null;
        }
        JobApplication application = new JobApplication();
        if (request.getJobId() != null) {
            Job job = jobRepository.findById(request.getJobId())
                    .orElseThrow(() -> new RuntimeException("Job not found"));
            application.setJob(job);
        }
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            application.setUser(user);
        }
        if (request.getResumeUrl() != null) {
            application.setResumeUrl(request.getResumeUrl());
        }
        if (request.getResumeContent() != null) {
            application.setResumeContent(request.getResumeContent());
        }
        if (request.getScore() != null) {
            application.setScore(request.getScore());
        }
        if (request.getScoreMean() != null) {
            application.setScoreMean(request.getScoreMean());
        }
        if (request.getCoverLetter() != null) {
            application.setCoverLetter(request.getCoverLetter());
        }
        if (request.getStatus() != null) {
            application.setStatus(request.getStatus());
        }
        if (request.getAppliedAt() != null) {
            application.setAppliedAt(request.getAppliedAt());
        }

        return application;
    }
}
