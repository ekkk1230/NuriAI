package com.nuri.nuriai.dto;

import com.nuri.nuriai.domain.Plan;
import com.nuri.nuriai.domain.RecentView;
import com.nuri.nuriai.domain.User;
import lombok.*;

import java.time.LocalDateTime;

public class RecentViewDto {

    @Getter @Builder
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    @AllArgsConstructor
    public static class Response {
        private Long planId;
        private String mainTheme;
        private String age;
        private String author;
        private LocalDateTime viewedAt;

        public Response(RecentView recentView) {
            this.planId = recentView.getPlan().getId();
            this.mainTheme = recentView.getPlan().getMainTheme();
            this.age = recentView.getPlan().getAge();
            this.author = recentView.getPlan().getAuthor();
            this.viewedAt = recentView.getViewedAt();
        }
    }

}
