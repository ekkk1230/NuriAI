package com.nuri.nuriai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nuri.nuriai.domain.Plan;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class PlanDto {
    // --- 1. 요청용 DTO ---
    @Getter @Builder
    @NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
    @AllArgsConstructor
    public static class Request {
        private String mainTheme;
        private int age;
        private String groupType;
        private List<String> selections;
        private String author;
    }

    // --- 2. 상세 정보용 DTO (통합) ---
    @Getter @Builder
    @AllArgsConstructor
    @NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
    public static class ContentDetail {
        private String description;
        private String teacherTalk;
    }

    @Getter @Builder
    @AllArgsConstructor
    @NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
    public static class ActivityDetail {
        private Long id;
        private String domain;
        private String groupType;
        private String activityType;
        private String activityName;
        private List<String> objectives;
        private List<String> relatedCurriculum;
        private List<String> materials;
        private List<String> precautions;
        private String extensionActivity;

        // 도입, 전개, 마무리 3단계로 분리
        private ContentDetail introduction;
        private ContentDetail development;
        private ContentDetail conclusion;
    }

    // --- 3. Gemini 응답 및 결과 반환용 DTO ---
    @Getter
    @NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
    public static class GeminiResponse {
        private Long id;
        private String age;
        private String mainTheme;
        private String curriculum;
        private String author;
        private Long viewCount;
        private Long likeCount;
        private Long saveCount;
        private LocalDateTime createdAt;
        private String activeIntro;
        private List<Long> likeUserIds;
        private List<Long> savedUserIds;

        @JsonProperty("plans")
        private List<ActivityDetail> plans;

        public GeminiResponse(Plan plan) {
            this.id = plan.getId();
            this.age = plan.getAge();
            this.mainTheme = plan.getMainTheme();
            this.curriculum = plan.getCurriculum();
            this.author = plan.getAuthor();
            this.viewCount = (plan.getViewCount() != null) ? plan.getViewCount() : 0L;
            this.likeCount = (plan.getLikeCount() != null) ? plan.getLikeCount() : 0L;
            this.saveCount = (plan.getSaveCount() != null) ? plan.getSaveCount() : 0L;
            this.createdAt = plan.getCreatedAt();
            this.activeIntro = plan.getActiveIntro();
            this.likeUserIds = (plan.getLikes() != null)
                    ? plan.getLikes().stream().map(like -> like.getUser().getId())
                    .collect(Collectors.toList())
                    : new ArrayList<>();
            this.savedUserIds = (plan.getSaves() != null)
                    ? plan.getSaves().stream().map(save -> save.getUser().getId())
                    .collect(Collectors.toList())
                    : new ArrayList<>();

            // PlanDto.java 내 GeminiResponse 생성자 수정 부분
            this.plans = plan.getActivities().stream()
                .map(activity -> ActivityDetail.builder()
                        .id(activity.getId())
                        .domain(activity.getDomain())
                        .groupType(activity.getGroupType())
                        .activityType(activity.getActivityType())
                        .activityName(activity.getActivityName())
                        .objectives(activity.getObjectives())
                        .relatedCurriculum(activity.getRelatedCurriculum())
                        .materials(activity.getMaterials())
                        .precautions(activity.getPrecautions())
                        .extensionActivity(activity.getExtensionActivity())
                        .introduction(activity.getIntroduction() != null ?
                                new ContentDetail(activity.getIntroduction().getDescription(), activity.getIntroduction().getTeacherTalk()) : null)
                        .development(activity.getDevelopment() != null ?
                                new ContentDetail(activity.getDevelopment().getDescription(), activity.getDevelopment().getTeacherTalk()) : null)
                        .conclusion(activity.getConclusion() != null ?
                                new ContentDetail(activity.getConclusion().getDescription(), activity.getConclusion().getTeacherTalk()) : null)
                        .build())
                .collect(Collectors.toList());
        }
    }
}