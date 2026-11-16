import { Form, Head, Link, usePage } from "@inertiajs/react";
import { ArrowLeft, GraduationCap } from "lucide-react";
import Blob from "@/components/blob";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import Reveal from "@/components/reveal";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
/* @chisel-registration */
import { register } from "@/routes";
/* @end-chisel-registration */
import { store } from "@/routes/login";
import { request } from "@/routes/password";

type Props = {
    status?: string;
    canResetPassword: boolean;
};

type SharedFaculty = { name: string; university: string };

const FALLBACK: SharedFaculty = {
    name: "Fakultas Teknik dan Sains",
    university: "Universitas Contoh Nusantara",
};

/** Gaya bersama untuk kolom isian, supaya konsisten dengan halaman publik. */
const fieldClass =
    "h-12 rounded-xl border-slate-200 bg-slate-50 text-base text-slate-800 placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:bg-white focus-visible:ring-indigo-100";

function Brand({
    info,
    light = false,
}: {
    info: SharedFaculty;
    light?: boolean;
}) {
    return (
        <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 text-white shadow-md">
                <GraduationCap className="h-5 w-5" />
            </span>
            <span className="leading-tight">
                <span
                    className={`block text-sm font-bold ${light ? "text-white" : "text-indigo-950"}`}
                >
                    {info.name}
                </span>
                <span
                    className={`block text-xs ${light ? "text-indigo-300" : "text-slate-500"}`}
                >
                    {info.university}
                </span>
            </span>
        </div>
    );
}

export default function Login({ status, canResetPassword }: Props) {
    const shared = usePage<{ faculty?: SharedFaculty }>().props.faculty;
    const info = shared ?? FALLBACK;

    return (
        <>
            <Head title="Masuk" />

            <div className="grid min-h-screen bg-slate-50 font-sans text-slate-800 antialiased lg:grid-cols-2">
                {/* ============ PANEL KIRI (desktop) ============ */}
                <aside className="relative hidden overflow-hidden bg-gradient-to-b from-indigo-950 to-indigo-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
                    <Blob className="-left-24 -top-24 h-96 w-96 bg-gradient-to-br from-indigo-500/40 to-sky-400/20" />
                    <Blob className="-bottom-24 -right-24 h-96 w-96 bg-gradient-to-br from-teal-400/30 to-emerald-300/10" />

                    <div className="relative">
                        <Brand info={info} light />
                    </div>

                    <div className="relative max-w-md">
                        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
                            Kelola informasi fakultas dengan mudah.
                        </h2>
                        <p className="mt-5 text-lg leading-relaxed text-indigo-200">
                            Masuk untuk memperbarui berita, program studi, dan
                            layanan yang tampil di situs fakultas.
                        </p>
                    </div>

                    <p className="relative text-sm text-indigo-300">
                        © {new Date().getFullYear()} {info.name}
                    </p>
                </aside>

                {/* ============ PANEL KANAN: FORM ============ */}
                <main className="relative flex items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-12">
                    {/* Latar lembut untuk mobile dan tablet */}
                    <div className="lg:hidden">
                        <Blob className="-left-24 -top-24 h-72 w-72 bg-gradient-to-br from-indigo-300/50 to-sky-200/40" />
                        <Blob className="-bottom-24 -right-24 h-72 w-72 bg-gradient-to-br from-teal-200/50 to-emerald-100/40" />
                    </div>

                    <div className="relative w-full max-w-md">
                        <Reveal className="lg:hidden">
                            <div className="mb-8">
                                <Brand info={info} />
                            </div>
                        </Reveal>

                        <Reveal delay={80}>
                            <h1 className="text-3xl font-extrabold tracking-tight text-indigo-950">
                                Masuk ke akun Anda
                            </h1>
                            <p className="mt-2 text-slate-600">
                                Masukkan email dan kata sandi untuk melanjutkan.
                            </p>
                        </Reveal>

                        {status && (
                            <div
                                role="status"
                                className="mt-6 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800"
                            >
                                {status}
                            </div>
                        )}

                        <Reveal delay={160} className="mt-8">
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-indigo-900/5 sm:p-8">
                                <Form
                                    {...store.form()}
                                    resetOnSuccess={["password"]}
                                    className="flex flex-col gap-6"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-5">
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
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="email"
                                                        placeholder="email@example.com"
                                                        className={fieldClass}
                                                    />
                                                    <InputError
                                                        message={errors.email}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <div className="flex items-center">
                                                        <Label
                                                            htmlFor="password"
                                                            className="text-slate-700"
                                                        >
                                                            Kata sandi
                                                        </Label>
                                                        {canResetPassword && (
                                                            <TextLink
                                                                href={request()}
                                                                className="ml-auto text-sm font-medium text-indigo-700 decoration-indigo-400 hover:text-indigo-900 dark:decoration-indigo-400"
                                                                tabIndex={5}
                                                            >
                                                                Lupa kata sandi?
                                                            </TextLink>
                                                        )}
                                                    </div>
                                                    <PasswordInput
                                                        id="password"
                                                        name="password"
                                                        required
                                                        tabIndex={2}
                                                        autoComplete="current-password"
                                                        placeholder="Kata sandi"
                                                        className={fieldClass}
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.password
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center space-x-3">
                                                    <Checkbox
                                                        id="remember"
                                                        name="remember"
                                                        tabIndex={3}
                                                    />
                                                    <Label
                                                        htmlFor="remember"
                                                        className="font-normal text-slate-600"
                                                    >
                                                        Ingat saya
                                                    </Label>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    className="mt-1 h-12 w-full rounded-xl bg-indigo-700 text-base font-semibold text-white shadow-lg shadow-indigo-700/25 transition hover:bg-indigo-800"
                                                    tabIndex={4}
                                                    disabled={processing}
                                                    data-test="login-button"
                                                >
                                                    {processing && <Spinner />}
                                                    Masuk
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Form>
                            </div>
                        </Reveal>

                        <Reveal delay={240}>
                            <Link
                                href="/"
                                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-700"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke beranda
                            </Link>
                        </Reveal>
                    </div>
                </main>
            </div>
        </>
    );
}
