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
        String activeIntro = "유아들의 발달 단계에 맞춘 즐거운 활동입니다.";

        // 2. 집단 유형에 따른 라벨링
        String selectionLabel = groupType.equals("대집단") ? "활동 유형" : "누리과정 영역";
        String selectedItems = String.join(", ", selections);

        // 3. 프롬프트 생성
        String prompt = """
            당신은 대한민국 %s이며, %s에 정통한 20년 경력의 보육/교육 전문가입니다.
        
            ### [필수 지침]
            1. 반드시 주제 '%s'와 관련된 활동을 생성하십시오.
            2. 선택된 [%s] 목록의 각 항목을 독립된 'plans' 객체로 작성하십시오.
            3. 활동은 '도입-전개-마무리'로 구성하고, 교사의 구체적인 발문을 포함하십시오.
            4. 활동 목표는 유아의 지식, 기술, 태도가 드러나도록 2개 이상 작성하십시오.
            5. 'activeIntro'에는 해당 활동 전반을 아우르는 따뜻하고 전문적인 소개글을 작성하십시오.
        
            ### 입력 정보
            - 주제: '%s'
            - 대상 연령: 만 %d세
            - 집단 구성: %s
            - 선택 항목: [%s]
        
            ### [매우 중요: 출력 형식]
            - 반드시 순수한 JSON 형식으로만 응답하십시오.
            
            {
              "age": "만 %d세",
              "mainTheme": "%s",
              "curriculum": "%s",
              "activeIntro": "%s",
              "plans": [
                {
                  "domain": "영역명",
                  "groupType": "%s",
                  "activityType": "상세 유형",
                  "activityName": "활동명",
                  "objectives": ["목표1", "목표2"],
                  "relatedCurriculum": ["누리과정 내용"],
                  "materials": ["준비물1"],
                  "content": { "introduction": "...", "development": "...", "conclusion": "..." },
                  "precautions": ["유의점"],
                  "extensionActivity": "연관 활동"
                }
              ]
            }
        """.formatted(
            expertRole, curriculumName, theme, selectionLabel, // 여기서 추가!
            theme, age, groupType, selectedItems,
            age, theme, curriculumName, activeIntro, groupType
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
            .likeCount(dto.getLikeCount())
            .viewCount(dto.getViewCount())
            .activeIntro(dto.getActiveIntro())
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

    public List<PlanDto.GeminiResponse> getUserPlans(String author) {
        List<Plan> plans = planRepository.findByAuthor(author);
        return plans.stream()
                .map(PlanDto.GeminiResponse::new)
                .collect(Collectors.toList());
    }
}