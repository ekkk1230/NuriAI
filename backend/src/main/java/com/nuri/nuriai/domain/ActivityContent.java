package com.nuri.nuriai.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ActivityContent {
    @Column(columnDefinition = "TEXT")
    private String description; // 활동 내용

    @Column(columnDefinition = "TEXT")
    private String teacherTalk; // 교사 발문 예시
}
