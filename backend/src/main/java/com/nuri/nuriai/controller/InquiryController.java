package com.nuri.nuriai.controller;

import com.nuri.nuriai.domain.User;
import com.nuri.nuriai.dto.InquiryDto;
import com.nuri.nuriai.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {
    public final InquiryService inquiryService;

    @GetMapping
    public List<InquiryDto.Response> getUserInquiries(@AuthenticationPrincipal String userId) {
        return inquiryService.getInquiriesByUserId(userId);
    }

    @GetMapping("/all")
    public List<InquiryDto.Response> getAllInquiries(@AuthenticationPrincipal User principal) {
        return inquiryService.getAllInquiries(principal.getRole());
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
