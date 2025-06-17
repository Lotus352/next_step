package org.example.next_step.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.JobApplicationFilterRequest;
import org.example.next_step.dtos.responses.JobApplicationInformationResponse;
import org.example.next_step.dtos.responses.JobApplicationResponse;
import org.example.next_step.mappers.JobApplicationMapper;
import org.example.next_step.models.*;
import org.example.next_step.models.enums.ApplicationStatus;
import org.example.next_step.repositories.JobApplicationRepository;
import org.example.next_step.repositories.JobRepository;
import org.example.next_step.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository applicationRepo;
    private final JobRepository jobRepo;
    private final UserRepository userRepo;
    private final Cloudinary cloudinary;

    @Value("${python.api-url}")
    private String pythonApiUrl;

    public Page<JobApplicationResponse> filterApplicationByJob(Long jobId, int page, int size, JobApplicationFilterRequest filter) {
        Pageable pageable = createPageable(page, size, filter);
        String keyword = filter.getKeyword();

        if (keyword != null && keyword.trim().isEmpty()) {
            keyword = null;
        }

        return applicationRepo.filterApplicationsByJobId(jobId, filter.getStatus(), keyword, pageable)
                .map(JobApplicationMapper::toDTO);
    }

    public JobApplicationInformationResponse getInfoByJob(Long jobId) {
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Set<JobApplication> apps = applicationRepo.findByJobJobId(jobId);

        return JobApplicationInformationResponse.builder()
                .jobId(jobId)
                .expiryDate(job.getExpiryDate())
                .countJobApplications(apps.size())
                .interviewProcess(job.getInterviewProcess())
                .build();
    }

    public JobApplicationResponse findById(Long id) {
        return applicationRepo.findById(id)
                .map(JobApplicationMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    /* ---------- commands ---------- */

    @Transactional
    public String uploadResume(MultipartFile file, Long userId, Long jobId, String coverLetter) {
        // Step 1: Upload file to Cloudinary
        String resumeUrl = uploadToCloudinary(file);

        // Step 2: Extract CV data using Python service
        String resumeContent = parseResume(file);

        // Step 3: Build job description JSON and calculate matching score
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        String jdJson = buildJobDescriptionJson(job);
        String scoreJson = calculateMatchingScore(resumeContent, jdJson);

        // Step 4: Save application with all data
        saveApplication(userId, job, resumeUrl, coverLetter, resumeContent, scoreJson);

        return resumeUrl;
    }

    @Transactional
    public void status(Long id, String status) {
        JobApplication app = applicationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        try {
            app.setStatus(ApplicationStatus.valueOf(status));
            applicationRepo.save(app);
        } catch (Exception e) {
            throw new RuntimeException("Change status failed: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void delete(Long id) {
        applicationRepo.deleteById(id);
    }

    /* ---------- helper ---------- */

    private Pageable createPageable(int page, int size, JobApplicationFilterRequest filter) {
        // Determine sort field
        String sortField = switch (filter.getSortBy() != null ? filter.getSortBy() : "appliedAt") {
            case "status" -> "status";
            case "fullname" -> "user.fullName";
            default -> "appliedAt";
        };

        // Determine sort direction
        Sort.Direction dir = "asc".equalsIgnoreCase(filter.getSortDirection())
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        return PageRequest.of(page, size, Sort.by(dir, sortField));
    }

    private String uploadToCloudinary(MultipartFile file) {
        try {
            // Validate file
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("File must not be empty.");
            }

            // Prepare file info
            String original = file.getOriginalFilename().toLowerCase();
            byte[] bytes = file.getBytes();
            String ext = original.substring(original.lastIndexOf('.'));
            String name = "cv_" + UUID.randomUUID() + ext;

            // Upload to Cloudinary
            Map<String, Object> result = cloudinary.uploader().upload(bytes,
                    ObjectUtils.asMap("resource_type", "raw", "public_id", name));

            return result.get("secure_url").toString();

        } catch (Exception e) {
            throw new RuntimeException("Cloudinary upload failed: " + e.getMessage(), e);
        }
    }

    private String parseResume(MultipartFile file) {
        try {
            // Prepare file resource
            ByteArrayResource res = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            // Build request body
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", res);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // Make API call
            HttpEntity<MultiValueMap<String, Object>> req = new HttpEntity<>(body, headers);
            ResponseEntity<String> resp = new RestTemplate()
                    .postForEntity(pythonApiUrl + "/parse-resume", req, String.class);

            // Handle response
            if (resp.getStatusCode() == HttpStatus.OK && resp.getBody() != null) {
                return resp.getBody();
            }

            throw new RuntimeException("Parser API error: " + resp.getStatusCode());

        } catch (Exception e) {
            throw new RuntimeException("Call parser API failed: " + e.getMessage(), e);
        }
    }

    private String buildJobDescriptionJson(Job job) {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jdJson = mapper.createObjectNode();

        // Build experience levels array
        ArrayNode expArr = mapper.createArrayNode();
        job.getExperienceLevels().forEach(e -> expArr.add(e.getExperienceName()));
        jdJson.set("experienceLevels", expArr);

        // Build skills array
        ArrayNode skillsArr = mapper.createArrayNode();
        job.getSkills().forEach(sk -> skillsArr.add(sk.getSkillName()));
        jdJson.set("skills", skillsArr);

        // Build certifications array with scores
        ArrayNode cerArr = mapper.createArrayNode();
        job.getCertifications().forEach(cert -> {
            ObjectNode certObj = mapper.createObjectNode();
            certObj.put("name", cert.getCertificationName());

            // Find matching certification score
            for (JobCertification jc : job.getJobCertifications()) {
                if (jc.getCertification().equals(cert)) {
                    certObj.put("score", jc.getCertificationScore());
                    break;
                }
            }
            cerArr.add(certObj);
        });
        jdJson.set("certifications", cerArr);

        // Add job description
        jdJson.put("description", job.getDetailedDescription());

        return jdJson.toString();
    }

    private String calculateMatchingScore(String cvJson, String jdJson) {
        try {
            // Build request payload
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode payload = mapper.createObjectNode();
            payload.set("cv_data", mapper.readTree(cvJson));
            payload.set("jd_data", mapper.readTree(jdJson));

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Make API call
            HttpEntity<String> req = new HttpEntity<>(mapper.writeValueAsString(payload), headers);
            ResponseEntity<String> resp = new RestTemplate()
                    .postForEntity(pythonApiUrl + "/match-score", req, String.class);

            // Handle response
            if (resp.getStatusCode() == HttpStatus.OK && resp.getBody() != null) {
                return resp.getBody();
            }

            throw new RuntimeException("Score API error: " + resp.getStatusCode());

        } catch (Exception e) {
            throw new RuntimeException("Call score API failed: " + e.getMessage(), e);
        }
    }

    @Transactional
    protected void saveApplication(Long userId, Job job, String resumeUrl, String coverLetter,
                                   String resumeContent, String scoreJson) {
        // Find user
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Calculate average score from JSON response
        double scoreMean = calculateScoreMean(scoreJson);

        // Build and save application
        JobApplication app = JobApplication.builder()
                .user(user)
                .job(job)
                .resumeUrl(resumeUrl)
                .resumeContent(resumeContent)
                .coverLetter(coverLetter)
                .score(scoreJson)
                .scoreMean(scoreMean)
                .status(ApplicationStatus.PENDING)
                .appliedAt(LocalDateTime.now())
                .build();

        applicationRepo.save(app);
    }

    private double calculateScoreMean(String scoreJson) {
        try {
            // Parse JSON response
            ObjectMapper mapper = new ObjectMapper();
            JsonNode details = mapper.readTree(scoreJson).path("details");

            // Extract individual scores
            int skillScore = parseScore(details.path("skill_score").asText("0/0"));
            int certScore = parseScore(details.path("cert_score").asText("0/0"));
            int expScore = parseScore(details.path("exp_score").asText("0/0"));

            // Calculate mean
            return (skillScore + certScore + expScore) / 3.0;

        } catch (Exception ignored) {
            return 0.0;
        }
    }

    private int parseScore(String txt) {
        try {
            return Integer.parseInt(txt.split("/")[0].trim());
        } catch (Exception e) {
            return 0;
        }
    }

    /* ---------- Helper ---------- */
}