package com.nuri.nuriai.repository;

import com.nuri.nuriai.domain.Plan;
import com.nuri.nuriai.domain.RecentView;
import com.nuri.nuriai.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RecentViewRepository extends JpaRepository<RecentView, Long> {
    @Query("SELECT COUNT(r) > 0 FROM RecentView r WHERE r.user = :user AND r.plan = :plan AND r.viewedAt >= CURRENT_DATE")
    boolean existsToday(@Param("user") User user, @Param("plan") Plan plan);

    @Modifying
    @Query("UPDATE RecentView r SET r.viewedAt = CURRENT_TIMESTAMP WHERE r.user = :user AND r.plan = :plan")
    void updateViewTime(@Param("user") User user, @Param("plan") Plan plan);
}
