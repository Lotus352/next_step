package org.example.next_step.repositories;

import org.example.next_step.models.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findBySkillName(String skillName);
    Set<Skill> findBySkillNameIn(Set<String> skillNames);
}
