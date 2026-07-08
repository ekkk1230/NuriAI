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

    private Long viewCount = 0L;
    private Long likeCount = 0L;
    private Long saveCount = 0L;
    private String activeIntro;

    @OneToMany(mappedBy = "plan", cascade = CascadeType.REMOVE)
    private List<RecentView> recentViews;

    // cascade 설정으로 Plan 저장 시 Activity도 같이 저장되게 함
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Activity> activities = new ArrayList<>();

    @Builder
    public Plan(String age, String mainTheme, String curriculum, String author, Long viewCount, Long likeCount, Long saveCount, String activeIntro) {
        this.age = age;
        this.mainTheme = mainTheme;
        this.curriculum = curriculum;
        this.author = author;
        this.viewCount = (viewCount != null) ? viewCount : 0L;
        this.likeCount = (likeCount != null) ? likeCount : 0L;
        this.saveCount = (saveCount != null) ? saveCount : 0L;
        this.activeIntro = activeIntro;
    }

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlanLike> likes = new ArrayList<>();

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlanSave> saves = new ArrayList<>();

    public void addLike(PlanLike planLike) {
        this.likes.add(planLike);
        this.likeCount++;
    };

    public void removeLike(PlanLike planLike) {
        this.likes.remove(planLike);
        this.likeCount--;
    };

    public void addSave(PlanSave planSave) {
        this.saves.add(planSave);
        this.saveCount++;
    };

    public void removeSave(PlanSave planSave) {
        this.saves.remove(planSave);
        this.saveCount--;
    }


    public void addActivity(Activity activity) {
        this.activities.add(activity);
        activity.assignPlan(this);
    }

    public void updateViewCount() {
        this.viewCount++;
    }

    public void update(String age, String mainTheme, String curriculum, String activeIntro, List<Activity> newActivities) {
        this.age = age;
        this.mainTheme = mainTheme;
        this.curriculum = curriculum;
        this.activeIntro = activeIntro;
        this.activities.clear();
        if (newActivities != null) {
            for (Activity activity : newActivities) {
                this.addActivity(activity);
            }
        }
    }
}