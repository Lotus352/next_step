package org.example.next_step.repositories;

import org.example.next_step.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    
    @Query("SELECT r FROM Role r WHERE UPPER(TRIM(r.roleName)) = UPPER(TRIM(:roleName))")
    Optional<Role> findByRoleName(@Param("roleName") String roleName);
}
