import { Form, Head, setLayoutProps } from "@inertiajs/react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useMemo, useState } from "react";

import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { OTP_MAX_LENGTH } from "@/hooks/use-two-factor-auth";
import { store } from "@/routes/two-factor/login";

/** Gaya kolom isian, mengikuti halaman login/reset password. */
const fieldClass =
    "h-12 rounded-xl border-slate-200 bg-slate-50 text-base text-slate-800 placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:bg-white focus-visible:ring-indigo-100";

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);

    const [code, setCode] = useState<string>("");

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: "Recovery code",
                description:
                    "Konfirmasi akses ke akun Anda dengan memasukkan salah satu kode pemulihan darurat.",
                toggleText: "login menggunakan kode autentikasi",
            };
        }

        return {
            title: "Kode autentikasi",
            description:
                "Masukkan kode autentikasi yang diberikan oleh aplikasi autentikator Anda.",
            toggleText: "login menggunakan recovery code",
        };
    }, [showRecoveryInput]);

    setLayoutProps({
        title: authConfigContent.title,
        description: authConfigContent.description,
    });

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode("");
    };

    return (
        <>
            <Head title="Autentikasi dua faktor" />

            <div className="grid gap-5">
                <Form
                    {...store.form()}
                    className="grid gap-5"
                    resetOnError
                    resetOnSuccess={!showRecoveryInput}
                >
                    {({ errors, processing, clearErrors }) => (
                        <>
                            {showRecoveryInput ? (
                                <div className="grid gap-2">
                                    <label
                                        htmlFor="recovery_code"
                                        className="text-sm font-medium text-slate-700"
                                    >
                                        Recovery code
                                    </label>

                                    <Input
                                        id="recovery_code"
                                        name="recovery_code"
                                        type="text"
                                        placeholder="Masukkan recovery code"
                                        autoFocus
                                        required
                                        className={fieldClass}
                                    />

                                    <InputError
                                        message={errors.recovery_code}
                                    />
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    <label className="text-sm font-medium text-center text-slate-700">
                                        Kode autentikasi
                                    </label>

                                    <div className="flex items-center justify-center">
                                        <InputOTP
                                            name="code"
                                            maxLength={OTP_MAX_LENGTH}
                                            value={code}
                                            onChange={(value) => setCode(value)}
                                            disabled={processing}
                                            pattern={REGEXP_ONLY_DIGITS}
                                            autoFocus
                                        >
                                            <InputOTPGroup className="gap-2">
                                                {Array.from(
                                                    {
                                                        length: OTP_MAX_LENGTH,
                                                    },
                                                    (_, index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                            className="h-12 w-12 rounded-xl border-slate-200 bg-slate-50 text-lg font-semibold text-slate-800 shadow-none focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 sm:h-14 sm:w-14"
                                                        />
                                                    ),
                                                )}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>

                                    <InputError message={errors.code} />
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="mt-1 h-12 w-full rounded-xl bg-indigo-700 text-base font-semibold text-white shadow-lg shadow-indigo-700/25 transition hover:bg-indigo-800"
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                {showRecoveryInput
                                    ? "Verifikasi recovery code"
                                    : "Verifikasi kode autentikasi"}
                            </Button>

                            <div className="text-center text-sm text-slate-500">
                                <span>atau </span>

                                <button
                                    type="button"
                                    className="cursor-pointer font-medium text-indigo-700 underline decoration-indigo-200 underline-offset-4 transition hover:text-indigo-800 hover:decoration-indigo-700"
                                    onClick={() =>
                                        toggleRecoveryMode(clearErrors)
                                    }
                                >
                                    {authConfigContent.toggleText}
                                </button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
