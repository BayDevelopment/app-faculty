import { Form, Head } from "@inertiajs/react";
import { Mail } from "lucide-react";

import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { logout } from "@/routes";
import { send } from "@/routes/verification";

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Verifikasi email" />

            <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
                {/* =========================
                    BACKGROUND BLOBS
                ========================== */}

                <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />

                <div className="pointer-events-none absolute -right-32 -top-20 h-[420px] w-[420px] rounded-full bg-violet-200/45 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-40 -left-20 h-[400px] w-[400px] rounded-full bg-blue-200/40 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-32 -right-20 h-[380px] w-[380px] rounded-full bg-indigo-100/70 blur-3xl" />

                {/* =========================
                    DECORATIVE LINES
                ========================== */}

                <div className="pointer-events-none absolute left-0 top-[22%] h-px w-40 bg-gradient-to-r from-transparent via-indigo-300 to-transparent sm:w-64" />

                <div className="pointer-events-none absolute right-0 top-[30%] h-px w-48 bg-gradient-to-l from-transparent via-violet-300 to-transparent sm:w-72" />

                <div className="pointer-events-none absolute bottom-[25%] left-0 h-px w-48 bg-gradient-to-r from-transparent via-blue-300 to-transparent sm:w-72" />

                <div className="pointer-events-none absolute bottom-[18%] right-0 h-px w-40 bg-gradient-to-l from-transparent via-indigo-300 to-transparent sm:w-64" />

                {/* =========================
                    DECORATIVE DOTS
                ========================== */}

                <span className="pointer-events-none absolute left-[8%] top-[20%] h-2 w-2 rounded-full bg-indigo-400/70" />

                <span className="pointer-events-none absolute right-[12%] top-[24%] h-2.5 w-2.5 rounded-full bg-violet-400/60" />

                <span className="pointer-events-none absolute bottom-[22%] left-[13%] h-2.5 w-2.5 rounded-full bg-blue-400/60" />

                <span className="pointer-events-none absolute bottom-[17%] right-[9%] h-2 w-2 rounded-full bg-indigo-400/60" />

                {/* =========================
                    MAIN CONTENT
                ========================== */}

                <div className="relative z-10 w-full max-w-md">
                    <div className="rounded-[28px] border border-white/80 bg-white/95 p-6 shadow-2xl shadow-indigo-200/30 backdrop-blur-xl sm:p-8">
                        {/* Email Icon */}
                        <div className="mb-6 flex justify-center">
                            <div className="relative flex h-[76px] w-[76px] items-center justify-center rounded-[22px] bg-indigo-50 ring-1 ring-indigo-100">
                                <Mail
                                    className="h-9 w-9 text-indigo-700"
                                    strokeWidth={1.8}
                                />

                                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-white" />
                            </div>
                        </div>

                        {/* Success Message */}
                        {status === "verification-link-sent" && (
                            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-medium leading-relaxed text-emerald-700">
                                Tautan verifikasi baru telah dikirim ke alamat
                                email Anda.
                            </div>
                        )}

                        {/* Form */}
                        <Form
                            {...send.form()}
                            className="grid gap-5 text-center"
                        >
                            {({ processing }) => (
                                <>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-12 w-full rounded-xl bg-indigo-700 text-base font-semibold text-white shadow-lg shadow-indigo-700/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-800 hover:shadow-xl hover:shadow-indigo-700/25"
                                    >
                                        {processing && <Spinner />}

                                        {!processing &&
                                            "Kirim ulang email verifikasi"}
                                    </Button>

                                    {/* Divider */}
                                    <div className="flex items-center gap-4">
                                        <div className="h-px flex-1 bg-slate-200" />

                                        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                            atau
                                        </span>

                                        <div className="h-px flex-1 bg-slate-200" />
                                    </div>

                                    {/* Logout */}
                                    <TextLink
                                        href={logout()}
                                        className="mx-auto text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-indigo-700"
                                    >
                                        Keluar dari akun
                                    </TextLink>
                                </>
                            )}
                        </Form>
                    </div>

                    {/* Bottom Decoration */}
                    <div className="mt-5 flex items-center justify-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-200" />
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-100" />
                    </div>
                </div>
            </div>
        </>
    );
}

VerifyEmail.layout = {
    title: "Verifikasi email",
    description:
        "Silakan verifikasi alamat email Anda dengan mengeklik tautan yang telah kami kirimkan ke email Anda.",
};
