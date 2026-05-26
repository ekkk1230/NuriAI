package com.nuri.nuriai.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
public class NuriPlan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String age;
    private String mainTheme;
    private String curriculum;

    // cascade 설정으로 Plan 저장 시 Activity도 같이 저장되게 함
    @OneToMany(mappedBy = "nuriPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NuriActivity> plans = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // 연관관계 편의 메서드
    public void addActivity(NuriActivity activity) {
        plans.add(activity);
        activity.setNuriPlan(this);
    }
}