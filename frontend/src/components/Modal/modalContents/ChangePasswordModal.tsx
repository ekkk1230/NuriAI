'use client';

import { VerifyPassword } from "@/components/Login/VerifyPassword";
import { ChangePassword } from "@/components/Login/ChangePassword";
import { useState } from "react";

export const ChangePasswordModal = () => {
    const [step, setStep] = useState<'verify' | 'change'>('verify');

    return (
        <div className="w-[40rem]">
            {step === 'verify'
            ? (
                <VerifyPassword setStep={setStep} />
            )
            : (
                <ChangePassword />
            )}
        </div>
    )
};