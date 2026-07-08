package com.nuri.nuriai.repository;

import com.nuri.nuriai.domain.Plan;
import com.nuri.nuriai.domain.PlanSave;
import com.nuri.nuriai.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlanSaveRepository extends JpaRepository<PlanSave, Long> {
    Optional<PlanSave> findByUserAndPlan(User user, Plan plan);
    List<PlanSave> findByUserId(Long userId);
    void deleteByUserIdAndPlanId(Long userId, Long planId);

    @Query(value = "SELECT TO_CHAR(created_at, 'MM.DD') as date, COUNT(*) as count " +
            "FROM plan_save " +
            "WHERE created_at >= :startDate " +
            "GROUP BY TO_CHAR(created_at, 'MM.DD') " +
            "ORDER BY date ASC", nativeQuery = true)
    List<Object[]> countSavesByDate(@Param("startDate") LocalDateTime startDate);
}
