package com.nuri.nuriai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import java.util.List;

@Getter @Setter @ToString
public class GeminiPlanResponse {
    private String age;
    private String mainTheme;
    private String curriculum;
    private List<PlanDTO> plans;

    @Getter @Setter @ToString
    public static class PlanDTO {
        private String domain;           // 누리과정 영역
        private String groupType;        // 대집단 또는 소집단
        private String activityType;     // 이야기 나누기, 게임 등 상세 유형
        private String activityName;     // 활동명
        private List<String> objectives; // 활동 목표
        private List<String> relatedCurriculum;
        private List<String> materials;  // 준비물
        private ActivityContentDTO content;
        private List<String> precautions; // 유의점
        private String extensionActivity; // 추천 연계 활동
    }

    @Getter @Setter @ToString
    public static class ActivityContentDTO {
        private String introduction;
        private String development;
        private String conclusion;
    }
}