import { create } from "zustand";
import { API_ROUTES } from "@/constants/api";
import { GenerateAIPlanForm, Plan, PlanChartData } from "@/type/Plan";
import { apiFetch } from "@/util/api";
import { User } from "@/type/User";

interface PlanStore {
    planStorage: Plan[];
    isLoaded: boolean;
    currentCreatePlan: Plan[];
    isFetchPlanLoading: boolean;
    fetchAllPlans: (page: number, keyword: string, age: string, domain: string) => Promise<void>;
    fetchPlanById: (id: number) => Promise<void>;
    updatePlanViewCount: (id: number) => Promise<void>;
    fetchUserPlans: (user: User)  => Promise<void>;
    fetchPlansByAuthor: (plan: Plan) => Promise<void>;
    fetchUserCollectItem: (userId: number) => Promise<void>;
    userPlans: Plan[];
    userCollectPlans: Plan[];
    authorPlans: Plan[];
    addPlan: (plan: GenerateAIPlanForm) => Promise<void>;
    deletePlans: (planIds: number[]) => Promise<void>;
    updatePlan: (plan: Plan) => Promise<void>;
    likePlan: (user: User, plan: Plan) => Promise<void>;
    addStorage: (user: User, plan: Plan) => Promise<void>;
    getFilteredPlans: (searchTit: string, searchAge: string, isSavedFilter: boolean, authorFilter: string, user: any, customData?: Plan[]) => Plan[];
    recentStatistics: PlanChartData[];
    fetchRecentStatistics: () => Promise<void>;
    isLoadingUserPlans: boolean;
    totalPages: number;
    totalCounts: number;
    currentPage: number;
    currentKeyword: string;
    currentAge: string;
    currentDomain: string;
    searchPlans: (keyword: string, age: string, domain: string) => Promise<void>;
    fetchPage: (page: number) => Promise<void>;
    userCollectedData: Plan[];
};

export const usePlanStore = create<PlanStore>((set, get) => ({
    planStorage: [],
    isLoaded: false,
    isLoadingUserPlans: false,
    isFetchPlanLoading: false,
    totalPages: 0,
    totalCounts: 0,
    currentPage: 0,
    currentKeyword: "",
    currentAge: "전체",
    currentDomain: "전체",
    userCollectedData: [],
    searchPlans: async (keyword, age, domain) => {
        set({ currentKeyword: keyword, currentAge: age, currentDomain: domain });
        await get().fetchAllPlans(0, keyword, age, domain);
    },
    fetchPage: async (page) => {
        const { currentKeyword, currentAge, currentDomain } = get();
        await get().fetchAllPlans(page, currentKeyword, currentAge, currentDomain);
    },
    fetchAllPlans: async (page = 0, keyword = "", age = "전체", domain = "전체") => {
        set ({ isFetchPlanLoading: true });
        try {
            let url = `${API_ROUTES.PLAN.BASE}?page=${page}&size=12`;
            if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
            if (age && age !== "전체") url += `&age=${encodeURIComponent(age)}`;
            if (domain && domain !== "전체") url += `&domain=${encodeURIComponent(domain)}`;

            const response = await apiFetch(url);
            // console.log("응답 상태:", response.status);
            if (!response.ok) throw new Error("전체 목록 조회 실패");
            const data = await response.json();
            console.log("가져온 데이터:", data);
            // set({ planStorage: Array.isArray(data) ? data : [data], isLoaded: true });
            set({
                planStorage: data.content || [],
                totalPages: data.totalPages,
                totalCounts: data.totalElements,
                currentPage: data.number,
                isLoaded: true
            });
        } catch (err) {
            console.error(err);
            set({ isLoaded: true, planStorage: [] });
        } finally {
            set ({ isFetchPlanLoading: false });
        }
    },

    fetchPlanById: async (id: number) => {
        const url = API_ROUTES.PLAN.DETAIL(id);
        // console.log("생성된 URL:", url);
        try {
            const response = await apiFetch(url);
            if (!response.ok) throw new Error("단일 계획안 조회 실패");
            const planData = await response.json();
            
            set(state => ({
                planStorage: state.planStorage.find(p => p.id === id)
                    ? state.planStorage.map(p => p.id === id ? planData : p)
                    : [planData, ...state.planStorage]
            }));
        } catch (err) {
            console.error(`fetchPlanById 실패: ${err}`);
        }
    },
    updatePlanViewCount: async (id: number) => {
        try {
            const response = await apiFetch(`${API_ROUTES.PLAN.VIEW(id)}`, {
                method: "POST",
            });
            if (!response.ok) throw new Error("조회수 업데이트 실패");
            const updatedPlan = await response.json();
            // console.log("업데이트된 계획안 데이터:", updatedPlan);
            set(state => ({
                planStorage: state.planStorage.map(p => p.id === id ? updatedPlan : p)
            }));
        } catch (err) {
            console.error(`updatePlanViewCount 실패: ${err}`);
        }
    },
    fetchUserPlans: async (user) => {
        set({ isLoadingUserPlans: true });
        const url = API_ROUTES.PLAN.USER(user);
        try {
            const response = await apiFetch(url);
            if (!response.ok) throw new Error("사용자 계획안 조회 실패");
            const planData = await response.json();

            set({ 
                userPlans: Array.isArray(planData) ? planData : [planData],
                isLoaded: true 
            });
        } catch (err) {
            console.error(`fetchUserPlans 실패: ${err}`);
            set({ isLoaded: true }); 
        } finally {
            set({ isLoadingUserPlans: false });
        }
    },
    fetchPlansByAuthor: async (plan) => {
        const url = API_ROUTES.PLAN.AUTHOR(plan);
        try {
            const response = await apiFetch(url);
            // console.log("작성자 계획안 응답 상태:", response.status);
            if (!response.ok) throw new Error("사용자 계획안 조회 실패");
            const planData = await response.json();
            // console.log("작성자 계획안 데이터:", planData);

            set({ 
                authorPlans: Array.isArray(planData) ? planData : [planData],
                isLoaded: true 
            });
        } catch (err) {
            console.error(`fetchPlansByAuthor 실패: ${err}`);
            set({ isLoaded: true }); 
        }
    },
    fetchUserCollectItem: async (userId) => {
        try {
            const response = await apiFetch(API_ROUTES.PLAN.COLLECTED(userId));
            const data = await response.json();
            
            // console.log("서버가 보내준 데이터 구조:", data);

            const result = Array.isArray(data) ? data : (data.content || data.data || []);
            
            set({ userCollectPlans: result, userCollectedData: result }); 
        } catch (err) {
            console.error(`fetchUserCollectItem 실패: ${err}`);
        }
    },
    userPlans: [],
    userCollectPlans: [],
    authorPlans: [],
    currentCreatePlan: [],
    addPlan: async (plan) => {
        try {
            const response = await apiFetch(`${API_ROUTES.PLAN.BASE}/generate`, {
                method: "POST",
                body: JSON.stringify(plan),
            });

            if (!response.ok) throw new Error("계획안 업데이트 실패");

            const planData = await response.json();
            // console.log(planData)

            // console.log("planData:", planData);

            set(state => ({ 
                planStorage: [planData, ...state.planStorage],
                currentCreatePlan: [planData, ...state.planStorage],
            }));
        } catch (err) {
            console.error(`addPlan 실패: ${err}`);
        }
    },
    deletePlans: async (planIds: number[]) => { 
        // console.log(`deletePlans: ${planIds}`)
        try {
            const response = await apiFetch(API_ROUTES.PLAN.DELETEMYITEMS, { 
                method: "POST",
                body: JSON.stringify(planIds), 
            });
            if (!response.ok) throw new Error("삭제 요청 실패");

            set(state => ({
                planStorage: state.planStorage.filter(p => !planIds.includes(Number(p.id))),
                userPlans: state.userPlans.filter(p => !planIds.includes(Number(p.id))),
                userCollectPlans: state.userCollectPlans.filter(p => !planIds.includes(Number(p.id)))
            }))
            
        } catch (err) {
            console.error(`deletePlans 실패: ${err}`);
        }
    },
    updatePlan: async (plan) => {
        try {
            const response = await apiFetch(`${API_ROUTES.PLAN.UPDATE}`, {
                method: "POST",
                body: JSON.stringify(plan),
            })

            if (!response.ok) throw new Error("계획안 업데이트 실패");

            const planData = await response.json();

            set(state => ({ 
                planStorage: state.planStorage.map(p => p.id === planData.id ? { ...planData } : p),
                currentCreatePlan: state.currentCreatePlan.map(p => p.id === planData.id ? { ...planData } : p)
            }))
        } catch (err) {
            console.error(`updatePlan 실패: ${err}`);
        }
    },
    likePlan: async(user, plan) => {
        // console.log(`${API_ROUTES.PLAN.LIKE(plan.id)}`)
        try {
            const response = await apiFetch(`${API_ROUTES.PLAN.LIKE(plan.id)}`, {
                method: "POST",
                body: JSON.stringify({ userId: user.id }),
            });
            // console.log(response)

            if (!response.ok) throw new Error("계획안 좋아요 실패");
            const likePlan = await response.json();

            set(state => ({ planStorage: state.planStorage.map(p => p.id === plan.id ? likePlan : p) }))
        } catch (err) {
            console.error(`likePlan 실패: ${err}`);
        }
    },
    addStorage: async(user, plan) => {
        // console.log(user, plan)
        try {
            const response = await apiFetch(`${API_ROUTES.PLAN.SAVE(plan.id)}`, {
                method: "POST",
                body: JSON.stringify({ userId: user.id }),
            });
            if (!response.ok) throw new Error("계획안 저장 실패");
            const updatedPlanData = await response.json();
            set(state => ({ 
                planStorage: state.planStorage.map(p => p.id === plan.id ? { ...p, ...updatedPlanData} : p),
            }));
            
            get().fetchUserCollectItem(user?.id!);
        } catch (err) {
            console.error(`addStorage 실패: ${err}`);
        }
    },
    getFilteredPlans: (searchTit, searchAge, isSavedFilter, authorFilter, user, customData) => {
        const { planStorage } = get();

        return planStorage.filter(plan => {
            const matchesTitle = searchTit ? plan.mainTheme.includes(searchTit) : true;
            const matchesAge = (!searchAge || searchAge === "전체") ? true : plan.age === `만 ${searchAge}세`;

            // 공통 조건
            if (!matchesTitle || !matchesAge) return false;

            // 작성자 필터
            if (authorFilter) {
                return plan.author === decodeURIComponent(authorFilter);
            }

            if (!user) return true;

            // 보관함 필터
            if (isSavedFilter) {
                const safeIds = (plan.savedUserIds || []).map(Number);
                const isSaved = safeIds.includes(Number(user.id || 0));
                const isMyPlan = plan.author === user.userNickname;
                return isMyPlan || isSaved;
            };

            return plan.author === user?.userNickname;
        })
    },
    recentStatistics: [],
    fetchRecentStatistics: async () => {
        try {
            const response = await apiFetch(`${API_ROUTES.PLAN.STATISTICS}`);
            
            if (!response.ok) throw new Error("통계 데이터를 가져오는 데 실패했습니다.");
            
            // response.json()을 통해 실제 데이터(List<PlanDto.Chart>)를 받습니다.
            const statisticsData = await response.json();
            
            set({ recentStatistics: statisticsData });
        } catch (err) {
            console.error(`통계 조회 실패: ${err}`);
        }
    },
}));