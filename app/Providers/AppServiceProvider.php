<?php

namespace App\Providers;

use App\Models\Faculty;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureResetPasswordEmail();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn(): ?Password => app()->isProduction()
                ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
                : null,
        );
    }

    /**
     * Pakai template email kustom untuk reset password.
     */
    protected function configureResetPasswordEmail(): void
    {
        ResetPassword::toMailUsing(function ($notifiable, string $token) {
            $url = url(route('password.reset', [
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false));

            $broker = config('auth.defaults.passwords');
            $faculty = Faculty::first();

            return (new MailMessage)
                ->subject('Atur Ulang Password Akun Anda')
                ->view('emails.reset-password', [
                    'url' => $url,
                    'name' => $notifiable->name,
                    'expire' => config("auth.passwords.{$broker}.expire"),

                    'appName' => $faculty?->name ?? config('app.name'),

                    'facultyName' => $faculty?->name ?? config('app.name'),
                    'universityName' => $faculty?->university ?? 'Universitas Al-Khairiyah',
                    'logoPath' => public_path('logo_unival.png'),
                ]);
        });
    }
}
