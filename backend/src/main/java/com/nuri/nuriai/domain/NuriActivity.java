package com.nuri.nuriai.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
public class NuriActivity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String domain;
    private String groupType;    // 대집단, 소집단
    private String activity;     // DTO의 activityType이 저장됨
    private String activityName;

    @ElementCollection
    @CollectionTable(name = "NURI_ACTIVITY_OBJECTIVES", joinColumns = @JoinColumn(name = "activity_id"))
    private List<String> objectives;

    @ElementCollection
    @CollectionTable(name = "NURI_ACTIVITY_CURRICULUMS", joinColumns = @JoinColumn(name = "activity_id")) // 💡 plan_id에서 activity_id로 수정!
    private List<String> relatedCurriculum = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "NURI_ACTIVITY_MATERIALS", joinColumns = @JoinColumn(name = "activity_id"))
    private List<String> materials;

    @Column(columnDefinition = "TEXT") // 긴 발문을 위해 TEXT 타입 필수
    private String introduction;

    @Column(columnDefinition = "TEXT")
    private String development;

    @Column(columnDefinition = "TEXT")
    private String conclusion;

    @ElementCollection
    @CollectionTable(name = "NURI_ACTIVITY_PRECAUTIONS", joinColumns = @JoinColumn(name = "activity_id"))
    private List<String> precautions;

    private String extensionActivity; // 연계 활동

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    private NuriPlan nuriPlan;
}