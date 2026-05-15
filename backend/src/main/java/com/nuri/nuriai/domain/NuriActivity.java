package com.nuri.nuriai.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Getter @Setter
public class NuriActivity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String domain;       // 누리과정 영역
    private String activityName; // 활동명

    @ElementCollection // 단순 문자열 리스트를 저장할 때 사용
    private List<String> objectives;

    @ElementCollection
    private List<String> materials;

    // 활동 방법 (도입, 전개, 마무리) - 별도 컬럼으로 관리
    @Column(columnDefinition = "TEXT")
    private String introduction;
    
    @Column(columnDefinition = "TEXT")
    private String development;
    
    @Column(columnDefinition = "TEXT")
    private String conclusion;

    @ElementCollection
    private List<String> precautions;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    private NuriPlan nuriPlan;
}