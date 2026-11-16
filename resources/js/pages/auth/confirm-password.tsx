import { Form, Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import AuthSplitLayout from "@/layouts/auth-split-layout";
import { store } from "@/routes/password/confirm";

/** Gaya kolom isian, sama dengan halaman login. */
const fieldClass =
    "h-12 rounded-xl border-slate-200 bg-slate-50 text-base text-slate-800 placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:bg-white focus-visible:ring-indigo-100";

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Konfirmasi kata sandi" />

            <Form {...store.form()} resetOnSuccess={["password"]}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label
                                htmlFor="password"
                                className="text-slate-700"
                            >
                                Kata sandi
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="Kata sandi"
                                autoComplete="current-password"
                                autoFocus
                                tabIndex={1}
                                className={fieldClass}
                            />

                            <InputError message={errors.password} />
                        </div>

                        <Button
                            type="submit"
                            className="h-12 w-full rounded-xl bg-indigo-700 text-base font-semibold text-white shadow-lg shadow-indigo-700/25 transition hover:bg-indigo-800"
                            tabIndex={2}
                            disabled={processing}
                            data-test="confirm-password-button"
                        >
                            {processing && <Spinner />}
                            Konfirmasi kata sandi
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = (page: ReactNode) => (
    <AuthSplitLayout
        title="Konfirmasi kata sandi"
        description="Ini adalah area aman aplikasi. Mohon konfirmasi kata sandi Anda sebelum melanjutkan."
    >
        {page}
    </AuthSplitLayout>
);
