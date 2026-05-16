package com.nuri.nuriai.controller;

import com.nuri.nuriai.domain.NuriPlan;
import com.nuri.nuriai.dto.GeminiPlanResponse;
import com.nuri.nuriai.service.NuriPlanService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class NuriPlanController {
    private final NuriPlanService nuriPlanService;

    @Getter @Setter
    public static class PlanRequest {
        private String theme;
        private int age;
        private String groupType;      // 대집단 / 소집단
        private List<String> selections; // 활동 유형들 또는 영역들
    }

    @GetMapping("/test-generate")
    public ResponseEntity<String> testGenerate(
            @RequestParam String theme,
            @RequestParam int age,
            @RequestParam List<String> selections,
            @RequestParam String groupType) {

        // 주소창의 ?theme=... 값을 가져와서 서비스 호출
        String rawJson = nuriPlanService.askGemini(theme, age, selections, groupType);
        GeminiPlanResponse dto = nuriPlanService.parseGeminiResponse(rawJson);
        nuriPlanService.savePlan(dto);

        return ResponseEntity.ok("테스트 성공: [" + theme + "] 계획안이 DB에 저장되었습니다.");
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generatePlan(@RequestBody PlanRequest request) {
        // 1. AI 호출 (수정된 파라미터 전달)
        String rawJson = nuriPlanService.askGemini(
                request.getTheme(),
                request.getAge(),
                request.getSelections(),
                request.getGroupType()
        );

        // 2. 파싱 및 저장
        GeminiPlanResponse dto = nuriPlanService.parseGeminiResponse(rawJson);
        nuriPlanService.savePlan(dto);

        return ResponseEntity.ok("성공적으로 계획안이 생성되고 저장되었습니다!");
    }

    @GetMapping("/all")
    public ResponseEntity<List<NuriPlan>> getAllPlans() {
        List<NuriPlan> plans = nuriPlanService.getAllPlans();
        return ResponseEntity.ok(plans);
    }
}
