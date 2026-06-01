package com.nuri.nuriai.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "plan")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Plan extends BaseTimeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String age;
    private String mainTheme;
    private String curriculum;
    private String author;

    // cascade 설정으로 Plan 저장 시 Activity도 같이 저장되게 함
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Activity> activities = new ArrayList<>();

    @Builder
    public Plan(String age, String mainTheme, String curriculum, String author) {
        this.age = age;
        this.mainTheme = mainTheme;
        this.curriculum = curriculum;
        this.author = author;
    }

    public void addActivity(Activity activity) {
        this.activities.add(activity);
        activity.assignPlan(this);
    }
}