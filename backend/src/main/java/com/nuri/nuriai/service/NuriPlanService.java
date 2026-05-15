package com.nuri.nuriai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nuri.nuriai.domain.NuriActivity;
import com.nuri.nuriai.domain.NuriPlan;
import com.nuri.nuriai.dto.GeminiPlanResponse;
import com.nuri.nuriai.repository.NuriPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // log 사용을 위해 추가
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NuriPlanService {

    private final NuriPlanRepository nuriPlanRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=";

    public String askGemini(String theme, int age, List<String> domains) {
        String selectedDomains = String.join(", ", domains);

        // 연령에 따른 과정 명칭 설정
        String curriculumName = (age <= 2) ? "제4차 표준보육과정(영아)" : "2019 개정 누리과정(유아)";
        String expertRole = (age <= 2)
            ? "영아 발달 및 표준보육과정 전문가"
            : "유아 교육 및 누리과정 전문가";

        String prompt = String.format(
            "당신은 대한민국 **%s**로서, **%s**에 정통한 20년 경력의 전문가입니다.\n\n" +
                "요청 사항:\n" +
                "1. 주제: '%s'\n" +
                "2. 대상 연령: 만 %d세\n" +
                "3. 선택 영역: [%s]\n\n" +
                "전문가 지침:\n" +
                "- 제시된 **각각의 영역([%s])별로 독립된 놀이 계획안을 하나씩 작성**하세요.\n" +
                "- 예를 들어 영역이 2개라면, `plans` 배열 안에 2개의 독립된 활동 객체가 포함되어야 합니다.\n" +
                "- 각 활동은 해당 영역의 핵심 목표를 완벽히 반영해야 하며, 만 %d세의 발달 수준에 최적화되어야 합니다.\n" +
                "- 활동 내용은 '도입-전개-마무리'로 구성하고, 교사의 구체적인 발문을 포함하세요.\n\n" +
                "답변 형식 (JSON):\n" +
                "{\n" +
                "  \"age\": \"만 %d세\",\n" +
                "  \"mainTheme\": \"%s\",\n" +
                "  \"curriculum\": \"%s\",\n" +
                "  \"plans\": [\n" +
                "    {\n" +
                "      \"domain\": \"해당 영역명\",\n" +
                "      \"activityName\": \"...\",\n" +
                "      \"objectives\": [\"목표1\", \"목표2\"],\n" +
                "      \"materials\": [\"준비물1\", \"준비물2\"],\n" +
                "      \"content\": { \"introduction\": \"...\", \"development\": \"...\", \"conclusion\": \"...\" },\n" +
                "      \"precautions\": [\"유의점1\"]\n" +
                "    }\n" +
                "  ]\n" +
                "}",
            expertRole, curriculumName, theme, age, selectedDomains,
            selectedDomains, age, age, theme, curriculumName
        );

        Map<String, Object> requestBody = Map.of(
            "contents", new Object[]{
                Map.of("parts", new Object[]{
                    Map.of("text", prompt)
                })
            }
        );

        String url = GEMINI_URL + apiKey;

        try {
            return restTemplate.postForObject(url, requestBody, String.class);
        } catch (Exception e) {
            log.error("Gemini API 호출 중 오류 발생: ", e);
            throw new RuntimeException("AI 서비스 호출에 실패했습니다.");
        }
    }

    public GeminiPlanResponse parseGeminiResponse(String rawResponse) {
        try {
            JsonNode rootNode = objectMapper.readTree(rawResponse);

            String jsonText = rootNode.path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();

            log.info("추출된 순수 JSON 텍스트: {}", jsonText);

            String cleanJson = jsonText.replaceAll("(?s)```json\\s*|\\s*```", "").trim();

            return objectMapper.readValue(cleanJson, GeminiPlanResponse.class);

        } catch (Exception e) {
            log.error("JSON 추출 및 파싱 오류 발생: ", e);
            throw new RuntimeException("AI 데이터 변환 중 오류가 발생했습니다.");
        }
    }

    public void savePlan(GeminiPlanResponse dto) {
        log.info("저장 전 DTO 상태: {}", dto);

        NuriPlan plan = new NuriPlan();
        plan.setAge(dto.getAge());
        plan.setTheme(dto.getMainTheme());

        if (dto.getPlans() != null) {
            for (GeminiPlanResponse.PlanDTO planDto : dto.getPlans()) {
                NuriActivity activity = new NuriActivity();

                activity.setDomain(planDto.getDomain());
                activity.setActivityName(planDto.getActivityName());
                activity.setObjectives(planDto.getObjectives());
                activity.setMaterials(planDto.getMaterials());
                activity.setPrecautions(planDto.getPrecautions());

                if (planDto.getContent() != null) {
                    activity.setIntroduction(planDto.getContent().getIntroduction());
                    activity.setDevelopment(planDto.getContent().getDevelopment());
                    activity.setConclusion(planDto.getContent().getConclusion());
                }

                plan.addActivity(activity);
            }
        }

        nuriPlanRepository.save(plan);
    }

    public List<NuriPlan> getAllPlans() {
        return nuriPlanRepository.findAll();
    }
}