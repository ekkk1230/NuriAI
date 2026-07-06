package com.nuri.nuriai.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Answer extends BaseTimeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "inquiry_id")
    private Inquiry inquiry;

    private String answerContent;

    @Builder
    public Answer(Inquiry inquiry, String answerContent) {
        this.inquiry = inquiry;
        this.answerContent = answerContent;
    }

    public void update(String answerContent) {
        this.answerContent = answerContent;
    }
}
