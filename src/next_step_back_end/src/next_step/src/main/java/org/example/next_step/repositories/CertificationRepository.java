package org.example.next_step.repositories;

import org.example.next_step.models.Certification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CertificationRepository extends JpaRepository<Certification, Long> {
    Optional<Certification> findByCertificationNameIgnoreCase(String name);

    boolean existsByCertificationNameIgnoreCase(String name);
}
