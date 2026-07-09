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
public interface PlanLikeRepository extends JpaRepository<PlanLike, Long> {
    Optional<PlanLike> findByUserAndPlan(User user, Plan plan);

    void deleteByUser(User user);

    List<PlanLike> findAllByPlan_Author(String nickname);
}
