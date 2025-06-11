package org.example.next_step.repositories;

import org.example.next_step.models.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    Page<Company> findByIsFeaturedTrueAndIsDeletedFalse(Pageable pageable);
}
