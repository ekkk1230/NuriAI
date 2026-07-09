export const AGE_OPTIONS = [
    { value: 0, label: "만 0세" }, { value: 1, label: "만 1세" }, { value: 2, label: "만 2세" },
    { value: 3, label: "만 3세" }, { value: 4, label: "만 4세" }, { value: 5, label: "만 5세" },
];

export const ACTIVITY_OPTIONS = {
    INFANT: ["신체", "감각·탐색", "언어", "음률·미술", "역할·쌓기"],
    CHILD_LARGE: ["이야기 나누기", "동화·동시 감상/동극", "새 노래", "게임·신체표현", "과학·요리", "미술"],
    CHILD_SMALL: ["역할·쌓기", "언어", "수·조작", "음률", "미술", "과학"]
};

export const DOMAIN_TYPES = ["기본생활", "신체운동", "의사소통", "사회관계", "예술경험", "자연탐구"];

export const DOMAIN_STYLES = {
    "기본생활": "bg-[var(--color-cate0)] text-[var(--color-cate0-text)] border-[var(--color-cate0-text)]/20",
    "신체운동": "bg-[var(--color-cate1)] text-[var(--color-cate1-text)] border-[var(--color-cate1-text)]/20",
    "신체운동·건강": "bg-[var(--color-cate1)] text-[var(--color-cate1-text)] border-[var(--color-cate1-text)]/20",
    "의사소통": "bg-[var(--color-cate2)] text-[var(--color-cate2-text)] border-[var(--color-cate2-text)]/20",
    "사회관계": "bg-[var(--color-cate3)] text-[var(--color-cate3-text)] border-[var(--color-cate3-text)]/20",
    "예술경험": "bg-[var(--color-cate4)] text-[var(--color-cate4-text)] border-[var(--color-cate4-text)]/20",
    "자연탐구": "bg-[var(--color-cate5)] text-[var(--color-cate5-text)] border-[var(--color-cate5-text)]/20",
};

export const TYPE_STYLES = {
    // 유아 대집단
    "이야기 나누기": "bg-[var(--color-act0)] text-[var(--color-act0-text)] border-[var(--color-act0-text)]/20",
    "동화·동시 감상/동극": "bg-[var(--color-act1)] text-[var(--color-act1-text)] border-[var(--color-act1-text)]/20",
    "새 노래": "bg-[var(--color-act2)] text-[var(--color-act2-text)] border-[var(--color-act2-text)]/20",
    "게임·신체표현": "bg-[var(--color-act3)] text-[var(--color-act3-text)] border-[var(--color-act3-text)]/20",
    "과학·요리": "bg-[var(--color-act4)] text-[var(--color-act4-text)] border-[var(--color-act4-text)]/20",
    "미술": "bg-[var(--color-act5)] text-[var(--color-act5-text)] border-[var(--color-act5-text)]/20",
    // 영아/유아 공통 영역(소집단)
    "신체": "bg-[var(--color-act0)] text-[var(--color-act0-text)] border-[var(--color-act0-text)]/20",
    "감각·탐색": "bg-[var(--color-act1)] text-[var(--color-act1-text)] border-[var(--color-act1-text)]/20",
    "언어": "bg-[var(--color-act2)] text-[var(--color-act2-text)] border-[var(--color-act2-text)]/20",
    "음률·미술": "bg-[var(--color-act3)] text-[var(--color-act3-text)] border-[var(--color-act3-text)]/20",
    "역할·쌓기": "bg-[var(--color-act4)] text-[var(--color-act4-text)] border-[var(--color-act4-text)]/20",
    "수·조작": "bg-[var(--color-act5)] text-[var(--color-act5-text)] border-[var(--color-act5-text)]/20",
    "과학": "bg-[var(--color-act5)] text-[var(--color-act5-text)] border-[var(--color-act5-text)]/20",
};

export const DOMAIN_MAP: Record<string, string> = {
    "기본생활": "domainType1",
    "신체운동": "domainType2",
    "의사소통": "domainType3",
    "사회관계": "domainType4",
    "예술경험": "domainType5",
    "자연탐구": "domainType6",
}