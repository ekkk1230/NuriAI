package com.nuri.nuriai.dto;


import com.nuri.nuriai.domain.Inquiry;
import lombok.*;

import java.time.LocalDateTime;

public class InquiryDto {
    @Getter @Builder
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    @AllArgsConstructor
    public static class Request {
        private String title;
        private String inquiryContent;
    }

    @Getter @Builder
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String title;
        private String inquiryContent;
        private String status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private AnswerResponse answer;

        public Response(Inquiry inquiry) {
            this.id = inquiry.getId();
            this.title = inquiry.getTitle();
            this.inquiryContent = inquiry.getInquiryContent();
            this.status = (inquiry.getStatus() != null) ? inquiry.getStatus().toString() : "PENDING";
            this.createdAt = inquiry.getCreatedAt();
            this.updatedAt = inquiry.getUpdatedAt();

            if (inquiry.getAnswer() != null) {
                this.answer = new AnswerResponse(
                    inquiry.getAnswer().getAnswerContent(),
                    inquiry.getAnswer().getAnsweredAt()
                );
            }
        }
    }

    @Getter @Builder
    @AllArgsConstructor
    public static class AnswerResponse {
        private String answerContent;
        private LocalDateTime answeredAt;
    }
}
