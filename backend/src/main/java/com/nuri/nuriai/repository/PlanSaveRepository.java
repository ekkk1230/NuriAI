package com.nuri.nuriai.repository;

import com.nuri.nuriai.domain.Plan;
import com.nuri.nuriai.domain.PlanLike;
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

    void deleteByUser(User user);

    List<PlanSave> findAllByPlan_Author(String nickname);
}
