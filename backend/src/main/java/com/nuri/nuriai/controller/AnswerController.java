package com.nuri.nuriai.controller;

import com.nuri.nuriai.domain.Answer;
import com.nuri.nuriai.dto.InquiryDto;
import com.nuri.nuriai.service.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inquiries/{inquiryId}/answer")
@RequiredArgsConstructor
public class AnswerController {
    private final AnswerService answerService;

    @PostMapping
    public ResponseEntity<InquiryDto.AnswerResponse> insertAnswer(
        @PathVariable Long inquiryId,
        @RequestBody InquiryDto.AnswerRequest request
    ) {
        InquiryDto.AnswerResponse answer = answerService.insertAnswer(inquiryId, request);
        return ResponseEntity.ok(answer);
    }

    @PutMapping
    public ResponseEntity<InquiryDto.AnswerResponse> updateAnswer(
        @PathVariable Long inquiryId,
        @RequestBody InquiryDto.AnswerRequest request
    ) {
        InquiryDto.AnswerResponse updateAnswer = answerService.updateAnswer(inquiryId, request);
        return ResponseEntity.ok(updateAnswer);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAnswer(
        @PathVariable Long inquiryId
    ) {
        answerService.deleteAnswer(inquiryId);
        return ResponseEntity.noContent().build();
    }
}
