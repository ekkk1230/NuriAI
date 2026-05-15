package com.nuri.nuriai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter @Setter @ToString
public class GeminiPlanResponse {
    @JsonProperty("age")
    private String age;

    @JsonProperty("mainTheme")
    private String mainTheme;

    @JsonProperty("curriculum")
    private String curriculum;

    @JsonProperty("plans")
    private List<PlanDTO> plans;

    @Getter @Setter @ToString
    public static class PlanDTO {
        @JsonProperty("domain")
        private String domain; // 누리과정 영역 (예: 사회관계)

        @JsonProperty("activityName")
        private String activityName; // 활동명

        @JsonProperty("objectives")
        private List<String> objectives; // 활동 목표 리스트

        @JsonProperty("materials")
        private List<String> materials; // 준비물 리스트

        @JsonProperty("content")
        private ActivityContentDTO content; // 도입-전개-마무리

        @JsonProperty("precautions")
        private List<String> precautions; // 유의점 리스트
    }

    @Getter @Setter @ToString
    public static class ActivityContentDTO {
        @JsonProperty("introduction")
        private String introduction; // 도입

        @JsonProperty("development")
        private String development; // 전개

        @JsonProperty("conclusion")
        private String conclusion; // 마무리
    }
}