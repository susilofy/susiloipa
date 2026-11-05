import React from 'react';

export interface QuestionIllustrationProps {
  questionId?: number;
  illustrationKey?: string;
  className?: string;
}

export const QuestionIllustration: React.FC<QuestionIllustrationProps> = ({
  questionId,
  illustrationKey,
  className = '',
}) => {
  const key = illustrationKey || (questionId ? `q${questionId}` : '');

  switch (key) {
    // =========================================================================
    // SOAL 3: Diagram Pembagian Rangka Utama Tubuh Manusia
    // =========================================================================
    case 'q3':
    case 'bagan_bagian_rangka_manusia':
      return (
        <div className={`p-4 bg-sky-50/70 rounded-2xl border-2 border-sky-200 text-center ${className}`}>
          <div className="text-xs font-bold text-sky-900 mb-2 bg-sky-100 px-3 py-1 rounded-full inline-block border border-sky-300">
            🦴 Anatomi Rangka Tubuh Manusia: Tiga Bagian Utama
          </div>
          <svg viewBox="0 0 540 260" className="w-full max-w-xl mx-auto h-auto select-none">
            {/* Background container */}
            <rect x="10" y="10" width="520" height="240" rx="14" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />

            {/* Bagian 1: Rangka Kepala (Tengkorak) */}
            <g transform="translate(30, 25)">
              <rect x="0" y="0" width="145" height="100" rx="10" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
              <rect x="10" y="8" width="125" height="22" rx="5" fill="#0284C7" />
              <text x="72" y="23" fontSize="10" fontWeight="black" fill="#FFFFFF" textAnchor="middle">1. RANGKA KEPALA</text>
              <text x="72" y="54" fontSize="22" textAnchor="middle">💀</text>
              <text x="72" y="73" fontSize="10" fontWeight="bold" fill="#0369A1" textAnchor="middle">Tulang Tengkorak</text>
              <text x="72" y="87" fontSize="8.5" fill="#0C4A6E" textAnchor="middle">Melindungi Organ Otak</text>
            </g>

            {/* Bagian 2: Rangka Badan */}
            <g transform="translate(195, 25)">
              <rect x="0" y="0" width="150" height="100" rx="10" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
              <rect x="10" y="8" width="130" height="22" rx="5" fill="#D97706" />
              <text x="75" y="23" fontSize="10" fontWeight="black" fill="#FFFFFF" textAnchor="middle">2. RANGKA BADAN</text>
              <text x="75" y="54" fontSize="22" textAnchor="middle">🫁 🫀</text>
              <text x="75" y="73" fontSize="10" fontWeight="bold" fill="#B45309" textAnchor="middle">Rusuk, Dada &amp; Belakang</text>
              <text x="75" y="87" fontSize="8.5" fill="#78350F" textAnchor="middle">Lindungi Jantung &amp; Paru</text>
            </g>

            {/* Bagian 3: Rangka Anggota Gerak */}
            <g transform="translate(365, 25)">
              <rect x="0" y="0" width="145" height="100" rx="10" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" />
              <rect x="10" y="8" width="125" height="22" rx="5" fill="#16A34A" />
              <text x="72" y="23" fontSize="9.5" fontWeight="black" fill="#FFFFFF" textAnchor="middle">3. ANGGOTA GERAK</text>
              <text x="72" y="54" fontSize="22" textAnchor="middle">💪 🦵</text>
              <text x="72" y="73" fontSize="10" fontWeight="bold" fill="#15803D" textAnchor="middle">Tangan (Atas) &amp; Kaki</text>
              <text x="72" y="87" fontSize="8.5" fill="#14532D" textAnchor="middle">Berjalan, Memegang, Lari</text>
            </g>

            {/* Bagan Alur Penjelas Bawah */}
            <g transform="translate(30, 140)">
              <rect x="0" y="0" width="480" height="95" rx="10" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
              <text x="240" y="22" fontSize="11" fontWeight="black" fill="#1E293B" textAnchor="middle">
                Fungsi Utama Rangka bagi Tubuh Manusia:
              </text>
              
              <rect x="15" y="32" width="135" height="50" rx="6" fill="#EFF6FF" stroke="#BFDBFE" />
              <text x="82" y="49" fontSize="9.5" fontWeight="bold" fill="#1D4ED8" textAnchor="middle">Pemberi Bentuk</text>
              <text x="82" y="64" fontSize="8" fill="#1E40AF" textAnchor="middle">&amp; Penegak Tubuh</text>
              <text x="82" y="74" fontSize="7.5" fill="#64748B" textAnchor="middle">Tubuh tegak berdiri</text>

              <rect x="170" y="32" width="140" height="50" rx="6" fill="#FEF2F2" stroke="#FECACA" />
              <text x="240" y="49" fontSize="9.5" fontWeight="bold" fill="#DC2626" textAnchor="middle">Pelindung Organ Vital</text>
              <text x="240" y="64" fontSize="8" fill="#B91C1C" textAnchor="middle">Otak, Jantung, &amp; Paru</text>
              <text x="240" y="74" fontSize="7.5" fill="#64748B" textAnchor="middle">Terlindung dari benturan</text>

              <rect x="330" y="32" width="135" height="50" rx="6" fill="#F0FDF4" stroke="#BBF7D0" />
              <text x="397" y="49" fontSize="9.5" fontWeight="bold" fill="#16A34A" textAnchor="middle">Tempat Melekat Otot</text>
              <text x="397" y="64" fontSize="8" fill="#15803D" textAnchor="middle">&amp; Alat Gerak Pasif</text>
              <text x="397" y="74" fontSize="7.5" fill="#64748B" textAnchor="middle">Digerakkan oleh otot</text>
            </g>
          </svg>
          <p className="text-xs text-slate-600 mt-2 font-medium">
            Rangka manusia tersusun atas lebih dari 200 tulang yang saling terhubung dan memiliki fungsi vital bagi kehidupan.
          </p>
        </div>
      );

    // =========================================================================
    // SOAL 5: Bagan Hubungan Alat Gerak Aktif (Otot) vs Pasif (Tulang) & Tendon
    // =========================================================================
    case 'q5':
    case 'bagan_gerak_aktif_pasif':
      return (
        <div className={`p-4 bg-emerald-50/70 rounded-2xl border-2 border-emerald-200 text-center ${className}`}>
          <div className="text-xs font-bold text-emerald-900 mb-2 bg-emerald-100 px-3 py-1 rounded-full inline-block border border-emerald-300">
            🏃 Alat Gerak Aktif (Otot) vs Alat Gerak Pasif (Tulang / Rangka)
          </div>
          <svg viewBox="0 0 540 210" className="w-full max-w-xl mx-auto h-auto select-none">
            {/* Kotak Kiri: Tulang (Pasif) */}
            <g transform="translate(20, 20)">
              <rect x="0" y="0" width="180" height="160" rx="12" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
              <rect x="15" y="12" width="150" height="26" rx="6" fill="#0284C7" />
              <text x="90" y="29" fontSize="10.5" fontWeight="black" fill="#FFFFFF" textAnchor="middle">TULANG (RANGKA)</text>
              
              <text x="90" y="68" fontSize="28" textAnchor="middle">🦴</text>
              <text x="90" y="93" fontSize="12" fontWeight="black" fill="#0369A1" textAnchor="middle">Alat Gerak PASIF</text>
              
              <rect x="15" y="105" width="150" height="42" rx="6" fill="#F0F9FF" />
              <text x="90" y="121" fontSize="8.5" fontWeight="bold" fill="#0C4A6E" textAnchor="middle">
                Tidak dapat bergerak
              </text>
              <text x="90" y="136" fontSize="8.5" fill="#0369A1" textAnchor="middle">
                sendiri tanpa tarikan otot
              </text>
            </g>

            {/* Bagian Tengah: Penghubung Tendon & Sendi */}
            <g transform="translate(210, 45)">
              <rect x="0" y="0" width="120" height="110" rx="10" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
              <text x="60" y="24" fontSize="10" fontWeight="black" fill="#B45309" textAnchor="middle">PENGHUBUNG</text>
              <line x1="20" y1="32" x2="100" y2="32" stroke="#F59E0B" strokeWidth="1" />
              
              <text x="60" y="52" fontSize="9" fontWeight="bold" fill="#78350F" textAnchor="middle">1. TENDON</text>
              <text x="60" y="64" fontSize="7.5" fill="#92400E" textAnchor="middle">(Tali ikat Otot-Tulang)</text>
              
              <text x="60" y="84" fontSize="9" fontWeight="bold" fill="#78350F" textAnchor="middle">2. SENDI</text>
              <text x="60" y="96" fontSize="7.5" fill="#92400E" textAnchor="middle">(Pertemuan Antartulang)</text>
            </g>

            {/* Panah Interaksi */}
            <path d="M 200 95 L 210 95" stroke="#0284C7" strokeWidth="3" />
            <path d="M 330 95 L 340 95" stroke="#DC2626" strokeWidth="3" />

            {/* Kotak Kanan: Otot (Aktif) */}
            <g transform="translate(340, 20)">
              <rect x="0" y="0" width="180" height="160" rx="12" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2.5" />
              <rect x="15" y="12" width="150" height="26" rx="6" fill="#DC2626" />
              <text x="90" y="29" fontSize="10.5" fontWeight="black" fill="#FFFFFF" textAnchor="middle">OTOT (DAGING)</text>
              
              <text x="90" y="68" fontSize="28" textAnchor="middle">🥩 💪</text>
              <text x="90" y="93" fontSize="12" fontWeight="black" fill="#B91C1C" textAnchor="middle">Alat Gerak AKTIF</text>
              
              <rect x="15" y="105" width="150" height="42" rx="6" fill="#FEF2F2" />
              <text x="90" y="121" fontSize="8.5" fontWeight="bold" fill="#991B1B" textAnchor="middle">
                Memiliki daya kontraksi
              </text>
              <text x="90" y="136" fontSize="8.5" fill="#B91C1C" textAnchor="middle">
                (memendek) &amp; relaksasi
              </text>
            </g>
          </svg>
          <p className="text-xs text-slate-600 mt-2 font-medium">
            Tulang bergerak karena ditarik oleh otot yang berkontraksi melalui jaringan penghubung yang disebut tendon.
          </p>
        </div>
      );

    // =========================================================================
    // SOAL 8: Mekanisme Kerja Otot Antagonis: Bisep & Trisep pada Lengan
    // =========================================================================
    case 'q8':
    case 'bagan_otot_bisep_trisep':
      return (
        <div className={`p-4 bg-amber-50/70 rounded-2xl border-2 border-amber-200 text-center ${className}`}>
          <div className="text-xs font-bold text-amber-900 mb-2 bg-amber-100 px-3 py-1 rounded-full inline-block border border-amber-300">
            💪 Kerja Otot Antagonis: Bisep &amp; Trisep saat Menekuk dan Meluruskan Lengan
          </div>
          <svg viewBox="0 0 540 220" className="w-full max-w-xl mx-auto h-auto select-none">
            {/* Panel Kiri: Gerakan Menekuk Siku (Fleksi) */}
            <g transform="translate(15, 15)">
              <rect x="0" y="0" width="245" height="190" rx="12" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
              <rect x="12" y="10" width="221" height="26" rx="6" fill="#D97706" />
              <text x="122" y="27" fontSize="10.5" fontWeight="black" fill="#FFFFFF" textAnchor="middle">
                GERAKAN A: MENEKUK SIKU (FLEKSI)
              </text>

              {/* Sketsa Lengan Menekuk */}
              <g transform="translate(30, 45)">
                {/* Lengan Atas */}
                <rect x="40" y="15" width="22" height="60" rx="6" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
                
                {/* Otot Bisep (Depan) - Menebal/Kontraksi */}
                <ellipse cx="38" cy="40" rx="14" ry="24" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
                <text x="38" y="44" fontSize="8" fontWeight="black" fill="#FFFFFF" textAnchor="middle">BISEP</text>
                
                {/* Otot Trisep (Belakang) - Menipis/Relaksasi */}
                <ellipse cx="64" cy="45" rx="6" ry="22" fill="#93C5FD" stroke="#2563EB" strokeWidth="1.5" />
                
                {/* Sendi Siku & Lengan Bawah Menekuk Ke Atas */}
                <circle cx="51" cy="80" r="7" fill="#64748B" />
                <rect x="25" y="65" width="45" height="16" rx="4" transform="rotate(-40 51 80)" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
              </g>

              {/* Keterangan Status */}
              <rect x="12" y="125" width="221" height="52" rx="6" fill="#FEF3C7" stroke="#FDE68A" />
              <text x="22" y="142" fontSize="9" fontWeight="black" fill="#B45309">
                • Otot BISEP : KONTRAKSI (Memendek &amp; Membesar)
              </text>
              <text x="22" y="158" fontSize="9" fontWeight="bold" fill="#0369A1">
                • Otot TRISEP : RELAKSASI (Memanjang &amp; Mengendur)
              </text>
            </g>

            {/* Panel Kanan: Gerakan Meluruskan Siku (Ekstensi) */}
            <g transform="translate(280, 15)">
              <rect x="0" y="0" width="245" height="190" rx="12" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
              <rect x="12" y="10" width="221" height="26" rx="6" fill="#0284C7" />
              <text x="122" y="27" fontSize="10.5" fontWeight="black" fill="#FFFFFF" textAnchor="middle">
                GERAKAN B: MELURUSKAN (EKSTENSI)
              </text>

              {/* Sketsa Lengan Lurus */}
              <g transform="translate(30, 45)">
                {/* Lengan Atas */}
                <rect x="40" y="10" width="22" height="55" rx="6" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
                
                {/* Otot Bisep (Depan) - Menipis/Relaksasi */}
                <ellipse cx="38" cy="35" rx="6" ry="20" fill="#FCA5A5" stroke="#DC2626" strokeWidth="1.5" />
                
                {/* Otot Trisep (Belakang) - Menebal/Kontraksi */}
                <ellipse cx="64" cy="40" rx="14" ry="24" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
                <text x="64" y="44" fontSize="8" fontWeight="black" fill="#FFFFFF" textAnchor="middle">TRISEP</text>
                
                {/* Sendi Siku & Lengan Bawah Lurus ke Bawah */}
                <circle cx="51" cy="70" r="7" fill="#64748B" />
                <rect x="42" y="75" width="18" height="45" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
              </g>

              {/* Keterangan Status */}
              <rect x="12" y="125" width="221" height="52" rx="6" fill="#E0F2FE" stroke="#BAE6FD" />
              <text x="22" y="142" fontSize="9" fontWeight="bold" fill="#DC2626">
                • Otot BISEP : RELAKSASI (Memanjang &amp; Mengendur)
              </text>
              <text x="22" y="158" fontSize="9" fontWeight="black" fill="#0369A1">
                • Otot TRISEP : KONTRAKSI (Memendek &amp; Menegang)
              </text>
            </g>
          </svg>
          <p className="text-xs text-slate-600 mt-2 font-medium">
            Kerja dua otot yang saling berlawanan arah disebut kerja otot antagonis.
          </p>
        </div>
      );

    // =========================================================================
    // SOAL 11: Diagram Jenis-Jenis Sendi Gerak (Diartrosis)
    // =========================================================================
    case 'q11':
    case 'bagan_jenis_jenis_sendi':
      return (
        <div className={`p-4 bg-indigo-50/70 rounded-2xl border-2 border-indigo-200 text-center ${className}`}>
          <div className="text-xs font-bold text-indigo-900 mb-2 bg-indigo-100 px-3 py-1 rounded-full inline-block border border-indigo-300">
            🔄 Ragam Sendi Gerak (Diartrosis) &amp; Arah Gerakannya
          </div>
          <svg viewBox="0 0 540 230" className="w-full max-w-xl mx-auto h-auto select-none">
            {/* Sendi 1: Sendi Peluru */}
            <g transform="translate(15, 15)">
              <rect x="0" y="0" width="160" height="95" rx="10" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.5" />
              <rect x="8" y="6" width="144" height="20" rx="4" fill="#4F46E5" />
              <text x="80" y="20" fontSize="9.5" fontWeight="black" fill="#FFFFFF" textAnchor="middle">1. SENDI PELURU</text>
              
              <text x="80" y="48" fontSize="18" textAnchor="middle">🌐 🔄</text>
              <text x="80" y="66" fontSize="9" fontWeight="bold" fill="#3730A3" textAnchor="middle">Gerak ke Segala Arah</text>
              <text x="80" y="80" fontSize="8" fill="#4338CA" textAnchor="middle">Contoh: Bahu &amp; Gelang Panggul</text>
            </g>

            {/* Sendi 2: Sendi Engsel */}
            <g transform="translate(190, 15)">
              <rect x="0" y="0" width="160" height="95" rx="10" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" />
              <rect x="8" y="6" width="144" height="20" rx="4" fill="#059669" />
              <text x="80" y="20" fontSize="9.5" fontWeight="black" fill="#FFFFFF" textAnchor="middle">2. SENDI ENGSEL</text>
              
              <text x="80" y="48" fontSize="18" textAnchor="middle">🚪 ↕️</text>
              <text x="80" y="66" fontSize="9" fontWeight="bold" fill="#065F46" textAnchor="middle">Gerak ke 1 Arah</text>
              <text x="80" y="80" fontSize="8" fill="#047857" textAnchor="middle">Contoh: Siku &amp; Lutut</text>
            </g>

            {/* Sendi 3: Sendi Putar */}
            <g transform="translate(365, 15)">
              <rect x="0" y="0" width="160" height="95" rx="10" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
              <rect x="8" y="6" width="144" height="20" rx="4" fill="#D97706" />
              <text x="80" y="20" fontSize="9.5" fontWeight="black" fill="#FFFFFF" textAnchor="middle">3. SENDI PUTAR</text>
              
              <text x="80" y="48" fontSize="18" textAnchor="middle">🧭 ↩️</text>
              <text x="80" y="66" fontSize="9" fontWeight="bold" fill="#78350F" textAnchor="middle">Gerak Memutar (Poros)</text>
              <text x="80" y="80" fontSize="8" fill="#92400E" textAnchor="middle">Contoh: Tulang Leher (Atlas)</text>
            </g>

            {/* Sendi 4: Sendi Pelana */}
            <g transform="translate(100, 120)">
              <rect x="0" y="0" width="160" height="95" rx="10" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
              <rect x="8" y="6" width="144" height="20" rx="4" fill="#DC2626" />
              <text x="80" y="20" fontSize="9.5" fontWeight="black" fill="#FFFFFF" textAnchor="middle">4. SENDI PELANA</text>
              
              <text x="80" y="48" fontSize="18" textAnchor="middle">🏇 ↔️↕️</text>
              <text x="80" y="66" fontSize="9" fontWeight="bold" fill="#991B1B" textAnchor="middle">Gerak ke 2 Arah</text>
              <text x="80" y="80" fontSize="8" fill="#B91C1C" textAnchor="middle">Contoh: Pangkal Ibu Jari Tangan</text>
            </g>

            {/* Sendi 5: Sendi Geser */}
            <g transform="translate(280, 120)">
              <rect x="0" y="0" width="160" height="95" rx="10" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
              <rect x="8" y="6" width="144" height="20" rx="4" fill="#0284C7" />
              <text x="80" y="20" fontSize="9.5" fontWeight="black" fill="#FFFFFF" textAnchor="middle">5. SENDI GESER</text>
              
              <text x="80" y="48" fontSize="18" textAnchor="middle">↔️ 🔀</text>
              <text x="80" y="66" fontSize="9" fontWeight="bold" fill="#0369A1" textAnchor="middle">Gerak Bergeser Rata</text>
              <text x="80" y="80" fontSize="8" fill="#0284C7" textAnchor="middle">Contoh: Pergelangan Tangan/Kaki</text>
            </g>
          </svg>
          <p className="text-xs text-slate-600 mt-2 font-medium">
            Sendi menghubungkan antar-tulang sehingga memungkinkan berbagai macam arah pergerakan anggota tubuh.
          </p>
        </div>
      );

    // =========================================================================
    // SOAL 14: Perbandingan Karakteristik 3 Jenis Otot Manusia
    // =========================================================================
    case 'q14':
    case 'bagan_tiga_jenis_otot':
      return (
        <div className={`p-4 bg-rose-50/70 rounded-2xl border-2 border-rose-200 text-center ${className}`}>
          <div className="text-xs font-bold text-rose-900 mb-2 bg-rose-100 px-3 py-1 rounded-full inline-block border border-rose-300">
            🔬 Ciri &amp; Karakteristik 3 Jenis Jaringan Otot Tubuh
          </div>
          <svg viewBox="0 0 540 210" className="w-full max-w-xl mx-auto h-auto select-none">
            {/* Otot 1: Otot Polos */}
            <g transform="translate(15, 15)">
              <rect x="0" y="0" width="160" height="180" rx="10" fill="#FFFFFF" stroke="#CA8A04" strokeWidth="2" />
              <rect x="10" y="10" width="140" height="24" rx="5" fill="#CA8A04" />
              <text x="80" y="26" fontSize="10.5" fontWeight="black" fill="#FFFFFF" textAnchor="middle">OTOT POLOS</text>
              
              {/* Gambar Bentuk Gelendong */}
              <ellipse cx="80" cy="62" rx="45" ry="12" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
              <circle cx="80" cy="62" r="3" fill="#854D0E" />
              
              <rect x="8" y="85" width="144" height="85" rx="6" fill="#FEF9C3" />
              <text x="15" y="102" fontSize="8.5" fontWeight="bold" fill="#713F12">• Bentuk: Gelendong, ujung lancip</text>
              <text x="15" y="117" fontSize="8.5" fontWeight="bold" fill="#713F12">• Inti: 1 di tengah sel</text>
              <text x="15" y="132" fontSize="8.5" fontWeight="bold" fill="#713F12">• Cara kerja: Tidak sadar (otomatis)</text>
              <text x="15" y="147" fontSize="8.5" fontWeight="bold" fill="#713F12">• Letak: Lambung, usus, pembuluh</text>
              <text x="15" y="162" fontSize="8.5" fontWeight="bold" fill="#713F12">• Sifat: Lambat, tidak mudah lelah</text>
            </g>

            {/* Otot 2: Otot Lurik / Otot Rangka */}
            <g transform="translate(190, 15)">
              <rect x="0" y="0" width="160" height="180" rx="10" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2" />
              <rect x="10" y="10" width="140" height="24" rx="5" fill="#DC2626" />
              <text x="80" y="26" fontSize="10" fontWeight="black" fill="#FFFFFF" textAnchor="middle">OTOT LURIK (RANGKA)</text>
              
              {/* Gambar Bentuk Silindris Bercorak */}
              <rect x="35" y="52" width="90" height="22" rx="4" fill="#FCA5A5" stroke="#DC2626" strokeWidth="1.5" />
              <line x1="50" y1="52" x2="50" y2="74" stroke="#B91C1C" strokeWidth="1.5" />
              <line x1="65" y1="52" x2="65" y2="74" stroke="#B91C1C" strokeWidth="1.5" />
              <line x1="80" y1="52" x2="80" y2="74" stroke="#B91C1C" strokeWidth="1.5" />
              <line x1="95" y1="52" x2="95" y2="74" stroke="#B91C1C" strokeWidth="1.5" />
              <line x1="110" y1="52" x2="110" y2="74" stroke="#B91C1C" strokeWidth="1.5" />
              <circle cx="45" cy="55" r="2.5" fill="#7F1D1D" />
              <circle cx="105" cy="55" r="2.5" fill="#7F1D1D" />
              
              <rect x="8" y="85" width="144" height="85" rx="6" fill="#FEE2E2" />
              <text x="15" y="102" fontSize="8.5" fontWeight="bold" fill="#7F1D1D">• Bentuk: Silindris panjang bergaris</text>
              <text x="15" y="117" fontSize="8.5" fontWeight="bold" fill="#7F1D1D">• Inti: Banyak, berada di tepi</text>
              <text x="15" y="132" fontSize="8.5" fontWeight="bold" fill="#7F1D1D">• Cara kerja: SADAR (diperintah)</text>
              <text x="15" y="147" fontSize="8.5" fontWeight="bold" fill="#7F1D1D">• Letak: Melekat pada rangka tulang</text>
              <text x="15" y="162" fontSize="8.5" fontWeight="bold" fill="#7F1D1D">• Sifat: Cepat &amp; mudah lelah</text>
            </g>

            {/* Otot 3: Otot Jantung */}
            <g transform="translate(365, 15)">
              <rect x="0" y="0" width="160" height="180" rx="10" fill="#FFFFFF" stroke="#9333EA" strokeWidth="2" />
              <rect x="10" y="10" width="140" height="24" rx="5" fill="#9333EA" />
              <text x="80" y="26" fontSize="10.5" fontWeight="black" fill="#FFFFFF" textAnchor="middle">OTOT JANTUNG</text>
              
              {/* Gambar Bentuk Silindris Bercabang */}
              <g transform="translate(45, 52)">
                <path d="M 0 0 L 40 0 L 70 -8 M 40 0 L 70 8 M 0 20 L 40 20 L 70 12 M 40 20 L 70 28" stroke="#9333EA" strokeWidth="3" fill="none" />
                <circle cx="35" cy="10" r="3" fill="#581C87" />
              </g>
              
              <rect x="8" y="85" width="144" height="85" rx="6" fill="#F3E8FF" />
              <text x="15" y="102" fontSize="8.5" fontWeight="bold" fill="#581C87">• Bentuk: Silindris bercabang</text>
              <text x="15" y="117" fontSize="8.5" fontWeight="bold" fill="#581C87">• Inti: 1 - 2 di tengah sel</text>
              <text x="15" y="132" fontSize="8.5" fontWeight="bold" fill="#581C87">• Cara kerja: Tidak sadar (berirama)</text>
              <text x="15" y="147" fontSize="8.5" fontWeight="bold" fill="#581C87">• Letak: Hanya pada dinding jantung</text>
              <text x="15" y="162" fontSize="8.5" fontWeight="bold" fill="#581C87">• Sifat: Bekerja terus menerus</text>
            </g>
          </svg>
          <p className="text-xs text-slate-600 mt-2 font-medium">
            Ketiga otot memiliki struktur sel dan mekanisme kerja yang disesuaikan dengan fungsi organ tubuh tempatnya berada.
          </p>
        </div>
      );

    // =========================================================================
    // SOAL 16: Diagram Kelainan Tulang Belakang (Lordosis, Kifosis, Skoliosis)
    // =========================================================================
    case 'q16':
    case 'bagan_kelainan_tulang_belakang':
      return (
        <div className={`p-4 bg-orange-50/70 rounded-2xl border-2 border-orange-200 text-center ${className}`}>
          <div className="text-xs font-bold text-orange-900 mb-2 bg-orange-100 px-3 py-1 rounded-full inline-block border border-orange-300">
            ⚠️ Kelainan Bentuk Tulang Belakang Akibat Kebiasaan Posisi Duduk Salah
          </div>
          <svg viewBox="0 0 540 200" className="w-full max-w-xl mx-auto h-auto select-none">
            {/* Panel 1: Normal */}
            <g transform="translate(15, 15)">
              <rect x="0" y="0" width="120" height="170" rx="8" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.5" />
              <rect x="8" y="8" width="104" height="20" rx="4" fill="#16A34A" />
              <text x="60" y="22" fontSize="9" fontWeight="black" fill="#FFFFFF" textAnchor="middle">POSTUR NORMAL</text>
              
              {/* Garis Tulang Normal S-curved halus */}
              <path d="M 60 40 Q 56 60, 60 80 Q 64 100, 60 120" stroke="#16A34A" strokeWidth="4" fill="none" />
              <text x="60" y="145" fontSize="8.5" fontWeight="bold" fill="#15803D" textAnchor="middle">Seimbang</text>
              <text x="60" y="157" fontSize="7.5" fill="#14532D" textAnchor="middle">Tegak Simetris</text>
            </g>

            {/* Panel 2: Kifosis (Bungkuk) */}
            <g transform="translate(145, 15)">
              <rect x="0" y="0" width="120" height="170" rx="8" fill="#FFFFFF" stroke="#EA580C" strokeWidth="1.5" />
              <rect x="8" y="8" width="104" height="20" rx="4" fill="#EA580C" />
              <text x="60" y="22" fontSize="9" fontWeight="black" fill="#FFFFFF" textAnchor="middle">1. KIFOSIS</text>
              
              {/* Tulang Melengkung ke Belakang */}
              <path d="M 68 40 Q 42 75, 68 120" stroke="#EA580C" strokeWidth="4" fill="none" />
              <text x="60" y="142" fontSize="8.5" fontWeight="black" fill="#C2410C" textAnchor="middle">Membungkuk</text>
              <text x="60" y="154" fontSize="7.5" fill="#9A3412" textAnchor="middle">Punggung melengkung</text>
              <text x="60" y="164" fontSize="7.5" fill="#9A3412" textAnchor="middle">ke arah belakang</text>
            </g>

            {/* Panel 3: Lordosis */}
            <g transform="translate(275, 15)">
              <rect x="0" y="0" width="120" height="170" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
              <rect x="8" y="8" width="104" height="20" rx="4" fill="#0284C7" />
              <text x="60" y="22" fontSize="9" fontWeight="black" fill="#FFFFFF" textAnchor="middle">2. LORDOSIS</text>
              
              {/* Tulang Melengkung ke Depan di Pinggang */}
              <path d="M 52 40 Q 78 85, 52 120" stroke="#0284C7" strokeWidth="4" fill="none" />
              <text x="60" y="142" fontSize="8.5" fontWeight="black" fill="#0369A1" textAnchor="middle">Condong Depan</text>
              <text x="60" y="154" fontSize="7.5" fill="#075985" textAnchor="middle">Pinggang melengkung</text>
              <text x="60" y="164" fontSize="7.5" fill="#075985" textAnchor="middle">terlalu ke depan</text>
            </g>

            {/* Panel 4: Skoliosis */}
            <g transform="translate(405, 15)">
              <rect x="0" y="0" width="120" height="170" rx="8" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
              <rect x="8" y="8" width="104" height="20" rx="4" fill="#DC2626" />
              <text x="60" y="22" fontSize="9" fontWeight="black" fill="#FFFFFF" textAnchor="middle">3. SKOLIOSIS</text>
              
              {/* Tulang Membengkok Huruf S ke Samping */}
              <path d="M 60 40 Q 45 60, 60 80 Q 75 100, 60 120" stroke="#DC2626" strokeWidth="4" fill="none" />
              <text x="60" y="142" fontSize="8.5" fontWeight="black" fill="#B91C1C" textAnchor="middle">Bengkok Samping</text>
              <text x="60" y="154" fontSize="7.5" fill="#991B1B" textAnchor="middle">Tulang belakang</text>
              <text x="60" y="164" fontSize="7.5" fill="#991B1B" textAnchor="middle">berkelok huruf S</text>
            </g>
          </svg>
          <p className="text-xs text-slate-600 mt-2 font-medium">
            Posisi duduk yang salah di bangku sekolah dalam jangka panjang dapat merusak struktur tulang belakang secara permanen.
          </p>
        </div>
      );

    // =========================================================================
    // SOAL 20: Persendian pada Gerakan Olahraga Menendang & Berlari
    // =========================================================================
    case 'q20':
    case 'bagan_sendi_olahraga':
      return (
        <div className={`p-4 bg-teal-50/70 rounded-2xl border-2 border-teal-200 text-center ${className}`}>
          <div className="text-xs font-bold text-teal-900 mb-2 bg-teal-100 px-3 py-1 rounded-full inline-block border border-teal-300">
            ⚽ Koordinasi Rangka &amp; Sendi saat Aktivitas Berlari dan Menendang Bola
          </div>
          <svg viewBox="0 0 540 190" className="w-full max-w-xl mx-auto h-auto select-none">
            <rect x="10" y="10" width="520" height="170" rx="12" fill="#FFFFFF" stroke="#0D9488" strokeWidth="1.5" />

            {/* Ilustrasi Pelari / Penendang */}
            <g transform="translate(30, 25)">
              <rect x="0" y="0" width="200" height="140" rx="10" fill="#F0FDFA" stroke="#14B8A6" strokeWidth="1.5" />
              <text x="100" y="65" fontSize="38" textAnchor="middle">🏃 ⚽</text>
              <text x="100" y="100" fontSize="11" fontWeight="black" fill="#0F766E" textAnchor="middle">
                Gerakan Menendang Bola
              </text>
              <text x="100" y="118" fontSize="8.5" fill="#115E59" textAnchor="middle">
                Melibatkan Sendi Paha, Lutut, &amp; Kaki
              </text>
            </g>

            {/* Kotak Rincian Sendi */}
            <g transform="translate(245, 25)">
              <rect x="0" y="0" width="270" height="140" rx="10" fill="#FFFFFF" stroke="#0D9488" strokeWidth="1.5" />
              <text x="135" y="24" fontSize="11" fontWeight="black" fill="#134E4A" textAnchor="middle">
                PERAN PERSENDIAN ANGGOTA GERAK:
              </text>

              <rect x="12" y="34" width="246" height="42" rx="6" fill="#CCFBF1" />
              <text x="20" y="50" fontSize="9" fontWeight="bold" fill="#0F766E">
                1. Sendi Peluru (Gelang Panggul - Tulang Paha):
              </text>
              <text x="25" y="65" fontSize="8" fill="#115E59">
                Memungkinkan tungkai kaki mengayun bebas ke segala arah saat membidik bola.
              </text>

              <rect x="12" y="84" width="246" height="42" rx="6" fill="#CCFBF1" />
              <text x="20" y="100" fontSize="9" fontWeight="bold" fill="#0F766E">
                2. Sendi Engsel (Lutut Kaki):
              </text>
              <text x="25" y="115" fontSize="8" fill="#115E59">
                Menekuk dan meluruskan lutut dengan hentakan kuat ke satu arah saat menendang.
              </text>
            </g>
          </svg>
          <p className="text-xs text-slate-600 mt-2 font-medium">
            Kerja sama harmonis antara sendi peluru di panggul dan sendi engsel di lutut menghasilkan tendangan bola yang bertenaga.
          </p>
        </div>
      );

    // =========================================================================
    // SOAL 23: Infografik Postur Sikap Duduk yang Benar vs Salah di Meja Belajar
    // =========================================================================
    case 'q23':
    case 'infografik_postur_duduk_ergonomis':
      return (
        <div className={`p-4 bg-emerald-50/70 rounded-2xl border-2 border-emerald-200 text-center ${className}`}>
          <div className="text-xs font-bold text-emerald-900 mb-2 bg-emerald-100 px-3 py-1 rounded-full inline-block border border-emerald-300">
            🪑 Postur Duduk Ergonomis untuk Menjaga Kesehatan Tulang Belakang
          </div>
          <svg viewBox="0 0 540 190" className="w-full max-w-xl mx-auto h-auto select-none">
            {/* Panel Kiri: Sikap Duduk Benar (Tegak) */}
            <g transform="translate(20, 20)">
              <rect x="0" y="0" width="240" height="150" rx="10" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" />
              <rect x="15" y="10" width="210" height="24" rx="5" fill="#16A34A" />
              <text x="120" y="26" fontSize="10.5" fontWeight="black" fill="#FFFFFF" textAnchor="middle">
                ✅ SIKAP DUDUK BENAR
              </text>

              <text x="60" y="80" fontSize="36" textAnchor="middle">🧑‍💻</text>
              <g transform="translate(105, 48)">
                <text x="0" y="15" fontSize="8.5" fontWeight="bold" fill="#14532D">• Punggung bersandar tegak lurus</text>
                <text x="0" y="32" fontSize="8.5" fontWeight="bold" fill="#14532D">• Pandangan mata sejajar buku (30 cm)</text>
                <text x="0" y="49" fontSize="8.5" fontWeight="bold" fill="#14532D">• Telapak kaki menapak rata di lantai</text>
                <text x="0" y="66" fontSize="8.5" fontWeight="bold" fill="#14532D">• Sudut lutut dan siku 90 derajat</text>
              </g>

              <rect x="15" y="122" width="210" height="20" rx="4" fill="#BBF7D0" />
              <text x="120" y="136" fontSize="8.5" fontWeight="bold" fill="#166534" textAnchor="middle">
                Mencegah Kifosis &amp; Kelelahan Otot Leher
              </text>
            </g>

            {/* Panel Kanan: Sikap Duduk Salah (Membungkuk / Miring) */}
            <g transform="translate(280, 20)">
              <rect x="0" y="0" width="240" height="150" rx="10" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" />
              <rect x="15" y="10" width="210" height="24" rx="5" fill="#DC2626" />
              <text x="120" y="26" fontSize="10.5" fontWeight="black" fill="#FFFFFF" textAnchor="middle">
                ❌ SIKAP DUDUK SALAH
              </text>

              <text x="60" y="80" fontSize="36" textAnchor="middle">🙇‍♂️</text>
              <g transform="translate(105, 48)">
                <text x="0" y="15" fontSize="8.5" fontWeight="bold" fill="#7F1D1D">• Punggung membungkuk ke meja</text>
                <text x="0" y="32" fontSize="8.5" fontWeight="bold" fill="#7F1D1D">• Menulis dengan tubuh miring ke samping</text>
                <text x="0" y="49" fontSize="8.5" fontWeight="bold" fill="#7F1D1D">• Kaki ditekuk atau menggantung</text>
                <text x="0" y="66" fontSize="8.5" fontWeight="bold" fill="#7F1D1D">• Leher menekuk terlalu dekat kertas</text>
              </g>

              <rect x="15" y="122" width="210" height="20" rx="4" fill="#FECACA" />
              <text x="120" y="136" fontSize="8.5" fontWeight="bold" fill="#991B1B" textAnchor="middle">
                Memicu Skoliosis, Pegal Linu, &amp; Rabun Jauh
              </text>
            </g>
          </svg>
          <p className="text-xs text-slate-600 mt-2 font-medium">
            Membiasakan duduk tegak di sekolah dan rumah adalah cara paling mendasar melindungi kelengkungan tulang belakang.
          </p>
        </div>
      );

    // =========================================================================
    // SOAL 27: Diagram Pembiasaan Hidup Sehat & Nutrisi Tulang
    // =========================================================================
    case 'q27':
    case 'bagan_kesehatan_tulang_otot':
      return (
        <div className={`p-4 bg-yellow-50/70 rounded-2xl border-2 border-yellow-200 text-center ${className}`}>
          <div className="text-xs font-bold text-yellow-900 mb-2 bg-yellow-100 px-3 py-1 rounded-full inline-block border border-yellow-300">
            ☀️ 4 Pilar Menjaga Kepadatan Tulang &amp; Kekuatan Otot Sejak Usia Dini
          </div>
          <svg viewBox="0 0 540 180" className="w-full max-w-xl mx-auto h-auto select-none">
            {/* Pilar 1: Makanan Berkalsium */}
            <g transform="translate(15, 15)">
              <rect x="0" y="0" width="115" height="145" rx="10" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
              <rect x="8" y="8" width="99" height="20" rx="4" fill="#0284C7" />
              <text x="57" y="22" fontSize="9" fontWeight="black" fill="#FFFFFF" textAnchor="middle">1. KALSIUM</text>
              <text x="57" y="55" fontSize="24" textAnchor="middle">🥛 🧀 🐟</text>
              <text x="57" y="78" fontSize="9.5" fontWeight="bold" fill="#0369A1" textAnchor="middle">Susu &amp; Ikan Teri</text>
              <text x="57" y="93" fontSize="8" fill="#0284C7" textAnchor="middle">Bahan utama</text>
              <text x="57" y="105" fontSize="8" fill="#0284C7" textAnchor="middle">pembentuk kepadatan</text>
              <text x="57" y="117" fontSize="8" fill="#0284C7" textAnchor="middle">matriks tulang keras</text>
            </g>

            {/* Pilar 2: Vitamin D & Sinar Mentari */}
            <g transform="translate(145, 15)">
              <rect x="0" y="0" width="115" height="145" rx="10" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
              <rect x="8" y="8" width="99" height="20" rx="4" fill="#D97706" />
              <text x="57" y="22" fontSize="9" fontWeight="black" fill="#FFFFFF" textAnchor="middle">2. MENTARI PAGI</text>
              <text x="57" y="55" fontSize="24" textAnchor="middle">☀️ 🏃</text>
              <text x="57" y="78" fontSize="9.5" fontWeight="bold" fill="#B45309" textAnchor="middle">Sinar Ultraviolet</text>
              <text x="57" y="93" fontSize="8" fill="#92400E" textAnchor="middle">Mengaktifkan</text>
              <text x="57" y="105" fontSize="8" fill="#92400E" textAnchor="middle">pro-vitamin D di kulit</text>
              <text x="57" y="117" fontSize="8" fill="#92400E" textAnchor="middle">agar kalsium terserap</text>
            </g>

            {/* Pilar 3: Olahraga Teratur */}
            <g transform="translate(275, 15)">
              <rect x="0" y="0" width="115" height="145" rx="10" fill="#FFFFFF" stroke="#16A34A" strokeWidth="2" />
              <rect x="8" y="8" width="99" height="20" rx="4" fill="#16A34A" />
              <text x="57" y="22" fontSize="9" fontWeight="black" fill="#FFFFFF" textAnchor="middle">3. OLAHRAGA</text>
              <text x="57" y="55" fontSize="24" textAnchor="middle">🚴 🤸</text>
              <text x="57" y="78" fontSize="9.5" fontWeight="bold" fill="#15803D" textAnchor="middle">Aktivitas Fisik</text>
              <text x="57" y="93" fontSize="8" fill="#166534" textAnchor="middle">Melatih kelenturan</text>
              <text x="57" y="105" fontSize="8" fill="#166534" textAnchor="middle">sendi serta menguatkan</text>
              <text x="57" y="117" fontSize="8" fill="#166534" textAnchor="middle">massa otot tubuh</text>
            </g>

            {/* Pilar 4: Hindari Beban Berlebih */}
            <g transform="translate(405, 15)">
              <rect x="0" y="0" width="115" height="145" rx="10" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2" />
              <rect x="8" y="8" width="99" height="20" rx="4" fill="#DC2626" />
              <text x="57" y="22" fontSize="9" fontWeight="black" fill="#FFFFFF" textAnchor="middle">4. BEBAN TAS</text>
              <text x="57" y="55" fontSize="24" textAnchor="middle">🎒 ⚖️</text>
              <text x="57" y="78" fontSize="9.5" fontWeight="bold" fill="#B91C1C" textAnchor="middle">Gunakan 2 Tali</text>
              <text x="57" y="93" fontSize="8" fill="#991B1B" textAnchor="middle">Beban tas maksimal</text>
              <text x="57" y="105" fontSize="8" fill="#991B1B" textAnchor="middle">10-15% berat badan</text>
              <text x="57" y="117" fontSize="8" fill="#991B1B" textAnchor="middle">agar bahu tak miring</text>
            </g>
          </svg>
          <p className="text-xs text-slate-600 mt-2 font-medium">
            Kepadatan tulang manusia mencapai puncaknya di usia muda, sehingga perawatan nutrisi sejak SD sangat penting.
          </p>
        </div>
      );

    default:
      return null;
  }
};
