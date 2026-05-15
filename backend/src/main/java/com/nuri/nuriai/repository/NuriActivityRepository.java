package com.nuri.nuriai.repository;

import com.nuri.nuriai.domain.NuriActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NuriActivityRepository extends JpaRepository<NuriActivity, Long> {
}
