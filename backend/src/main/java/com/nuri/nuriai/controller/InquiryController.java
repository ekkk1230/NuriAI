package com.nuri.nuriai.controller;

import com.nuri.nuriai.dto.InquiryDto;
import com.nuri.nuriai.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquiry")
@RequiredArgsConstructor
public class InquiryController {
    public final InquiryService inquiryService;

    @GetMapping
    public List<InquiryDto.Response> getAllInquiries(@AuthenticationPrincipal String userId) {
        return inquiryService.getInquiriesByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<InquiryDto.Response> insertInquiry(
        @AuthenticationPrincipal String userId,
        @RequestBody InquiryDto.Request request
    ) {
        InquiryDto.Response response = inquiryService.insertInquiry(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{inquiryId}")
    public ResponseEntity<InquiryDto.Response> updateInquiry(
            @AuthenticationPrincipal String userId,
            @PathVariable("inquiryId") Long inquiryId,
            @RequestBody InquiryDto.Request request
    ) {
        InquiryDto.Response response = inquiryService.updateInquiry(userId, inquiryId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{inquiryId}")
    public ResponseEntity<Void> deleteInquiry(
        @AuthenticationPrincipal String userId,
        @PathVariable("inquiryId") Long inquiryId
    ) {
        inquiryService.deleteInquiry(userId, inquiryId);
        return ResponseEntity.noContent().build();
    }
}
