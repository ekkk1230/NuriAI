package com.nuri.nuriai.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
public class NuriPlan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String age;
    private String theme;

    // cascade 설정으로 Plan 저장 시 Activity도 같이 저장되게 함
    @OneToMany(mappedBy = "nuriPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NuriActivity> activities = new ArrayList<>();

    // 연관관계 편의 메서드
    public void addActivity(NuriActivity activity) {
        activities.add(activity);
        activity.setNuriPlan(this);
    }
}