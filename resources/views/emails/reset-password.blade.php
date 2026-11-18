<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atur Ulang Password</title>
</head>
<body style="margin:0;padding:0;background-color:#eef2ff;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef2ff;padding:32px 16px;">
<tr><td align="center">

    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#4338ca 0%,#4f46e5 55%,#14b8a6 100%);background-color:#4f46e5;border-radius:24px 24px 0 0;padding:36px 32px;text-align:center;">
            <p style="margin:0;display:inline-block;background-color:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.35);border-radius:999px;padding:6px 14px;font-size:13px;font-weight:600;color:#ffffff;">
                {{ $appName }}
            </p>
            <h1 style="margin:20px 0 0;font-size:26px;line-height:1.3;font-weight:800;color:#ffffff;">
                Atur ulang password
            </h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="background-color:#ffffff;padding:36px 32px;">
            <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#1e1b4b;font-weight:600;">
                Halo{{ $name ? ', '.$name : '' }} 👋
            </p>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#475569;">
                Kami menerima permintaan untuk mengatur ulang password akun dashboard Anda.
                Klik tombol di bawah untuk membuat password baru.
            </p>

            <!-- Tombol -->
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
            <tr><td align="center" style="background-color:#4338ca;border-radius:12px;">
                <a href="{{ $url }}" target="_blank"
                   style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;">
                    Atur Ulang Password
                </a>
            </td></tr>
            </table>

            <!-- Info masa berlaku -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background-color:#fffbeb;border:1px solid #fde68a;border-radius:14px;padding:14px 16px;font-size:14px;line-height:1.6;color:#92400e;">
                ⏱ Link ini hanya berlaku selama <strong>{{ $expire }} menit</strong> dan hanya bisa dipakai satu kali.
            </td></tr>
            </table>

            <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:#64748b;">
                Jika Anda tidak merasa meminta ini, abaikan saja email ini. Password Anda tidak akan berubah.
            </p>

            <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0 20px;">

            <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#94a3b8;">
                Tombol tidak berfungsi? Salin dan tempel link berikut ke browser:
            </p>
            <p style="margin:0;font-size:12px;line-height:1.6;word-break:break-all;">
                <a href="{{ $url }}" style="color:#4f46e5;text-decoration:underline;">{{ $url }}</a>
            </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background-color:#1e1b4b;border-radius:0 0 24px 24px;padding:24px 32px;text-align:center;">
            <p style="margin:0;font-size:13px;line-height:1.6;color:#c7d2fe;">
                {{ $appName }}
            </p>
            <p style="margin:6px 0 0;font-size:12px;color:#818cf8;">
                © {{ date('Y') }} Hak cipta dilindungi. Email ini dikirim otomatis, mohon tidak dibalas.
            </p>
        </td></tr>

    </table>

</td></tr>
</table>

</body>
</html>