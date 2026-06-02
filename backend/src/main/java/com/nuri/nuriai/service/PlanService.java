package com.nuri.nuriai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nuri.nuriai.domain.Activity;
import com.nuri.nuriai.domain.Plan;
import com.nuri.nuriai.domain.User;
import com.nuri.nuriai.dto.PlanDto;
import com.nuri.nuriai.repository.PlanRepository;
import com.nuri.nuriai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // log 사용을 위해 추가
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PlanService {

    private final PlanRepository planRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=";

    public List<PlanDto.GeminiResponse> getAll() {
        return planRepository.findAll().stream()
                .map(plan -> {
                    return new PlanDto.GeminiResponse(plan);
                })
                .collect(Collectors.toList());
    }

    public PlanDto.GeminiResponse getOne(Long id) {
        return planRepository.findById(id).map(PlanDto.GeminiResponse::new).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계획안 입니다. " + id));
    }

    public String askGemini(String theme, int age, List<String> selections, String groupType) {
        // 1. 연령 및 과정 설정
        String curriculumName = (age <= 2) ? "제4차 표준보육과정(영아)" : "2019 개정 누리과정(유아)";
        String expertRole = (age <= 2) ? "영아 발달 및 표준보육과정 전문가" : "유아 교육 및 누리과정 전문가";

        // 2. 집단 유형에 따른 라벨링
        String selectionLabel = groupType.equals("대집단") ? "활동 유형" : "누리과정 영역";
        String selectedItems = String.join(", ", selections);

        // 3. 프롬프트 생성 (개별 생성 지침 강화)
        String prompt = String.format(
                "당신은 대한민국 **%s**로서, **%s**에 정통한 20년 경력의 전문가입니다.\n\n" +
                        "### [매우 중요] 요청 사항:\n" +
                        "- **반드시 주제: '%s'와 관련된 활동을 생성하세요.**\n" +
                        "- 절대로 임의로 주제를 변경하지 마세요.\n" +
                        "1. 주제: '%s'\n" +
                        "2. 대상 연령: 만 %d세\n" +
                        "3. 집단 구성: **%s**\n" +
                        "4. 선택한 %s: [%s]\n\n" +
                        "### 전문가 지침 (필수 준수):\n" +
                        "- **반드시 선택된 [%s] 목록에 있는 각각의 항목을 독립된 하나의 활동으로 작성하세요.**\n" +
                        "- 예를 들어, 선택한 항목이 2개라면 결과 JSON의 `plans` 배열 안에는 반드시 2개의 객체가 있어야 합니다.\n" +
                        "- 각 활동은 서로 섞이지 않게 해당 항목(영역 또는 유형)의 고유한 특성을 명확히 반영해야 합니다.\n" +
                        "- **대집단**일 경우: 선택한 '활동 유형'의 절차와 상호작용(발문)을 중심으로 작성하세요.\n" +
                        "- **소집단**일 경우: 선택한 '영역'의 발달 특성을 살린 유아 주도적인 놀이 지원 방안을 중심으로 작성하세요.\n" +
                        "- 모든 활동 내용은 '도입-전개-마무리'로 구성하고, 교사의 구체적인 발문을 포함하세요.\n" +
                        "- **활동 목표(`objectives`)는 유아의 지식, 기술, 태도가 명확히 드러나도록 2개 이상 구체적으로 작성하고, 이와 관련된 누리과정/보육과정의 세부 내용(`relatedCurriculum`)도 함께 명시하세요.**\n" +
                        "- 마지막에는 이 활동과 연결하여 진행할 수 있는 '추천 연관 활동'을 한 줄로 제시하세요.\n\n" +
                        "### 답변 형식 (JSON):\n" +
                        "{\n" +
                        "  \"age\": \"만 %d세\",\n" +
                        "  \"mainTheme\": \"%s\",\n" +
                        "  \"curriculum\": \"%s\",\n" +
                        "  \"plans\": [\n" +
                        "    {\n" +
                        "      \"domain\": \"해당 영역명(소집단인 경우 선택한 영역명 그대로 작성)\",\n" +
                        "      \"groupType\": \"%s\",\n" +
                        "      \"activityType\": \"이야기 나누기, 게임, 신체표현 등 상세 유형\",\n" +
                        "      \"activityName\": \"...\",\n" +
                        "      \"objectives\": [\"목표1\", \"목표2\"],\n" +
                        "      \"relatedCurriculum\": [\"관련 누리과정 내용\"],\n" +
                        "      \"materials\": [\"준비물1\", \"준비물2\"],\n" +
                        "      \"content\": { \"introduction\": \"...\", \"development\": \"...\", \"conclusion\": \"...\" },\n" +
                        "      \"precautions\": [\"유의점1\"],\n" +
                        "      \"extensionActivity\": \"이 활동 후 이어질 추천 연관 활동 내용\"\n" +
                        "    }\n" +
                        "  ]\n" +
                        "}",
                expertRole, curriculumName, theme, theme, age, groupType, selectionLabel, selectedItems,
                selectedItems, age, theme, curriculumName, groupType, groupType
        );

        // 4. API 호출 로직
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

    public PlanDto.GeminiResponse parseGeminiResponse(String rawResponse) {
        try {
            JsonNode rootNode = objectMapper.readTree(rawResponse);
            String jsonText = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

            // 마크다운 문법 제거 (```json ... ```)
            String cleanJson = jsonText.replaceAll("(?s)```json\\s*|\\s*```", "").trim();

            return objectMapper.readValue(cleanJson, PlanDto.GeminiResponse.class);
        } catch (Exception e) {
            log.error("JSON 파싱 오류: ", e);
            throw new RuntimeException("AI 데이터 변환 중 오류가 발생했습니다.");
        }
    }

    @Transactional
    public PlanDto.GeminiResponse savePlan(PlanDto.GeminiResponse dto) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        String authorNickname = userRepository.findByUserId(currentUserId).map(User::getUserNickname).orElse("알 수 없는 사용자" + currentUserId);

        Plan plan = Plan.builder()
            .age(dto.getAge())
            .mainTheme(dto.getMainTheme())
            .curriculum(dto.getCurriculum())
            .author(authorNickname)
            .build();

        if (dto.getPlans() != null) {
            for (PlanDto.ActivityDetail detail : dto.getPlans()) {
                String intro = (detail.getContent() != null) ? detail.getContent().getIntroduction() : null;
                String dev = (detail.getContent() != null) ? detail.getContent().getDevelopment() : null;
                String conc = (detail.getContent() != null) ? detail.getContent().getConclusion() : null;

                Activity activity = Activity.builder()
                        .domain(detail.getDomain())
                        .groupType(detail.getGroupType())
                        .activityType(detail.getActivityType())
                        .activityName(detail.getActivityName())
                        .objectives(detail.getObjectives())
                        .relatedCurriculum(detail.getRelatedCurriculum())
                        .materials(detail.getMaterials())
                        .precautions(detail.getPrecautions())
                        .introduction(intro)
                        .development(dev)
                        .conclusion(conc)
                        .extensionActivity(detail.getExtensionActivity())
                        .build();

                plan.addActivity(activity);
            }
        }

//        log.info("저장 직전 활동 리스트: {}", plan.getActivities());
//        plan.getActivities().forEach(a -> {
//            log.info("활동명: {}, 계획안 연결 여부: {}", a.getActivityName(), a.getPlan() != null);
//        });
        Plan savedPlan = planRepository.save(plan);
        return new PlanDto.GeminiResponse(savedPlan);
    }

    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    public List<PlanDto.GeminiResponse> getUserPlans(String userNickname) {
        List<Plan> plans = planRepository.findByAuthor(userNickname);
        return plans.stream()
                .map(PlanDto.GeminiResponse::new)
                .collect(Collectors.toList());
    }
}