package org.example.next_step.repositories;

import org.example.next_step.models.Certification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CertificationRepository extends JpaRepository<Certification, Long> {
    Optional<Certification> findByCertificationNameIgnoreCase(String name);

    boolean existsByCertificationNameIgnoreCase(String name);

    @Query("""
        SELECT c FROM Certification c
        WHERE LOWER(c.certificationName) LIKE LOWER(CONCAT('%', :key, '%'))
    """)
    Page<Certification> searchByKey(@Param("key") String key, Pageable pageable);
}
