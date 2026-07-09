package com.nuri.nuriai.repository;

import com.nuri.nuriai.domain.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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

    @Modifying
    @Query("UPDATE Plan p SET p.author = :newName WHERE p.author = :oldName")
    void updateAuthorName(@Param("oldName") String oldName, @Param("newName") String newName);

    List<Plan> findByAuthorAndCreatedAtAfter(String userNickname, LocalDateTime date);
}
