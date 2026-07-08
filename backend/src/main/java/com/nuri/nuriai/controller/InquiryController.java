package com.nuri.nuriai.controller;

import com.nuri.nuriai.domain.User;
import com.nuri.nuriai.dto.InquiryDto;
import com.nuri.nuriai.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
    public List<InquiryDto.Response> getUserInquiries(@AuthenticationPrincipal User user) {
        return inquiryService.getInquiriesByUserId(user.getUserId());
    }

    @GetMapping("/all")
    public List<InquiryDto.Response> getAllInquiries(@AuthenticationPrincipal User user) {
        return inquiryService.getAllInquiries(user.getRole());
    }

    @PostMapping
    public ResponseEntity<InquiryDto.Response> insertInquiry(
        @AuthenticationPrincipal User user,
        @RequestBody InquiryDto.Request request
    ) {
        String userId = user.getUserId();
        System.out.println("확인된 userId: " + userId);
        InquiryDto.Response response = inquiryService.insertInquiry(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{inquiryId}")
    public ResponseEntity<InquiryDto.Response> updateInquiry(
            @AuthenticationPrincipal User user,
            @PathVariable("inquiryId") Long inquiryId,
            @RequestBody InquiryDto.Request request
    ) {
        InquiryDto.Response response = inquiryService.updateInquiry(user.getUserId(), inquiryId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{inquiryId}")
    public ResponseEntity<Void> deleteInquiry(
        @AuthenticationPrincipal User user,
        @PathVariable("inquiryId") Long inquiryId
    ) {
        inquiryService.deleteInquiry(user.getUserId(), inquiryId);
        return ResponseEntity.noContent().build();
    }
}
