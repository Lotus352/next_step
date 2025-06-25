package org.example.next_step.repositories;

import org.example.next_step.models.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findBySkillName(String skillName);

    Set<Skill> findBySkillNameIn(Set<String> skillNames);

    @Query("""
                SELECT s FROM Skill s
                WHERE LOWER(s.skillName) LIKE LOWER(CONCAT('%', :key, '%'))
            """)
    Page<Skill> searchByKey(@Param("key") String key, Pageable pageable);
}
