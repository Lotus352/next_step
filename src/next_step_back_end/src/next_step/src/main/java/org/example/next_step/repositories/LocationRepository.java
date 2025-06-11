package org.example.next_step.repositories;

import org.example.next_step.models.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    @Query("SELECT DISTINCT l.city FROM Location l WHERE (:country IS NULL OR l.countryName = :country)")
    List<String> findDistinctCitiesByCountry(@Param("country") String country);
}
