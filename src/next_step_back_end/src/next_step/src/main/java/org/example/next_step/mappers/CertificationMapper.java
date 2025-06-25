package org.example.next_step.mappers;

import org.example.next_step.dtos.requests.CertificationRequest;
import org.example.next_step.dtos.responses.CertificationResponse;
import org.example.next_step.models.Certification;

/**
 * Simple static mapper – same pattern as SkillMapper.
 */
public class CertificationMapper {

    /* ---------- Entity → DTO ---------- */
    public static CertificationResponse toDTO(Certification certification) {
        if (certification == null) return null;

        return CertificationResponse.builder()
                .certificationId(certification.getCertificationId())
                .certificationName(certification.getCertificationName())
                .build();
    }

    /* ---------- DTO → Entity ---------- */
    public static Certification toEntity(CertificationRequest request) {
        if (request == null) return null;

        Certification certification = new Certification();
        certification.setCertificationName(request.getCertificationName());
        return certification;
    }

    /* ---------- Update existing entity ---------- */
    public static void updateEntity(Certification certification, CertificationRequest request) {
        if (request == null || certification == null) return;

        if (request.getCertificationName() != null) {
            certification.setCertificationName(request.getCertificationName());
        }
    }
}
