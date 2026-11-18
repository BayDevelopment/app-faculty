<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

    <title inertia>
        Fakultas Ekonomi dan Bisnis - Universitas Al-Khairiyah
    </title>

    <meta name="description"
        content="Fakultas Ekonomi dan Bisnis Universitas Al-Khairiyah Cilegon. Menyelenggarakan pendidikan di bidang ekonomi, bisnis, manajemen, akuntansi, dan kewirausahaan untuk menghasilkan lulusan yang kompeten dan siap menghadapi dunia kerja.">

    <meta name="keywords"
        content="Fakultas Ekonomi dan Bisnis, FEB UNIVAL, Universitas Al-Khairiyah, FEB Cilegon, Fakultas Ekonomi Cilegon, Fakultas Bisnis Cilegon, Manajemen, Akuntansi, Ekonomi, Bisnis, Universitas Al-Khairiyah Cilegon">

    <meta name="author" content="Bayu Albar Ladici">

    <meta name="robots" content="index, follow, max-image-preview:large">

    {{-- Canonical --}}
    <link rel="canonical" href="https://www.feb.unival-cilegon.ac.id/">

    <meta name="theme-color" content="#312e81">
    <meta name="msapplication-TileColor" content="#312e81">

    <link rel="icon" type="image/png" href="/logo_unival.png">

    <link rel="apple-touch-icon" href="/logo_unival.png">


    <meta property="og:type" content="website">

    <meta property="og:locale" content="id_ID">

    <meta property="og:title" content="Fakultas Ekonomi dan Bisnis - Universitas Al-Khairiyah">

    <meta property="og:description"
        content="Website resmi Fakultas Ekonomi dan Bisnis Universitas Al-Khairiyah Cilegon. Informasi program studi, layanan, berita, alumni, dan kegiatan fakultas.">

    <meta property="og:url" content="https://www.feb.unival-cilegon.ac.id/">

    <meta property="og:site_name" content="Fakultas Ekonomi dan Bisnis Universitas Al-Khairiyah">

    <meta property="og:image" content="https://www.feb.unival-cilegon.ac.id/logo_unival.png">

    <meta property="og:image:alt" content="Logo Universitas Al-Khairiyah">
    <meta name="twitter:card" content="summary_large_image">

    <meta name="twitter:title" content="Fakultas Ekonomi dan Bisnis - Universitas Al-Khairiyah">

    <meta name="twitter:description"
        content="Website resmi Fakultas Ekonomi dan Bisnis Universitas Al-Khairiyah Cilegon.">

    <meta name="twitter:image" content="https://www.feb.unival-cilegon.ac.id/logo_unival.png">

    <meta name="mobile-web-app-capable" content="yes">

    <meta name="apple-mobile-web-app-capable" content="yes">

    <meta name="apple-mobile-web-app-status-bar-style" content="default">

    <meta name="apple-mobile-web-app-title" content="FEB UNIVAL">


    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';

            if (appearance === 'system') {
                const prefersDark =
                    window.matchMedia(
                        '(prefers-color-scheme: dark)'
                    ).matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <link rel="preconnect" href="https://fonts.googleapis.com">

    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
        rel="stylesheet">

    @viteReactRefresh

    @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])

    <x-inertia::head />
</head>

<body class="font-sans antialiased">
    <x-inertia::app />
</body>

</html>
