package com.nuri.nuriai.controller;

import com.nuri.nuriai.domain.NuriPlan;
import com.nuri.nuriai.dto.GeminiPlanResponse;
import com.nuri.nuriai.service.NuriPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class NuriPlanController {
    private final NuriPlanService nuriPlanService;

    @GetMapping("/test-generate")
    public ResponseEntity<String> testGenerate(@RequestParam String theme, @RequestParam int age, @RequestParam List<String> domains) {
        String rawJson = nuriPlanService.askGemini(theme, age, domains);
        GeminiPlanResponse dto = nuriPlanService.parseGeminiResponse(rawJson);
        nuriPlanService.savePlan(dto);
        return ResponseEntity.ok("테스트 성공: DB를 확인해보세요!");
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generatePlan(@RequestParam String theme, @RequestParam int age, @RequestParam List<String> domains) {
        String rawJson = nuriPlanService.askGemini(theme, age, domains);
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
