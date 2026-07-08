package com.nuri.nuriai.controller;

import com.nuri.nuriai.domain.User;
import com.nuri.nuriai.dto.RecentViewDto;
import com.nuri.nuriai.service.RecentViewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recent-views")
@RequiredArgsConstructor
public class RecentViewController {
    private final RecentViewService recentViewService;

    @GetMapping()
    public ResponseEntity<List<RecentViewDto.Response>> getRecentViews(
        @AuthenticationPrincipal User user
    ) {
        List<RecentViewDto.Response> recentViewList = recentViewService.getRecentViews(user);
        return ResponseEntity.ok(recentViewList);
    }

}
