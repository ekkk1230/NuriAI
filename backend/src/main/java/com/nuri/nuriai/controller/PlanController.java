package com.nuri.nuriai.controller;

import com.nuri.nuriai.domain.Plan;
import com.nuri.nuriai.domain.User;
import com.nuri.nuriai.dto.PlanDto;
import com.nuri.nuriai.dto.PlanLikeDto;
import com.nuri.nuriai.dto.PlanSaveDto;
import com.nuri.nuriai.service.PlanService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class PlanController {
    private final PlanService planService;

    @Getter @Setter
    public static class PlanRequest {
        private String mainTheme;
        private int age;
        private String author;
        private String groupType;      // 대집단 / 소집단
        private List<String> selections; // 활동 유형들 또는 영역들
    }

//    @GetMapping("/test-generate")
//    public ResponseEntity<String> testGenerate(
//            @RequestParam String theme,
//            @RequestParam int age,
//            @RequestParam List<String> selections,
//            @RequestParam String groupType) {
//
//        // 1. 요청 파라미터를 PlanDto.Request로 매핑
//        PlanDto.Request request = PlanDto.Request.builder()
//                .theme(theme)
//                .age(age)
//                .selections(selections)
//                .groupType(groupType)
//                .build();
//
//        // 2. 서비스 호출 시 request 사용
//        String rawJson = planService.askGemini(
//                request.getTheme(),
//                request.getAge(),
//                request.getSelections(),
//                request.getGroupType()
//        );
//
//        // 3. 응답 처리
//        PlanDto.GeminiResponse dto = planService.parseGeminiResponse(rawJson);
//        planService.savePlan(dto);
//
//        return ResponseEntity.ok("테스트 성공: [" + theme + "] 계획안이 DB에 저장되었습니다.");
//    }

    @GetMapping
    public ResponseEntity<List<PlanDto.GeminiResponse>> getAll() {
        List<PlanDto.GeminiResponse> list = planService.getAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanDto.GeminiResponse> getOne(@PathVariable("id") Long id) {
        PlanDto.GeminiResponse planItem = planService.getOne(id);
        return ResponseEntity.ok(planItem);
    }

    @PostMapping("/generate")
    public ResponseEntity<PlanDto.GeminiResponse> generatePlan(@RequestBody PlanRequest request) {
        // 1. AI 호출 (수정된 파라미터 전달)
        String rawResponse = planService.askGemini(
                request.getMainTheme(),
                request.getAge(),
                request.getSelections(),
                request.getGroupType()
        );

        // 2. 파싱 및 저장
        PlanDto.GeminiResponse responseDto = planService.parseGeminiResponse(rawResponse);
        PlanDto.GeminiResponse savedDto = planService.savePlan(responseDto, request.getAuthor());

        return ResponseEntity.ok(savedDto);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Plan>> getAllPlans() {
        List<Plan> plans = planService.getAllPlans();
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/user/{userNickname}")
    public ResponseEntity<List<PlanDto.GeminiResponse>> getUserPlans(@PathVariable("userNickname") String userNickname) {
        return ResponseEntity.ok(planService.getUserPlans(userNickname));
    }

    @GetMapping("/author/{author}")
    public ResponseEntity<List<PlanDto.GeminiResponse>> getPlansByAuthor(@PathVariable("author") String author) {
        return ResponseEntity.ok(planService.getUserPlans(author));
    }

    @PostMapping("/{planId}/like")
    public ResponseEntity<PlanDto.GeminiResponse> toggleLike(@PathVariable("planId") Long planId, @RequestBody PlanLikeDto.PlanLikeRequest request) {
//        System.out.println("컨트롤러에 도착한 planId: " + planId);
//        System.out.println("컨트롤러에 도착한 userId: " + request.getUserId());
        return ResponseEntity.ok(planService.toggleLike(planId, request.getUserId()));
    }

    @PostMapping("/{planId}/save")
    public ResponseEntity<PlanDto.GeminiResponse> toggleSave(@PathVariable("planId") Long planId, @RequestBody PlanSaveDto.PlanSaveRequest request) {
        return ResponseEntity.ok(planService.toggleSave(planId, request.getUserId()));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<PlanDto.GeminiResponse> increaseViewCount(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(planService.increaseViewCount(id, user));
    }

    @GetMapping("/user/{userId}/collected")
    public ResponseEntity<List<PlanDto.GeminiResponse>> getCollectList(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(planService.getCollectList(userId));
    }

    @PostMapping("/update")
    public ResponseEntity<PlanDto.GeminiResponse> updatePlan(@RequestBody PlanDto.UpdatePlanRequest request) {
        return ResponseEntity.ok(planService.updateplan(request));
    }

    @PostMapping("/delete-batch")
    public ResponseEntity<Void> deletePlans(
            @RequestBody List<Long> planIds, // 배열로 받기
            @AuthenticationPrincipal User user) {
        System.out.println("컨트롤러 진입 성공!");
        Long userId = user.getId();
        System.out.println("userId: " + userId + ", planIds: " + planIds);
        planService.deletePlans(planIds, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/statistics/recent")
    public ResponseEntity<List<PlanDto.Chart>> getStatistics() {
        return ResponseEntity.ok(planService.getRecentActivityChartData());
    }

    @GetMapping("/my-statistics")
    public ResponseEntity<List<PlanDto.Chart>> getMyStatistics(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(planService.getMyStatistics(user));
    }
}
