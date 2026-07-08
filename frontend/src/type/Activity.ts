export interface ContentDetail {
    description: string;
    teacherTalk: string;
}

export interface Activity {
    domain: string;
    groupType: string;
    activityType: string; 
    activityName: string;
    objectives: string[];
    relatedCurriculum: string[];
    materials: string[];
    
    introduction: ContentDetail;
    development: ContentDetail;
    conclusion: ContentDetail;
    
    precautions: string[];
    extensionActivity: string;
}