package com.nuri.nuriai.controller;

import com.nuri.nuriai.domain.Plan;
import com.nuri.nuriai.dto.PlanDto;
import com.nuri.nuriai.service.PlanService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class PlanController {
    private final PlanService planService;

    @Getter @Setter
    public static class PlanRequest {
        private String mainTheme;
        private int age;
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
        PlanDto.GeminiResponse savedDto = planService.savePlan(responseDto);

        return ResponseEntity.ok(savedDto);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Plan>> getAllPlans() {
        List<Plan> plans = planService.getAllPlans();
        return ResponseEntity.ok(plans);
    }
}
