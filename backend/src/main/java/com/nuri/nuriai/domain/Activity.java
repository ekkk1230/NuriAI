package com.nuri.nuriai.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "activity")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Activity extends BaseTimeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String domain;
    private String groupType;    // 대집단, 소집단
    private String activityType;     // DTO의 activityType이 저장됨
    private String activityName;

    @ElementCollection
    @CollectionTable(name = "activity_objectives", joinColumns = @JoinColumn(name = "activity_id"))
    private List<String> objectives = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "activity_related_curriculum", joinColumns = @JoinColumn(name = "activity_id"))
    private List<String> relatedCurriculum = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "activity_materials", joinColumns = @JoinColumn(name = "activity_id"))
    private List<String> materials = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "activity_precautions", joinColumns = @JoinColumn(name = "activity_id"))
    private List<String> precautions = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String introduction;

    @Column(columnDefinition = "TEXT")
    private String development;

    @Column(columnDefinition = "TEXT")
    private String conclusion;

    private String extensionActivity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    private Plan plan;

    @Builder
    public Activity(String domain, String groupType, String activityType, String activityName,
                    List<String> objectives, List<String> relatedCurriculum, List<String> materials,
                    String introduction, String development, String conclusion,
                    List<String> precautions, String extensionActivity) {
        this.domain = domain;
        this.groupType = groupType;
        this.activityType = activityType;
        this.activityName = activityName;
        this.objectives = objectives != null ? objectives : new ArrayList<>();
        this.relatedCurriculum = relatedCurriculum != null ? relatedCurriculum : new ArrayList<>();
        this.materials = materials != null ? materials : new ArrayList<>();
        this.precautions = precautions != null ? precautions : new ArrayList<>();
        this.introduction = introduction;
        this.development = development;
        this.conclusion = conclusion;
        this.extensionActivity = extensionActivity;
    }

    // 연관관계 편의 메서드
    public void assignPlan(Plan plan) {
        this.plan = plan;
    }
}