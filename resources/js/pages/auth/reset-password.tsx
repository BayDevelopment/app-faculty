import { Form, Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import AuthSplitLayout from "@/layouts/auth-split-layout";
import { update } from "@/routes/password";

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

/** Gaya kolom isian, sama dengan halaman login. */
const fieldClass =
    "h-12 rounded-xl border-slate-200 bg-slate-50 text-base text-slate-800 placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:bg-white focus-visible:ring-indigo-100";

/** Kolom email hanya-baca: dibuat lebih redup supaya terlihat tidak bisa diubah. */
const readOnlyClass =
    "h-12 cursor-not-allowed rounded-xl border-slate-200 bg-slate-100 text-base text-slate-500 focus-visible:ring-0";

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head title="Atur ulang kata sandi" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={["password", "password_confirmation"]}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-slate-700">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                className={readOnlyClass}
                                readOnly
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label
                                htmlFor="password"
                                className="text-slate-700"
                            >
                                Kata sandi baru
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                className={fieldClass}
                                autoFocus
                                tabIndex={1}
                                placeholder="Kata sandi baru"
                                passwordrules={passwordRules}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-slate-700"
                            >
                                Konfirmasi kata sandi
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                className={fieldClass}
                                tabIndex={2}
                                placeholder="Ulangi kata sandi baru"
                                passwordrules={passwordRules}
                            />
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-1 h-12 w-full rounded-xl bg-indigo-700 text-base font-semibold text-white shadow-lg shadow-indigo-700/25 transition hover:bg-indigo-800"
                            tabIndex={3}
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner />}
                            Simpan kata sandi baru
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = (page: ReactNode) => (
    <AuthSplitLayout
        title="Atur ulang kata sandi"
        description="Masukkan kata sandi baru Anda di bawah ini."
    >
        {page}
    </AuthSplitLayout>
);
