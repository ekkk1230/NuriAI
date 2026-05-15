package com.nuri.nuriai.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
public class NuriPlan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String age;   // 연령
    private String theme; // 주제

    @OneToMany(mappedBy = "nuriPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NuriActivity> activities = new ArrayList<>();

    public void addActivity(NuriActivity activity) {
        activities.add(activity);
        activity.setNuriPlan(this);
    }
}