package org.example.next_step.repositories;

import org.example.next_step.models.Industry;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface IndustryRepository extends JpaRepository<Industry, Long> {
    @Query("""
                SELECT i FROM Industry i 
                LEFT JOIN i.companies c 
                LEFT JOIN c.jobs j 
                GROUP BY i 
                ORDER BY COUNT(j) DESC
            """)
    Page<Industry> findTopIndustriesByJobCount(Pageable pageable);
}
