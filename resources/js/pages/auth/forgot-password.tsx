import { Form, Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import AuthSplitLayout from "@/layouts/auth-split-layout";
import { login } from "@/routes";
import { email } from "@/routes/password";

/** Gaya kolom isian, sama dengan halaman login. */
const fieldClass =
    "h-12 rounded-xl border-slate-200 bg-slate-50 text-base text-slate-800 placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:bg-white focus-visible:ring-indigo-100";

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Lupa kata sandi" />

            {status && (
                <div
                    role="status"
                    className="mb-6 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800"
                >
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()} className="flex flex-col gap-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-slate-700"
                                >
                                    Alamat email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    tabIndex={1}
                                    placeholder="email@example.com"
                                    className={fieldClass}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <Button
                                type="submit"
                                className="h-12 w-full rounded-xl bg-indigo-700 text-base font-semibold text-white shadow-lg shadow-indigo-700/25 transition hover:bg-indigo-800"
                                tabIndex={2}
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing && <Spinner />}
                                Kirim tautan atur ulang
                            </Button>
                        </>
                    )}
                </Form>

                <div className="text-center text-sm text-slate-500">
                    Ingat kata sandi Anda?{" "}
                    <TextLink
                        href={login()}
                        tabIndex={3}
                        className="font-semibold text-indigo-700 decoration-indigo-400 hover:text-indigo-900 dark:decoration-indigo-400"
                    >
                        Kembali masuk
                    </TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = (page: ReactNode) => (
    <AuthSplitLayout
        title="Lupa kata sandi"
        description="Masukkan email Anda, kami akan mengirim tautan untuk mengatur ulang kata sandi."
    >
        {page}
    </AuthSplitLayout>
);
