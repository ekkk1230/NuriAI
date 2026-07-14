'use client';

import { VerifyPassword } from "@/components/Login/VerifyPassword";
import { ChangePassword } from "@/components/Login/ChangePassword";
import { Verify } from "crypto";
import { useState } from "react";

export const ChangePasswordModal = () => {
    const [step, setStep] = useState<'verify' | 'change'>('verify');

    return (
        <div>
            {step === 'verify'
            ? (
                <VerifyPassword />
            )
            : (
                <ChangePassword />
            )}
        </div>
    )
};