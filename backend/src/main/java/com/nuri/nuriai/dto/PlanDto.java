package com.nuri.nuriai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

public class PlanDto {
    // --- 1. 요청용 DTO ---
    @Getter
    @Builder
    @NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
    @AllArgsConstructor
    public static class Request {
        private String mainTheme;
        private int age;
        private String groupType;
        private List<String> selections;
        private String author;
    }

    // --- 2. Gemini 응답용 DTO  ---
    @Getter
    @NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
    public static class GeminiResponse {
        private String age;
        private String mainTheme;
        private String curriculum;
        private String author;

        @JsonProperty("plans")
        private List<ActivityDetail> plans;
    }

    // --- 3. 공통으로 사용하는 상세 DTO ---
    @Getter
    @NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
    public static class ActivityDetail {
        private String domain;
        private String groupType;
        private String activityType;
        private String activityName;
        private List<String> objectives;
        private List<String> relatedCurriculum;
        private List<String> materials;
        private ContentDetail content;
        private List<String> precautions;
        private String extensionActivity;
    }

    @Getter
    @NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
    public static class ContentDetail {
        private String introduction;
        private String development;
        private String conclusion;
    }
}