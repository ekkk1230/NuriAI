export const AGE_OPTIONS = [
    { value: 0, label: "만 0세" },
    { value: 1, label: "만 1세" },
    { value: 2, label: "만 2세" },
    { value: 3, label: "만 3세" },
    { value: 4, label: "만 4세" },
    { value: 5, label: "만 5세" },
];
export const ACTIVITY_TYPES = ["이야기 나누기", "동화·동시 감상/동극", "새 노래", "게임·신체표현", "과학·요리", "미술"];
export const AREA_TYPES = ["기본생활", "신체운동", "의사소통", "사회관계", "예술경험", "자연탐구"];

export const DOMAIN_STYLES: Record<string, string> = {
    "기본생활": "bg-[var(--color-cate0)] text-[var(--color-cate0-text)] border-[var(--color-cate0-text)]/20",
    "기본생활·신체": "bg-[var(--color-cate0)] text-[var(--color-cate0-text)] border-[var(--color-cate0-text)]/20",
    "신체운동": "bg-[var(--color-cate1)] text-[var(--color-cate1-text)] border-[var(--color-cate1-text)]/20",
    "신체운동·건강": "bg-[var(--color-cate1)] text-[var(--color-cate1-text)] border-[var(--color-cate1-text)]/20",
    "의사소통": "bg-[var(--color-cate2)] text-[var(--color-cate2-text)] border-[var(--color-cate2-text)]/20",
    "사회관계": "bg-[var(--color-cate3)] text-[var(--color-cate3-text)] border-[var(--color-cate3-text)]/20",
    "예술경험": "bg-[var(--color-cate4)] text-[var(--color-cate4-text)] border-[var(--color-cate4-text)]/20",
    "자연탐구": "bg-[var(--color-cate5)] text-[var(--color-cate5-text)] border-[var(--color-cate5-text)]/20",
};

export const TYPE_STYLES: Record<string, string> = {
    "이야기 나누기": "bg-[var(--color-act0)] text-[var(--color-act0-text)] border-[var(--color-act0-text)]/20",
    "동화·동시 감상/동극": "bg-[var(--color-act1)] text-[var(--color-act1-text)] border-[var(--color-act1-text)]/20",
    "새 노래": "bg-[var(--color-act2)] text-[var(--color-act2-text)] border-[var(--color-act2-text)]/20",
    "게임·신체표현": "bg-[var(--color-act3)] text-[var(--color-act3-text)] border-[var(--color-act3-text)]/20",
    "과학·요리": "bg-[var(--color-act4)] text-[var(--color-act4-text)] border-[var(--color-act4-text)]/20",
    "미술": "bg-[var(--color-act5)] text-[var(--color-act5-text)] border-[var(--color-act5-text)]/20",
};

export const KEYWORD_STYLES: Record<string, string> = {
    보라: "bg-[var(--color-act0)] text-[var(--color-act0-text)] border-[var(--color-act0-text)]/20",
    주황: "bg-[var(--color-act1)] text-[var(--color-act1-text)] border-[var(--color-act1-text)]/20",
    민트: "bg-[var(--color-act2)] text-[var(--color-act2-text)] border-[var(--color-act2-text)]/20",
    파랑: "bg-[var(--color-act3)] text-[var(--color-act3-text)] border-[var(--color-act3-text)]/20",
    갈색: "bg-[var(--color-act4)] text-[var(--color-act4-text)] border-[var(--color-act4-text)]/20",
    핑크: "bg-[var(--color-act5)] text-[var(--color-act5-text)] border-[var(--color-act5-text)]/20", 
};