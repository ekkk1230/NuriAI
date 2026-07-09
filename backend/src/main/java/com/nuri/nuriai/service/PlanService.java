package com.nuri.nuriai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nuri.nuriai.domain.*;
import com.nuri.nuriai.dto.PlanDto;
import com.nuri.nuriai.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // log 사용을 위해 추가
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlanService {

    private final PlanRepository planRepository;
    private final UserRepository userRepository;
    private final PlanLikeRepository planLikeRepository;
    private final PlanSaveRepository planSaveRepository;
    private final RecentViewRepository recentViewRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=";

    public List<PlanDto.GeminiResponse> getAll() {
        return planRepository.findAll().stream()
                .map(PlanDto.GeminiResponse::new)
                .collect(Collectors.toList());
    }

    public PlanDto.GeminiResponse getOne(Long id) {
        Plan plan = planRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계획안 입니다. " + id));
        return new PlanDto.GeminiResponse(plan);
    }

    public String askGemini(String theme, int age, List<String> selections, String groupType) {
        // 1. 연령 및 과정 설정
        String curriculumName = (age <= 2) ? "제4차 표준보육과정(영아)" : "2019 개정 누리과정(유아)";
        String expertRole = (age <= 2) ? "영아 발달 및 표준보육과정 전문가" : "유아 교육 및 누리과정 전문가";

        // 2. 집단 유형에 따른 라벨링
        String selectionLabel = groupType.equals("대집단") ? "활동 유형" : "놀이 영역";
        String selectedItems = String.join(", ", selections);

        // 3. 프롬프트 생성
        String prompt = """
            당신은 대한민국 %s이며, %s에 정통한 20년 경력의 보육/교육 전문가입니다.
        
            ### [활동 생성 필수 지침]
            1. 반드시 주제 '%s'와 관련된 활동을 생성하십시오.
            2. 선택된 [%s] 목록의 각 항목을 독립된 'plans' 객체로 작성하십시오.
            3. 영역 분류 기준:
               - 신체운동·건강: 신체 활동, 대/소근육 놀이, 건강한 생활 습관, 기본생활(식사, 배변, 낮잠, 청결 등 일상 루틴 포함)
               - 의사소통: 듣기, 말하기, 읽기, 쓰기 경험
               - 사회관계: 나를 알고 존중하기, 더불어 사는 법, 친구와 소통하기
               - 예술경험: 창의적으로 표현하기(미술, 음악, 신체 표현)
               - 자연탐구: 탐구하는 태도, 수학적·과학적 탐구
            4. 연령 및 형태에 따른 영역/유형 선택(반드시 아래 목록 중 선택):
                 - 만 0-2세(영아):\s
                   * 형태: 소집단만 가능
                   * 영역: ["신체", "감각·탐색", "언어", "음률·미술", "역할·쌓기"]
                 - 만 3-5세(유아):
                   * 대집단 시 활동 유형: ["이야기 나누기", "동화·동시 감상/동극", "새 노래", "게임·신체표현", "과학·요리", "미술"]
                   * 소집단 시 교실 영역: ["역할·쌓기", "언어", "수·조작", "음률", "미술", "과학"]
            5. 대상 연령이 0-2세(영아)일 경우, '기본생활' 활동은 '신체운동·건강' 영역으로 분류하고 놀이 중심의 일상 경험으로 작성하십시오.
            6. 누리과정 관련 요소를 작성할 때, [영역] [내용범주] [내용] 형태로 한 줄의 문자열로 나열하십시오. 예: '신체운동·건강 > 건강하게 생활하기 > 건강한 일상생활 하기'
            7. [구조 및 발문 지침]: 각 단계(도입, 전개, 마무리)마다 활동 내용(description)과 실제 교사가 사용할 발문(teacherTalk)을 명확히 구분하여 작성하십시오.
            8. 교육과정, 목표, 준비물, 유의점은 교육적 효과를 위해 2~5개 항목의 배열로 작성하십시오.
        
            ### 입력 정보
            - 주제: '%s'
            - 대상 연령: 만 %d세
            - 집단 구성: %s
            - 선택 항목: [%s]
        
            ### [매우 중요: 출력 형식]
            - 마크다운 블록(```json) 없이, 오직 순수한 JSON 형식으로만 응답하십시오.
            
            {
              "age": "만 %d세",
              "mainTheme": "%s",
              "curriculum": "%s",
              "activeIntro": "활동 전반을 아우르는 따뜻하고 전문적인 교육적 소개글",
              "plans": [
                {
                  "domain": "교육과정 5개 영역 중 선택(신체운동, 의사소통, 사회관계, 예술경험, 자연탐구)",
                  "groupType": "%s",
                  "activityType": "위 지침에서 선택한 영역 또는 활동 유형명",
                  "activityName": "활동명",
                  "objectives": ["목표1", "목표2"],
                  "relatedCurriculum": ["누리과정 관련 요소1", "누리과정 관련 요소2"],
                  "introduction": { "description": "도입 활동 내용", "teacherTalk": "교사의 도입 발문 예시" },
                                    "development": { "description": "전개 활동 내용", "teacherTalk": "교사의 전개 발문 예시" },
                                    "conclusion": { "description": "마무리 활동 내용", "teacherTalk": "교사의 마무리 발문 예시" },
                  "precautions": ["유의점1", "유의점2"],
                  "materials": ["준비물1", "준비물2"],
                  "extensionActivity": "연관 활동"
                }
              ]
            }
        """.formatted(
                expertRole, curriculumName, theme, selectionLabel,
                theme, age, groupType, selectedItems,
                age, theme, curriculumName, groupType
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
    public PlanDto.GeminiResponse savePlan(PlanDto.GeminiResponse dto, String authorFromFrompt) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        String authorNickname = userRepository.findByUserId(currentUserId).map(User::getUserNickname).orElse(authorFromFrompt);

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
                ActivityContent intro = (detail.getIntroduction() != null)
                    ? new ActivityContent(detail.getIntroduction().getDescription(), detail.getIntroduction().getTeacherTalk()) : null;
                ActivityContent dev = (detail.getDevelopment() != null)
                    ? new ActivityContent(detail.getDevelopment().getDescription(), detail.getDevelopment().getTeacherTalk()) : null;
                ActivityContent conc = (detail.getConclusion() != null)
                    ? new ActivityContent(detail.getConclusion().getDescription(), detail.getConclusion().getTeacherTalk()) : null;

                Activity activity = Activity.builder()
                        .domain(detail.getDomain())
                        .groupType(detail.getGroupType())
                        .activityType(detail.getActivityType())
                        .activityName(detail.getActivityName())
                        .objectives(detail.getObjectives())
                        .relatedCurriculum(detail.getRelatedCurriculum())
                        .materials(detail.getMaterials())
                        .precautions(detail.getPrecautions())
                        .introduction(intro != null ? intro : new ActivityContent("준비중", "준비중"))
                        .development(dev != null ? dev : new ActivityContent("준비중", "준비중"))
                        .conclusion(conc != null ? conc : new ActivityContent("준비중", "준비중"))
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

    @Transactional
    public PlanDto.GeminiResponse toggleLike(Long planId, Long userId) {
        Plan plan = planRepository.findById(planId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계획안입니다." + planId));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다." + userId));

        planLikeRepository.findByUserAndPlan(user, plan).ifPresentOrElse(
                like -> {
                    plan.removeLike(like);
                    planLikeRepository.delete(like);
                },
                () -> {
                    PlanLike newLike = PlanLike.builder().user(user).plan(plan).build();
                    plan.addLike(newLike);
                    planLikeRepository.save(newLike);
                }
        );

        return new PlanDto.GeminiResponse(plan);
    }

    @Transactional
    public PlanDto.GeminiResponse toggleSave(Long planId, Long userId) {
        log.info("조회 시도하는 유저 ID 값: {}", userId);
        Plan plan = planRepository.findById(planId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계획안 입니다." + planId));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원정보 입니다." + userId));


        planSaveRepository.findByUserAndPlan(user, plan).ifPresentOrElse(
                save -> {
                    plan.removeSave(save);
                    planSaveRepository.delete(save);
                },
                () -> {
                    PlanSave newSave = PlanSave.builder().user(user).plan(plan).build();
                    plan.addSave(newSave);
                    planSaveRepository.save(newSave);
                }
        );

        planRepository.flush();

        Plan updatedPlan = planRepository.findByIdWithSaves(planId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원정보 입니다." + planId));

        return new PlanDto.GeminiResponse(updatedPlan);
    }

    @Transactional
    public PlanDto.GeminiResponse increaseViewCount(Long planId, User user) {
        Plan plan = planRepository.findById(planId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계획안 입니다." + planId));
        plan.updateViewCount();

        if (user != null) {
            saveView(user, plan);
        }

        return new PlanDto.GeminiResponse(plan);
    }

    @Transactional
    public void saveView(User user, Plan plan) {
        if (recentViewRepository.existsToday(user, plan)) {
            recentViewRepository.updateViewTime(user, plan);
        } else {
            RecentView recentView = RecentView.builder()
                    .user(user)
                    .plan(plan)
                    .build();
            recentViewRepository.save(recentView);
        }
    }

    public List<PlanDto.GeminiResponse> getCollectList(Long userId) {
        List<PlanSave> saves = planSaveRepository.findByUserId(userId);
        return saves.stream().map(save -> new PlanDto.GeminiResponse(save.getPlan()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCollectList(Long userId, List<PlanDto.PlanId> requestList) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원정보 입니다." + userId));
        for (PlanDto.PlanId request: requestList) {
            System.out.println("삭제 시도: userId=" + userId + ", planId=" + request.getId());
            Plan plan = planRepository.findById(request.getId()).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계획안 입니다: " + request.getId()));
            PlanSave item = planSaveRepository.findByUserAndPlan(user, plan)
                    .orElseThrow(() -> {
                        System.out.println("찾지 못한 데이터: user=" + user.getId() + ", plan=" + plan.getId());
                        return new IllegalArgumentException("저장된 항목을 찾을 수 없습니다.");
                    });
            planSaveRepository.delete(item);
            plan.removeSave(item);
        }
    }

    @Transactional
    public PlanDto.GeminiResponse updateplan(PlanDto.UpdatePlanRequest request) {
        Plan plan = planRepository.findById(request.getId()).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계획안 입니다." + request.getId()));
        List<Activity> newActivities = request.getPlans().stream().map(detail -> {
            return Activity.builder()
                    .domain(detail.getDomain())
                    .groupType(detail.getGroupType())
                    .activityType(detail.getActivityType())
                    .activityName(detail.getActivityName())
                    .objectives(detail.getObjectives())
                    .relatedCurriculum(detail.getRelatedCurriculum())
                    .materials(detail.getMaterials())
                    .precautions(detail.getPrecautions())
                    .introduction(detail.getIntroduction())
                    .development(detail.getDevelopment())
                    .conclusion(detail.getConclusion())
                    .extensionActivity(detail.getExtensionActivity())
                    .build();
        }).collect(Collectors.toList());
        plan.update(request.getAge(), request.getMainTheme(), request.getCurriculum(), request.getActiveIntro(), newActivities);
        return new PlanDto.GeminiResponse(plan);
    }

    @Transactional
    public void deletePlans(List<Long> planIds, Long userId) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("로그인된 유저 정보를 찾을 수 없습니다."));
        String myNickname = currentUser.getUserNickname();

        for (Long planId : planIds) {
            Plan plan = planRepository.findById(planId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계획안 입니다: " + planId));

            if (plan.getAuthor() != null && plan.getAuthor().equals(myNickname)) {
                // [CASE A] 내 글인 경우: 삭제
                planRepository.delete(plan);
            } else {
                // [CASE B] 남의 글인 경우: 보관함 삭제
                PlanSave save = planSaveRepository.findByUserAndPlan(currentUser, plan)
                        .orElseThrow(() -> new IllegalArgumentException("보관함에 없는 계획안입니다."));
                plan.removeSave(save);
                planSaveRepository.delete(save);
            }
        }
    }

    public List<PlanDto.Chart> getMyStatistics(User user) {
        List<PlanDto.Chart> result = new ArrayList<>();
        List<LocalDate> targetDates = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            targetDates.add(date);
            result.add(new PlanDto.Chart(date.toString(), 0L, 0L));
        }

        List<PlanSave> allSaves = planSaveRepository.findAllByPlan_Author(user.getUserNickname());
        List<PlanLike> allLikes = planLikeRepository.findAllByPlan_Author(user.getUserNickname());

        System.out.println("가져온 저장 로그 개수: " + allSaves.size());
        System.out.println("가져온 좋아요 로그 개수: " + allLikes.size());

        for (PlanSave save : allSaves) {
            if (save.getCreatedAt() == null) continue;
            LocalDate logDate = save.getCreatedAt().toLocalDate();

            for (int i = 0; i < targetDates.size(); i++) {
                if (targetDates.get(i).equals(logDate)) {
                    PlanDto.Chart chart = result.get(i);
                    chart.setSaves(chart.getSaves() + 1);
                }
            }
        }

        for (PlanLike like : allLikes) {
            if (like.getCreatedAt() == null) continue;
            LocalDate logDate = like.getCreatedAt().toLocalDate();

            for (int i = 0; i <targetDates.size(); i++) {
                if (targetDates.get(i).equals(logDate)) {
                    PlanDto.Chart chart = result.get(i);
                    chart.setLikes(chart.getLikes() + 1);
                }
            }
        }

        return result;
    }
}