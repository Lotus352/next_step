package org.example.next_step.repositories;

import org.example.next_step.models.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByIsFeaturedTrueAndIsDeletedFalse();

    @Query("""
                SELECT DISTINCT j FROM Job j
                JOIN j.company c
                JOIN j.location l
                JOIN j.salary s
                LEFT JOIN j.user u
                LEFT JOIN j.skills sk
                LEFT JOIN j.experienceLevels el
                WHERE (:country IS NULL OR :country = '' OR l.countryName = :country)
                AND (:city IS NULL OR :city = '' OR l.city = :city)
                AND (:employmentType IS NULL OR :employmentType = '' OR j.employmentType = :employmentType)
                AND (:minSalary IS NULL OR s.minSalary >= :minSalary)
                AND (:maxSalary IS NULL OR s.maxSalary <= :maxSalary)
                AND (:experienceLevels IS NULL OR EXISTS (SELECT 1 FROM j.experienceLevels el2 WHERE el2.experienceName IN :experienceLevels))
                AND (:skills IS NULL OR EXISTS (SELECT 1 FROM j.skills sk2 WHERE sk2.skillName IN :skills))
                AND (:createdAfter IS NULL OR j.createdAt >= :createdAfter)
                AND (:keyword IS NULL OR :keyword = '' OR 
                     LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                     LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                     LOWER(sk.skillName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                     LOWER(el.experienceName) LIKE LOWER(CONCAT('%', :keyword, '%')))
                AND (:currency IS NULL OR s.currency = :currency)
                AND (:payPeriod IS NULL OR s.payPeriod = :payPeriod)
                AND (:username IS NULL OR u.username = :username)
                AND j.isDeleted = FALSE
            """)
    Page<Job> findJobsByFilter(
            @Param("country") String country,
            @Param("city") String city,
            @Param("employmentType") String employmentType,
            @Param("minSalary") Double minSalary,
            @Param("maxSalary") Double maxSalary,
            @Param("experienceLevels") List<String> experienceLevels,
            @Param("skills") List<String> skills,
            @Param("createdAfter") LocalDateTime createdAfter,
            @Param("keyword") String keyword,
            @Param("currency") String currency,
            @Param("payPeriod") String payPeriod,
            @Param("username") String username,
            Pageable pageable
    );

}
