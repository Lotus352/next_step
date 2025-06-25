package org.example.next_step.mappers;

import org.example.next_step.dtos.requests.JobCertificationRequest;
import org.example.next_step.dtos.responses.JobCertificationResponse;
import org.example.next_step.models.Certification;
import org.example.next_step.models.Job;
import org.example.next_step.models.JobCertification;

public class JobCertificationMapper {
    public static JobCertificationResponse toDTO(JobCertification jobCert) {
        if (jobCert == null || jobCert.getCertification() == null) return null;

        return JobCertificationResponse.builder()
                .certificationId(jobCert.getCertification().getCertificationId())
                .certificationName(jobCert.getCertification().getCertificationName())
                .certificationScore(jobCert.getCertificationScore())
                .build();
    }

    public static JobCertification toEntity(JobCertificationRequest request, Job job) {
        if (request == null) return null;

        JobCertification jc = new JobCertification();
        jc.setJob(job);

        Certification cert = new Certification();
        cert.setCertificationId(request.getCertificationId());
        jc.setCertification(cert);

        jc.setCertificationScore(request.getCertificationScore());
        return jc;
    }
}
