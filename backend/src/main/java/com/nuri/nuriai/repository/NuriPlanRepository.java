package com.nuri.nuriai.repository;

import com.nuri.nuriai.domain.NuriPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NuriPlanRepository extends JpaRepository<NuriPlan, Long> {
}
