<?php

namespace Database\Seeders;

use App\Models\Stat;
use Illuminate\Database\Seeder;

class StatSeeder extends Seeder
{
    public function run(): void
    {
        $img = fn (string $id) => "https://images.unsplash.com/{$id}?auto=format&fit=crop&w=1200&q=80";

        $rows = [
            ['label' => 'Mitra industri yang bekerja sama', 'value' => 120,  'suffix' => '+', 'image' => $img('photo-1552664730-d307ca884978')],
            ['label' => 'Mahasiswa aktif',                  'value' => 3450, 'suffix' => null, 'image' => $img('photo-1523050854058-8df90110c9f1')],
            ['label' => 'Laboratorium',                     'value' => 18,   'suffix' => null, 'image' => $img('photo-1581093458791-9f3c3900df4b')],
            ['label' => 'Dosen bergelar doktor',            'value' => 85,   'suffix' => null, 'image' => $img('photo-1524178232363-1fb2b075b655')],
        ];

        foreach ($rows as $i => $row) {
            Stat::updateOrCreate(['label' => $row['label']], $row + ['sort_order' => $i + 1]);
        }
    }
}
