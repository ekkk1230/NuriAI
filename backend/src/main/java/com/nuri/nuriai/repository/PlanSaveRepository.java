package com.nuri.nuriai.repository;

import com.nuri.nuriai.domain.Plan;
import com.nuri.nuriai.domain.PlanSave;
import com.nuri.nuriai.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlanSaveRepository extends JpaRepository<PlanSave, Long> {
    Optional<PlanSave> findByUserAndPlan(User user, Plan plan);
}
