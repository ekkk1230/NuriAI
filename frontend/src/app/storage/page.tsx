'use client';

import { Suspense } from "react";
import StorageContent from "@/components/Storage/StorageContent";

export default function Page() {
    return (
        <Suspense fallback={<div className="p-10">보관함을 불러오는 중...</div>}>
            <StorageContent />
        </Suspense>
    );
}