package com.nuri.nuriai.repository;

import com.nuri.nuriai.domain.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
    List<Plan> findByAuthor(String author);

    @Query("SELECT p FROM Plan p " +
            "LEFT JOIN FETCH p.saves s " +
            "LEFT JOIN FETCH s.user " +
            "WHERE p.id = :id")
    Optional<Plan> findByIdWithSaves(@Param("id") Long id);
}
