package org.example.next_step.repositories;

import org.example.next_step.models.CompanyReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface CompanyReviewRepository extends JpaRepository<CompanyReview, Long> {
    Page<CompanyReview> findByCompany_CompanyId(Long companyId, Pageable pageable);

    @Query("SELECT COUNT(cr) > 0 FROM CompanyReview cr WHERE cr.company.companyId = :companyId AND cr.user.id = :userId")
    boolean existsByCompanyIdAndUserId(@Param("companyId") Long companyId, @Param("userId") Long userId);
}

