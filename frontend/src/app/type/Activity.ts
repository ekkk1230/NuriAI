interface ActivityContent {
    introduction: string; // 도입
    development: string;  // 전개
    conclusion: string;   // 마무리
}

interface Activity {
    domain: string;
    groupType: string;
    activityType: string; 
    activityName: string;
    objectives: string[];
    relatedCurriculum: string[];
    materials: string[];
    content: ActivityContent;
    precautions: string[];
    extensionActivity: string;
}