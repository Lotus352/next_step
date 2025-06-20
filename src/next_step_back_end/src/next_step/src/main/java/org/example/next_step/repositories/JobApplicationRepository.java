package org.example.next_step.repositories;

import org.example.next_step.models.JobApplication;
import org.example.next_step.models.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    Set<JobApplication> findByJobJobId(Long jobId);

    @Query("""
                SELECT ja FROM JobApplication ja
                WHERE ja.job.jobId = :jobId
                AND (:status IS NULL OR ja.status = :status)
                AND (:keyword IS NULL OR LOWER(ja.user.fullName) 
                LIKE LOWER(CONCAT('%', :keyword, '%')))
            """)
    Page<JobApplication> filterApplicationsByJobId(
        @Param("jobId") Long jobId,
        @Param("status") ApplicationStatus status, 
        @Param("keyword") String keyword,
        Pageable pageable);

    @Query("SELECT CASE WHEN COUNT(ja) > 0 THEN TRUE ELSE FALSE END " +
            "FROM JobApplication ja " +
            "WHERE ja.user.username = :username AND ja.job.jobId = :jobId")
    boolean hasApplied(@Param("username") String username, @Param("jobId") Long jobId);

    @Query("SELECT ja FROM JobApplication ja WHERE ja.user.username = :username AND ja.job.jobId = :jobId")
    Optional<JobApplication> findApplication(@Param("username") String username, @Param("jobId") Long jobId);

}
