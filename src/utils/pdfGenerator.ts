import { jsPDF } from 'jspdf';
import { CONFIG } from '../config';
import { ExamResult, Question } from '../types';

/**
 * Format tanggal dalam bahasa Indonesia
 */
export function formatIndonesianDate(dateStr?: string): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(d.getTime())) {
    return new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * 1. Download Lembar Hasil Tes Siswa (Tanda Tangan Guru & Orang Tua/Wali)
 */
export function downloadStudentResultPDF(result: ExamResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // --- KOP SURAT SEKOLAH ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.text('DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, y, { align: 'center' });
  y += 6;
  doc.setFontSize(14);
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(CONFIG.ALAMAT_SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 3;

  // Garis Pembatas Kop
  doc.setLineWidth(0.8);
  doc.line(15, y, pageWidth - 15, y);
  doc.setLineWidth(0.2);
  doc.line(15, y + 0.8, pageWidth - 15, y + 0.8);
  y += 8;

  // --- JUDUL DOKUMEN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('LEMBAR LAPORAN HASIL TES SUMATIF', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tahun Ajaran 2025/2026`, pageWidth / 2, y, { align: 'center' });
  y += 9;

  // --- DATA IDENTITAS SISWA ---
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y, pageWidth - 30, 36, 2, 2, 'FD');

  doc.setFontSize(10);
  const leftX = 20;
  const col2X = 58;
  const rightX = 115;
  const col4X = 150;

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Nama Peserta', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${result.nama}`, col2X, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Mata Pelajaran', rightX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${CONFIG.MATA_PELAJARAN}`, col4X, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Nomor Absen', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${result.noAbsen}`, col2X, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Materi / Pokok', rightX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${CONFIG.MATERI}`, col4X, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Kelas', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${result.kelas || CONFIG.KELAS}`, col2X, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Standar KKTP', rightX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${CONFIG.KKTP_DISPLAY || CONFIG.KKTP}`, col4X, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Waktu Pengerjaan', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${result.timestamp}`, col2X, y);

  y += 12;

  // --- TABEL PEROLEHAN HASIL ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('A. Hasil Perolehan Nilai Tes', 15, y);
  y += 5;

  // Header Tabel
  doc.setFillColor(30, 58, 138); // Dark Navy Blue
  doc.rect(15, y, pageWidth - 30, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('Komponen Penilaian', 20, y + 5.5);
  doc.text('Jumlah / Nilai', pageWidth - 45, y + 5.5, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  y += 8;

  // Baris-baris tabel
  const totalQuestionsCount = (result.benar || 0) + (result.salah || 0) > 0 ? (result.benar || 0) + (result.salah || 0) : 30;
  const tableRows = [
    { label: 'Jumlah Soal Keseluruhan', value: `${totalQuestionsCount} Butir Soal` },
    { label: 'Jumlah Jawaban Benar', value: `${result.benar} Soal` },
    { label: 'Jumlah Jawaban Salah / Tidak Tepat', value: `${result.salah} Soal` },
    { label: 'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)', value: `${CONFIG.KKTP}` },
    {
      label: 'Catatan Integritas & Kepatuhan Ujian',
      value:
        result.violationCount && result.violationCount > 0
          ? `${result.violationCount}x Keluar Layar/Tab${result.isAutoSubmitted ? ' (Auto-Submit)' : ''}`
          : 'Tertib (100% Layar Penuh)',
    },
  ];

  doc.setFont('helvetica', 'normal');
  tableRows.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
    doc.rect(15, y, pageWidth - 30, 7.5, 'F');
    doc.rect(15, y, pageWidth - 30, 7.5, 'S');
    doc.text(row.label, 20, y + 5);
    doc.text(row.value, pageWidth - 45, y + 5, { align: 'right' });
    y += 7.5;
  });

  // Baris Nilai Akhir & Status
  const isPass = result.status === 'Lulus' || result.nilai >= CONFIG.KKTP;
  doc.setFillColor(isPass ? 240 : 254, isPass ? 253 : 242, isPass ? 244 : 242);
  doc.rect(15, y, pageWidth - 30, 10, 'F');
  doc.rect(15, y, pageWidth - 30, 10, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('NILAI AKHIR TES SUMATIF (Skala 0 - 100)', 20, y + 6.5);
  doc.setFontSize(13);
  doc.setTextColor(isPass ? 22 : 185, isPass ? 101 : 28, isPass ? 52 : 28);
  doc.text(String(result.nilai), pageWidth - 45, y + 7, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  y += 10;

  // Status Baris
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, pageWidth - 30, 9, 'F');
  doc.rect(15, y, pageWidth - 30, 9, 'S');
  doc.setFontSize(10);
  doc.text('Keterangan Kelulusan', 20, y + 6);
  doc.setFontSize(10);
  doc.setTextColor(isPass ? 22 : 185, isPass ? 101 : 28, isPass ? 52 : 28);
  doc.text(isPass ? 'LULUS (Mencapai KKTP)' : 'BELUM LULUS (Perlu Remedial)', pageWidth - 45, y + 6, {
    align: 'right',
  });
  doc.setTextColor(0, 0, 0);
  y += 14;

  // --- CATATAN GURU ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('B. Catatan Pembelajaran Guru Kelas:', 15, y);
  y += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  const note = isPass
    ? 'Selamat atas pencapaian yang memuaskan. Tingkatkan terus semangat belajar dan ketelitian dalam memahami konsep sains IPAS.'
    : 'Perlu bimbingan dan pengulangan materi terutama pada konsep soal kompleks dan pemecahan masalah (remedial). Tetap semangat belajar.';
  doc.text(note, 15, y, { maxWidth: pageWidth - 30 });
  y += 16;

  // --- TANDA TANGAN (HANYA GURU & ORANG TUA/WALI) ---
  // Syarat eksplisit dari pengguna: "hanya ditandatangi oleh guru dan orang tua/wali"
  const ttdY = Math.max(y, 220);
  const colLeft = 20;
  const colRight = pageWidth - 65;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);

  // Kolom Kiri: Orang Tua / Wali
  doc.text('Mengetahui,', colLeft, ttdY);
  doc.text('Orang Tua / Wali Siswa,', colLeft, ttdY + 5);

  // Kolom Kanan: Guru Kelas VI
  const tglFormatted = formatIndonesianDate();
  doc.text(`Jembrana, ${tglFormatted}`, colRight, ttdY);
  doc.text('Guru Mata Pelajaran / Kelas VI,', colRight, ttdY + 5);

  // Area tanda tangan (spasi vertikal)
  const lineY = ttdY + 27;

  // Garis nama Orang Tua
  doc.line(colLeft, lineY, colLeft + 45, lineY);
  doc.text('( ......................................... )', colLeft, lineY + 4);

  // Garis nama Guru
  doc.setFont('helvetica', 'bold');
  doc.text(CONFIG.GURU, colRight, lineY - 1);
  doc.line(colRight, lineY, colRight + 48, lineY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`NIP. ${CONFIG.NIP_GURU}`, colRight, lineY + 4);

  // Simpan PDF
  const safeName = (result.nama || 'siswa').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Hasil_Tes_Sumatif_${safeName}_Absen_${result.noAbsen}.pdf`);
}

/**
 * 2. Download Naskah Soal Ujian (PDF)
 */
export function downloadExamQuestionsPDF(questions: Question[]): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 16;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 16;
      addPageHeader();
    }
  };

  const addPageHeader = () => {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `${CONFIG.SEKOLAH} | Naskah Soal Tes Sumatif ${CONFIG.MATA_PELAJARAN} Kelas ${CONFIG.KELAS}`,
      pageWidth / 2,
      9,
      { align: 'center' }
    );
    doc.setTextColor(0, 0, 0);
  };

  // --- KOP SOAL ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(13);
  doc.text('NASKAH SOAL TES SUMATIF SEMESTER', pageWidth / 2, y, { align: 'center' });
  y += 3;

  doc.setLineWidth(0.6);
  doc.line(15, y, pageWidth - 15, y);
  y += 6;

  // Metadata Soal
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Mata Pelajaran : ${CONFIG.MATA_PELAJARAN}`, 16, y);
  doc.text(`Kelas / Semester : Kelas ${CONFIG.KELAS}`, 120, y);
  y += 4.5;
  doc.text(`Materi Pokok    : ${CONFIG.MATERI}`, 16, y);
  doc.text(`Alokasi Waktu    : 60 Menit`, 120, y);
  y += 4.5;
  doc.text(`Kriteria KKTP   : ${CONFIG.KKTP_DISPLAY || CONFIG.KKTP}`, 16, y);
  doc.text(`Jumlah Soal      : ${questions.length} Butir`, 120, y);
  y += 6;

  doc.setDrawColor(180, 180, 180);
  doc.setFillColor(245, 247, 250);
  doc.rect(15, y, pageWidth - 30, 11, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.text('PETUNJUK UMUM:', 18, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(
    '1. Tulislah identitas pada lembar jawaban. 2. Kerjakan soal dengan teliti dan jujur. 3. Periksa kembali jawaban sebelum dikirimkan.',
    18,
    y + 8,
    { maxWidth: pageWidth - 36 }
  );
  y += 16;

  // Iterasi Soal
  questions.forEach((q, idx) => {
    checkPageBreak(25);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);

    let typeLabel = 'Pilihan Ganda';
    if (q.type === 'pgk') typeLabel = 'Pilihan Ganda Kompleks (Bisa >1 jawaban benar)';
    if (q.type === 'pgk_kategori') typeLabel = 'Pilihan Ganda Kompleks Kategori (Benar / Salah)';

    doc.setTextColor(30, 58, 138);
    doc.text(`Soal No. ${idx + 1} [${typeLabel}]`, 15, y);
    doc.setTextColor(0, 0, 0);
    y += 5;

    // Teks Soal
    doc.setFont('helvetica', 'normal');
    const textLines = doc.splitTextToSize(q.text, pageWidth - 32);
    checkPageBreak(textLines.length * 4.5 + 15);
    doc.text(textLines, 16, y);
    y += textLines.length * 4.5 + 2;

    // Opsi Jawaban
    if (q.options && q.options.length > 0) {
      q.options.forEach((opt) => {
        checkPageBreak(8);
        const optLines = doc.splitTextToSize(`${opt.id}. ${opt.text}`, pageWidth - 36);
        doc.text(optLines, 20, y);
        y += optLines.length * 4.2 + 1;
      });
      y += 3;
    }

    // Pernyataan Kategori (Benar / Salah)
    if (q.statements && q.statements.length > 0) {
      q.statements.forEach((st, sIdx) => {
        checkPageBreak(10);
        const stLines = doc.splitTextToSize(
          `Pernyataan ${sIdx + 1}: ${st.text}   [  ] Benar   [  ] Salah`,
          pageWidth - 36
        );
        doc.text(stLines, 20, y);
        y += stLines.length * 4.5 + 1.5;
      });
      y += 3;
    }
  });

  doc.save(`Naskah_Soal_${CONFIG.MATA_PELAJARAN.replace(/[^a-zA-Z0-9]/g, '_')}_Kelas_${CONFIG.KELAS.replace(/[^a-zA-Z0-9]/g, '_')}_${CONFIG.SEKOLAH.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

/**
 * 3. Export Rekap Nilai ke Format CSV (Bisa dibuka langsung di Microsoft Excel)
 */
export function exportResultsToCSV(results: ExamResult[]): void {
  const headers = [
    'Timestamp',
    'Nama Siswa',
    'Kelas',
    'Nomor Absen',
    'Tanggal Lahir',
    'Benar',
    'Salah',
    'Nilai',
    'Status',
    'Pelanggaran Tab',
    'Status Pengerjaan',
  ];

  const rows = results.map((r) => [
    `"${r.timestamp || ''}"`,
    `"${r.nama || ''}"`,
    `"${r.kelas || CONFIG.KELAS}"`,
    `"${r.noAbsen || ''}"`,
    `"${r.tglLahir || ''}"`,
    r.benar,
    r.salah,
    r.nilai,
    `"${r.status}"`,
    r.violationCount && r.violationCount > 0 ? `"${r.violationCount}x Keluar Tab"` : '"0 (Tertib)"',
    r.isAutoSubmitted ? '"Auto-Submit (Diskualifikasi)"' : '"Submit Mandiri"',
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekap_Nilai_Tes_Sumatif_Kelas_${CONFIG.KELAS}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 4. Download Rekapitulasi Data Nilai Siswa (PDF Resmi Berkop dan Bertanda Tangan)
 */
export function downloadResultsRecapPDF(results: ExamResult[]): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 12;
  const marginRight = 12;
  const contentWidth = pageWidth - marginLeft - marginRight; // 186mm

  // Hitung Statistik
  const total = results.length;
  const lulus = results.filter((r) => r.status === 'Lulus' || r.nilai >= CONFIG.KKTP).length;
  const belumLulus = total - lulus;
  const persenLulus = total > 0 ? Math.round((lulus / total) * 100) : 0;
  const rataRata = total > 0 ? (results.reduce((acc, r) => acc + (r.nilai || 0), 0) / total).toFixed(1) : '0';
  const nilaiTertinggi = total > 0 ? Math.max(...results.map((r) => r.nilai || 0)) : 0;
  const nilaiTerendah = total > 0 ? Math.min(...results.map((r) => r.nilai || 0)) : 0;

  let y = 14;

  // --- KOP DOKUMEN SEKOLAH ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.text('DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, y, { align: 'center' });
  y += 5.5;
  doc.setFontSize(13);
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(CONFIG.ALAMAT_SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 2.5;

  // Garis Pembatas Kop Ganda
  doc.setLineWidth(0.8);
  doc.line(marginLeft, y, pageWidth - marginRight, y);
  doc.setLineWidth(0.2);
  doc.line(marginLeft, y + 0.8, pageWidth - marginRight, y + 0.8);
  y += 6;

  // --- JUDUL DOKUMEN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DAFTAR REKAPITULASI NILAI HASIL TES SUMATIF', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `Mata Pelajaran: ${CONFIG.MATA_PELAJARAN} • Materi: ${CONFIG.MATERI} • Kelas ${CONFIG.KELAS} • KKTP: ${CONFIG.KKTP_DISPLAY || CONFIG.KKTP}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 6;

  // --- KOTAK RINGKASAN STATISTIK ---
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(marginLeft, y, contentWidth, 14, 1.5, 1.5, 'FD');

  const statCols = [
    { label: 'Total Peserta', val: `${total} Siswa` },
    { label: 'Jumlah Lulus', val: `${lulus} Siswa (${persenLulus}%)` },
    { label: 'Belum Lulus', val: `${belumLulus} Siswa` },
    { label: 'Rata-rata Nilai', val: `${rataRata}` },
    { label: 'Tertinggi / Terendah', val: `${nilaiTertinggi} / ${nilaiTerendah}` },
  ];
  const colW = contentWidth / statCols.length;
  statCols.forEach((col, idx) => {
    const cx = marginLeft + idx * colW + colW / 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(col.label, cx, y + 5, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(col.val, cx, y + 10.5, { align: 'center' });
  });

  doc.setTextColor(0, 0, 0);
  y += 18;

  // Definisi Kolom Tabel
  const cols = [
    { key: 'no', title: 'No', width: 9, align: 'center' as const },
    { key: 'noAbsen', title: 'Absen', width: 13, align: 'center' as const },
    { key: 'nama', title: 'Nama Siswa', width: 56, align: 'left' as const },
    { key: 'kelas', title: 'Kelas', width: 12, align: 'center' as const },
    { key: 'benar', title: 'Benar', width: 13, align: 'center' as const },
    { key: 'salah', title: 'Salah', width: 13, align: 'center' as const },
    { key: 'nilai', title: 'Nilai', width: 14, align: 'center' as const },
    { key: 'status', title: 'Keterangan', width: 24, align: 'center' as const },
    { key: 'timestamp', title: 'Waktu Submit', width: 32, align: 'center' as const },
  ];

  const drawTableHeader = (curY: number) => {
    doc.setFillColor(30, 58, 138); // Dark blue
    doc.rect(marginLeft, curY, contentWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);

    let curX = marginLeft;
    cols.forEach((col) => {
      const textX = col.align === 'center' ? curX + col.width / 2 : curX + 2;
      doc.text(col.title, textX, curY + 4.8, { align: col.align });
      curX += col.width;
    });
    doc.setTextColor(0, 0, 0);
  };

  drawTableHeader(y);
  y += 7;

  if (results.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text('Belum ada data nilai siswa yang tersimpan.', pageWidth / 2, y + 8, { align: 'center' });
    y += 16;
  } else {
    results.forEach((r, idx) => {
      // Check for page break
      if (y + 6.5 > pageHeight - 38) {
        doc.addPage();
        y = 15;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text('Lanjutan Rekapitulasi Nilai Siswa:', marginLeft, y - 2);
        drawTableHeader(y);
        y += 7;
      }

      const isEven = idx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.rect(marginLeft, y, contentWidth, 6.5, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(marginLeft, y, contentWidth, 6.5, 'S');

      let curX = marginLeft;
      const isLulus = r.status === 'Lulus' || r.nilai >= CONFIG.KKTP;

      cols.forEach((col) => {
        let val = '';
        if (col.key === 'no') val = String(idx + 1);
        else if (col.key === 'noAbsen') val = String(r.noAbsen || '-');
        else if (col.key === 'nama') val = r.nama || '-';
        else if (col.key === 'kelas') val = r.kelas || CONFIG.KELAS;
        else if (col.key === 'benar') val = String(r.benar ?? 0);
        else if (col.key === 'salah') val = String(r.salah ?? 0);
        else if (col.key === 'nilai') val = String(r.nilai ?? 0);
        else if (col.key === 'status') val = isLulus ? 'Lulus' : 'Remedial';
        else if (col.key === 'timestamp') val = (r.timestamp || '-').substring(0, 16);

        doc.setFont('helvetica', col.key === 'nilai' ? 'bold' : 'normal');
        doc.setFontSize(7.8);

        if (col.key === 'status') {
          doc.setTextColor(isLulus ? 22 : 185, isLulus ? 101 : 28, isLulus ? 52 : 28);
        } else if (col.key === 'nilai') {
          doc.setTextColor(isLulus ? 15 : 185, isLulus ? 23 : 28, isLulus ? 42 : 28);
        } else {
          doc.setTextColor(30, 41, 59);
        }

        const textX = col.align === 'center' ? curX + col.width / 2 : curX + 2;

        if (col.key === 'nama') {
          const truncated = doc.splitTextToSize(val, col.width - 3)[0] || val;
          doc.text(truncated, textX, y + 4.5);
        } else {
          doc.text(val, textX, y + 4.5, { align: col.align });
        }

        curX += col.width;
      });

      doc.setTextColor(0, 0, 0);
      y += 6.5;
    });
  }

  // Cek apakah muat untuk tanda tangan (perlu ~38mm)
  if (y + 38 > pageHeight - 16) {
    doc.addPage();
    y = 18;
  } else {
    y += 8;
  }

  // --- TANDA TANGAN (KEPALA SEKOLAH & GURU) ---
  const tglStr = formatIndonesianDate();
  const colLeftX = marginLeft + 8;
  const colRightX = pageWidth - marginRight - 55;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  // Kiri: Kepala Sekolah
  doc.text('Mengetahui,', colLeftX, y);
  doc.text('Kepala Sekolah,', colLeftX, y + 4.5);

  // Kanan: Guru Pengampu
  doc.text(`Jembrana, ${tglStr}`, colRightX, y);
  doc.text('Guru Mata Pelajaran,', colRightX, y + 4.5);

  const sigLineY = y + 23;
  // Nama & NIP Kepala Sekolah
  doc.setFont('helvetica', 'bold');
  doc.text(CONFIG.KEPALA_SEKOLAH, colLeftX, sigLineY);
  doc.line(colLeftX, sigLineY + 1, colLeftX + 50, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${CONFIG.NIP_KEPALA_SEKOLAH}`, colLeftX, sigLineY + 5);

  // Nama & NIP Guru
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(CONFIG.GURU, colRightX, sigLineY);
  doc.line(colRightX, sigLineY + 1, colRightX + 50, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${CONFIG.NIP_GURU}`, colRightX, sigLineY + 5);

  // --- FOOTER DI SETIAP HALAMAN ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Dokumen Rekapitulasi Nilai Resmi • ${CONFIG.SEKOLAH} • Dicetak otomatis sistem`,
      marginLeft,
      pageHeight - 6
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginRight, pageHeight - 6, {
      align: 'right',
    });
  }

  doc.save(`Rekap_Nilai_Tes_Sumatif_${CONFIG.MATA_PELAJARAN.replace(/[^a-zA-Z0-9]/g, '_')}_Kelas_${CONFIG.KELAS.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

/**
 * 5. Download Laporan Resmi Analisis Butir Soal & Daya Pembeda (PDF Berkop)
 */
export function downloadItemAnalysisPDF(summary: import('./itemAnalysis').ItemAnalysisSummary): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210mm
  const marginLeft = 14;
  const marginRight = 14;
  const contentWidth = pageWidth - marginLeft - marginRight; // 269mm

  let y = 14;

  // --- KOP SURAT RESMI SEKOLAH ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.text('DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, y, { align: 'center' });
  y += 5.5;
  doc.setFontSize(13);
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(CONFIG.ALAMAT_SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 2.5;

  // Garis Pembatas Kop
  doc.setLineWidth(0.8);
  doc.line(marginLeft, y, pageWidth - marginRight, y);
  doc.setLineWidth(0.2);
  doc.line(marginLeft, y + 0.8, pageWidth - marginRight, y + 0.8);
  y += 6;

  // --- JUDUL DOKUMEN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('LAPORAN HASIL ANALISIS BUTIR SOAL & DAYA PEMBEDA', pageWidth / 2, y, {
    align: 'center',
  });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `Mata Pelajaran: ${CONFIG.MATA_PELAJARAN} • Kelas: ${CONFIG.KELAS} • Materi: ${CONFIG.MATERI}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 6;

  // --- KOTAK RINGKASAN METRIK ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(marginLeft, y, contentWidth, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`Total Peserta: ${summary.totalStudentsAnalyzed} Siswa`, marginLeft + 4, y + 5);
  doc.text(`Jumlah Butir: ${summary.totalQuestions} Soal`, marginLeft + 45, y + 5);
  doc.text(`Rata-rata Tingkat Kesukaran (P): ${summary.averageDifficultyIndex}`, marginLeft + 90, y + 5);
  doc.text(`Rata-rata Daya Beda (D): ${summary.averageDiscriminationIndex}`, marginLeft + 160, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(
    `Distribusi Kesukaran: ${summary.difficultyCounts.mudah} Mudah, ${summary.difficultyCounts.sedang} Sedang, ${summary.difficultyCounts.sukar} Sukar`,
    marginLeft + 4,
    y + 10.5
  );
  doc.text(
    `Klasifikasi Daya Beda: ${summary.discriminationCounts.sangatBaik} Sangat Baik, ${summary.discriminationCounts.baik} Baik, ${summary.discriminationCounts.cukup} Cukup, ${summary.discriminationCounts.jelek} Jelek/Revisi`,
    marginLeft + 115,
    y + 10.5
  );

  y += 18;

  // --- TABEL ANALISIS BUTIR SOAL ---
  const columns = [
    { header: 'No', width: 10, align: 'center' },
    { header: 'Bentuk', width: 22, align: 'center' },
    { header: 'Topik / Indikator Materi', width: 62, align: 'left' },
    { header: 'Kunci', width: 14, align: 'center' },
    { header: 'Benar', width: 14, align: 'center' },
    { header: 'Salah', width: 14, align: 'center' },
    { header: '% Capai', width: 16, align: 'center' },
    { header: 'Indeks (P)', width: 18, align: 'center' },
    { header: 'Kategori', width: 18, align: 'center' },
    { header: 'Daya Beda (D)', width: 22, align: 'center' },
    { header: 'Klasifikasi', width: 22, align: 'center' },
    { header: 'Tindak Lanjut Pedagogis', width: 37, align: 'left' },
  ];

  const drawTableHeader = () => {
    doc.setFillColor(30, 41, 59);
    doc.rect(marginLeft, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);

    let curX = marginLeft;
    columns.forEach((col) => {
      const textX = col.align === 'center' ? curX + col.width / 2 : curX + 2;
      doc.text(col.header, textX, y + 4.8, { align: col.align as any });
      curX += col.width;
    });
    doc.setTextColor(0, 0, 0);
    y += 7;
  };

  drawTableHeader();

  summary.items.forEach((item, index) => {
    // Cek kebutuhan page break
    if (y + 8 > pageHeight - 25) {
      doc.addPage();
      y = 15;
      drawTableHeader();
    }

    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(marginLeft, y, contentWidth, 6.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(marginLeft, y + 6.5, marginLeft + contentWidth, y + 6.5);

    let curX = marginLeft;
    doc.setFontSize(7.2);

    // No
    doc.setFont('helvetica', 'bold');
    doc.text(String(item.questionNumber), curX + 5, y + 4.5, { align: 'center' });
    curX += 10;

    // Bentuk
    doc.setFont('helvetica', 'normal');
    const typeLabel =
      item.question.type === 'pg'
        ? 'PG (3 Opsi)'
        : item.question.type === 'pgk_kategori'
        ? 'Benar/Salah'
        : 'PG Kompleks';
    doc.text(typeLabel, curX + 11, y + 4.5, { align: 'center' });
    curX += 22;

    // Topik
    const topicTrunc = doc.splitTextToSize(item.question.topic || item.question.text, 58)[0] || '';
    doc.text(topicTrunc, curX + 2, y + 4.5);
    curX += 62;

    // Kunci
    const keyLabel = Array.isArray(item.question.correctAnswer)
      ? item.question.correctAnswer.join(',')
      : item.question.correctAnswer || 'Sesuai';
    doc.text(String(keyLabel), curX + 7, y + 4.5, { align: 'center' });
    curX += 14;

    // Benar
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 101, 52);
    doc.text(String(item.correctCount), curX + 7, y + 4.5, { align: 'center' });
    curX += 14;

    // Salah
    doc.setTextColor(185, 28, 28);
    doc.text(String(item.incorrectCount), curX + 7, y + 4.5, { align: 'center' });
    curX += 14;

    // % Capai
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(`${item.correctPercentage}%`, curX + 8, y + 4.5, { align: 'center' });
    curX += 16;

    // Indeks P
    doc.setFont('helvetica', 'bold');
    doc.text(item.difficultyIndex.toFixed(2), curX + 9, y + 4.5, { align: 'center' });
    curX += 18;

    // Kategori P
    doc.setFont('helvetica', 'normal');
    if (item.difficultyCategory === 'Sukar') doc.setTextColor(185, 28, 28);
    else if (item.difficultyCategory === 'Mudah') doc.setTextColor(22, 101, 52);
    else doc.setTextColor(30, 41, 59);
    doc.text(item.difficultyCategory, curX + 9, y + 4.5, { align: 'center' });
    doc.setTextColor(30, 41, 59);
    curX += 18;

    // Daya Beda D
    doc.setFont('helvetica', 'bold');
    doc.text(item.discriminationIndex.toFixed(2), curX + 11, y + 4.5, { align: 'center' });
    curX += 22;

    // Klasifikasi D
    doc.setFont('helvetica', 'normal');
    if (item.discriminationCategory === 'Jelek / Revisi') doc.setTextColor(185, 28, 28);
    else if (item.discriminationCategory === 'Sangat Baik') doc.setTextColor(22, 101, 52);
    else doc.setTextColor(30, 41, 59);
    doc.text(item.discriminationCategory, curX + 11, y + 4.5, { align: 'center' });
    doc.setTextColor(30, 41, 59);
    curX += 22;

    // Rekomendasi
    doc.setFontSize(6.8);
    const recShort = item.remedialNeeded
      ? 'Remedial Pembelajaran'
      : item.discriminationCategory === 'Jelek / Revisi'
      ? 'Revisi Pengecoh/Opsi'
      : 'Soal Dipertahankan';
    doc.text(recShort, curX + 2, y + 4.5);

    y += 6.5;
  });

  // Tanda tangan
  if (y + 35 > pageHeight - 16) {
    doc.addPage();
    y = 16;
  } else {
    y += 8;
  }

  const tglStr = formatIndonesianDate();
  const colLeftX = marginLeft + 15;
  const colRightX = pageWidth - marginRight - 70;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Mengetahui,', colLeftX, y);
  doc.text('Kepala Sekolah,', colLeftX, y + 4.5);

  doc.text(`Jembrana, ${tglStr}`, colRightX, y);
  doc.text('Guru Kelas / Pengampu,', colRightX, y + 4.5);

  const sigLineY = y + 20;
  doc.setFont('helvetica', 'bold');
  doc.text(CONFIG.KEPALA_SEKOLAH, colLeftX, sigLineY);
  doc.line(colLeftX, sigLineY + 1, colLeftX + 50, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`NIP. ${CONFIG.NIP_KEPALA_SEKOLAH}`, colLeftX, sigLineY + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(CONFIG.GURU, colRightX, sigLineY);
  doc.line(colRightX, sigLineY + 1, colRightX + 50, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`NIP. ${CONFIG.NIP_GURU}`, colRightX, sigLineY + 4.5);

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Laporan Analisis Butir Soal Resmi • ${CONFIG.SEKOLAH} • Kurikulum Merdeka`,
      marginLeft,
      pageHeight - 5
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginRight, pageHeight - 5, {
      align: 'right',
    });
  }

  doc.save(`Analisis_Butir_Soal_${CONFIG.MATA_PELAJARAN.replace(/[^a-zA-Z0-9]/g, '_')}_Kelas_${CONFIG.KELAS.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

/**
 * 6. Export Analisis Butir Soal ke Format CSV (Excel)
 */
export function exportItemAnalysisToCSV(summary: import('./itemAnalysis').ItemAnalysisSummary): void {
  const headers = [
    'No Soal',
    'Bentuk Soal',
    'Topik Soal',
    'Kunci Jawaban',
    'Total Siswa (N)',
    'Jumlah Benar (B)',
    'Jumlah Salah (S)',
    'Persentase Benar (%)',
    'Indeks Kesukaran (P)',
    'Kategori Kesukaran',
    'Indeks Daya Beda (D)',
    'Klasifikasi Daya Beda',
    'Status Remedial',
    'Rekomendasi Tindak Lanjut',
  ];

  const rows = summary.items.map((it) => [
    it.questionNumber,
    `"${it.question.type === 'pg' ? 'Pilihan Ganda' : it.question.type === 'pgk_kategori' ? 'Benar / Salah' : 'Pilihan Kompleks'}"`,
    `"${(it.question.topic || '').replace(/"/g, '""')}"`,
    `"${Array.isArray(it.question.correctAnswer) ? it.question.correctAnswer.join(',') : it.question.correctAnswer || '-'}"`,
    it.totalStudents,
    it.correctCount,
    it.incorrectCount,
    it.correctPercentage,
    it.difficultyIndex.toFixed(2),
    `"${it.difficultyCategory}"`,
    it.discriminationIndex.toFixed(2),
    `"${it.discriminationCategory}"`,
    `"${it.remedialNeeded ? 'Perlu Remedial' : 'Tuntas'}"`,
    `"${(it.recommendation || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Analisis_Butir_Soal_Kelas_${CONFIG.KELAS}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 6b. Export Matriks Respon Siswa per Butir Soal ke Format CSV (Excel)
 * Format Matriks Siswa (Baris) x Soal 1 s.d. 20 (Kolom)
 */
export function exportStudentItemMatrixToCSV(
  summary: import('./itemAnalysis').ItemAnalysisSummary
): void {
  const students = [...summary.studentsList].sort((a, b) => {
    const numA = parseInt(a.noAbsen, 10);
    const numB = parseInt(b.noAbsen, 10);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.nama.localeCompare(b.nama);
  });

  const questionHeaders = summary.items.map(
    (it) =>
      `"S${it.questionNumber} (${it.question.type === 'pg' ? 'PG' : it.question.type === 'pgk_kategori' ? 'B/S' : 'PGK'})"`
  );

  const headers = [
    'No',
    'No Absen',
    'Nama Siswa',
    'Kelas',
    'Nilai',
    'Status',
    ...questionHeaders,
    'Total Benar',
    'Total Salah',
  ];

  const rows = students.map((s, idx) => {
    const itemCells = summary.items.map((it) => {
      const resp = it.studentResponses.find((r) => r.studentName === s.nama);
      if (!resp) return '"-"';
      const mark = resp.isCorrect ? '1' : '0';
      const shortAns = (resp.chosenOptionId || resp.answerSummary || '').replace(/"/g, '""');
      return `"${mark} [${shortAns}]"`;
    });

    return [
      idx + 1,
      `"${s.noAbsen}"`,
      `"${s.nama.replace(/"/g, '""')}"`,
      `"${s.kelas}"`,
      s.nilai,
      `"${s.status}"`,
      ...itemCells,
      s.benar,
      s.salah,
    ];
  });

  // Baris Ringkasan Analisis di Bagian Bawah
  const summaryCorrectRow = [
    '""',
    '""',
    '"JUMLAH SISWA BENAR (B)"',
    '""',
    '""',
    '""',
    ...summary.items.map((it) => it.correctCount),
    '""',
    '""',
  ];

  const summaryPercentRow = [
    '""',
    '""',
    '"PERSENTASE KETERCAPAIAN (%)"',
    '""',
    '""',
    '""',
    ...summary.items.map((it) => `"${it.correctPercentage}%"`),
    '""',
    '""',
  ];

  const summaryDiffRow = [
    '""',
    '""',
    '"TINGKAT KESUKARAN (P)"',
    '""',
    '""',
    '""',
    ...summary.items.map((it) => `"${it.difficultyCategory}"`),
    '""',
    '""',
  ];

  const summaryDiscRow = [
    '""',
    '""',
    '"DAYA PEMBEDA (D)"',
    '""',
    '""',
    '""',
    ...summary.items.map((it) => `"${it.discriminationCategory}"`),
    '""',
    '""',
  ];

  const allCsvRows = [
    headers.join(','),
    ...rows.map((e) => e.join(',')),
    '',
    summaryCorrectRow.join(','),
    summaryPercentRow.join(','),
    summaryDiffRow.join(','),
    summaryDiscRow.join(','),
  ];

  const csvContent = '\uFEFF' + allCsvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Matriks_Respon_Siswa_Tes_Sumatif_Kelas_${CONFIG.KELAS}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 7. Download Kisi-Kisi Penulisan Soal Tes Sumatif (PDF Kurikulum Merdeka)
 */
export function downloadKisiKisiPDF(summary: import('../data/kisiKisiData').KisiKisiSummary): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297
  const pageHeight = doc.internal.pageSize.getHeight(); // 210
  const marginLeft = 12;
  const marginRight = 12;
  const contentWidth = pageWidth - marginLeft - marginRight; // 273 mm
  let y = 14;

  const drawKopSurat = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
    y += 4.5;
    doc.text('DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, y, { align: 'center' });
    y += 5.5;
    doc.setFontSize(13);
    doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(CONFIG.ALAMAT_SEKOLAH, pageWidth / 2, y, { align: 'center' });
    y += 2.5;

    // Garis Pembatas Kop
    doc.setLineWidth(0.8);
    doc.line(marginLeft, y, pageWidth - marginRight, y);
    doc.setLineWidth(0.2);
    doc.line(marginLeft, y + 0.8, pageWidth - marginRight, y + 0.8);
    y += 6;
  };

  drawKopSurat();

  // --- JUDUL DOKUMEN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('KISI-KISI PENULISAN SOAL ASESMEN SUMATIF', pageWidth / 2, y, {
    align: 'center',
  });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `Mata Pelajaran: ${CONFIG.MATA_PELAJARAN} • Lingkup Materi: ${CONFIG.MATERI} • Kelas: ${CONFIG.KELAS} • Kurikulum Merdeka`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 5.5;

  // --- KOTAK METADATA KISI-KISI ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(marginLeft, y, contentWidth, 13, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(`Satuan Pendidikan: ${CONFIG.SEKOLAH}`, marginLeft + 4, y + 4.5);
  doc.text(`Mata Pelajaran: ${CONFIG.MATA_PELAJARAN}`, marginLeft + 80, y + 4.5);
  doc.text(
    `Bentuk & Jumlah: PG (${summary.distribusiBentuk.pg}), Benar/Salah (${summary.distribusiBentuk.benarSalah}), PGK (${summary.distribusiBentuk.pgk}) - Total ${summary.totalSoal} Soal`,
    marginLeft + 150,
    y + 4.5
  );

  doc.setFont('helvetica', 'normal');
  doc.text(`Alokasi Waktu: 60 Menit`, marginLeft + 4, y + 9.5);
  doc.text(`Penyusun: ${CONFIG.GURU}`, marginLeft + 80, y + 9.5);
  doc.text(
    `Kompetensi IPAS: Rangka (${summary.distribusiKompetensi.rangkaPasif || 0}), Sendi (${summary.distribusiKompetensi.sendiGerak || 0}), Otot (${summary.distribusiKompetensi.ototKesehatan || 0})`,
    marginLeft + 150,
    y + 9.5
  );

  y += 17;

  // --- DEFINISI KOLOM TABEL KISI-KISI ---
  // Total 273 mm
  const columns = [
    { header: 'No', width: 9, align: 'center' },
    { header: 'Elemen CP', width: 22, align: 'left' },
    { header: 'Capaian Pembelajaran (CP)', width: 46, align: 'left' },
    { header: 'Tujuan Pembelajaran (TP)', width: 44, align: 'left' },
    { header: 'Materi Pokok', width: 32, align: 'left' },
    { header: 'Indikator Soal', width: 56, align: 'left' },
    { header: 'Level', width: 18, align: 'center' },
    { header: 'Bentuk', width: 22, align: 'center' },
    { header: 'No', width: 10, align: 'center' },
    { header: 'Kunci', width: 14, align: 'center' },
  ];

  const drawTableHeader = () => {
    doc.setFillColor(30, 41, 59);
    doc.rect(marginLeft, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);

    let curX = marginLeft;
    columns.forEach((col) => {
      const textX = col.align === 'center' ? curX + col.width / 2 : curX + 1.5;
      doc.text(col.header, textX, y + 4.8, { align: col.align as any });
      curX += col.width;
    });
    doc.setTextColor(0, 0, 0);
    y += 7;
  };

  drawTableHeader();

  // Render Baris Kisi-Kisi Soal
  summary.items.forEach((item, index) => {
    // Estimasi tinggi baris berdasarkan teks terpanjang
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);

    const cpLines = doc.splitTextToSize(item.capaianPembelajaran, 43);
    const tpLines = doc.splitTextToSize(item.tujuanPembelajaran, 41);
    const materiLines = doc.splitTextToSize(item.materiPokok, 29);
    const indikatorLines = doc.splitTextToSize(item.indikatorSoal, 53);

    const maxLines = Math.max(cpLines.length, tpLines.length, materiLines.length, indikatorLines.length, 2);
    const lineHeight = 3.2;
    const rowHeight = Math.max(maxLines * lineHeight + 2, 8.5);

    // Cek apakah muat di halaman saat ini
    if (y + rowHeight > pageHeight - 32) {
      doc.addPage();
      y = 14;
      drawTableHeader();
    }

    // Striping baris genap/ganjil
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(marginLeft, y, contentWidth, rowHeight, 'F');
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(marginLeft, y + rowHeight, marginLeft + contentWidth, y + rowHeight);

    let curX = marginLeft;

    // No Urut
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(String(item.noSoal), curX + 4.5, y + 4.5, { align: 'center' });
    curX += 9;

    // Elemen
    doc.setFont('helvetica', 'bold');
    doc.text(item.elemen, curX + 1.5, y + 4);
    curX += 22;

    // Capaian Pembelajaran
    doc.setFont('helvetica', 'normal');
    doc.text(cpLines, curX + 1.5, y + 3.2);
    curX += 46;

    // Tujuan Pembelajaran
    doc.text(tpLines, curX + 1.5, y + 3.2);
    curX += 44;

    // Materi Pokok
    doc.setFont('helvetica', 'bold');
    doc.text(materiLines, curX + 1.5, y + 3.2);
    doc.setFont('helvetica', 'normal');
    curX += 32;

    // Indikator Soal
    doc.text(indikatorLines, curX + 1.5, y + 3.2);
    curX += 56;

    // Level Kognitif
    doc.setFont('helvetica', 'bold');
    const levelShort = item.levelKognitif.split(' ')[0]; // e.g. L1, L2, L3
    doc.text(levelShort, curX + 9, y + 4, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    const levelSub = item.levelKognitif.includes('Pemahaman')
      ? 'C1/C2'
      : item.levelKognitif.includes('Aplikasi')
      ? 'C3'
      : 'C4';
    doc.text(levelSub, curX + 9, y + 7, { align: 'center' });
    doc.setFontSize(6.5);
    curX += 18;

    // Bentuk Soal
    const bentukShort =
      item.bentukSoal === 'Pilihan Ganda'
        ? 'PG'
        : item.bentukSoal === 'Benar / Salah'
        ? 'B / S (3)'
        : 'PGK (3)';
    doc.text(bentukShort, curX + 11, y + 4.5, { align: 'center' });
    curX += 22;

    // No Soal
    doc.setFont('helvetica', 'bold');
    doc.text(String(item.noSoal), curX + 5, y + 4.5, { align: 'center' });
    curX += 10;

    // Kunci
    doc.setFont('helvetica', 'normal');
    const keyClean = item.kunciJawaban.length > 8 ? item.kunciJawaban.substring(0, 7) + '..' : item.kunciJawaban;
    doc.text(keyClean, curX + 7, y + 4.5, { align: 'center' });
    curX += 14;

    y += rowHeight;
  });

  // Tanda Tangan Resmi di halaman terakhir
  if (y + 35 > pageHeight - 12) {
    doc.addPage();
    y = 16;
  } else {
    y += 8;
  }

  const tglStr = formatIndonesianDate();
  const colLeftX = marginLeft + 18;
  const colRightX = pageWidth - marginRight - 75;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Mengetahui,', colLeftX, y);
  doc.text('Kepala Sekolah,', colLeftX, y + 4.5);

  doc.text(`Jembrana, ${tglStr}`, colRightX, y);
  doc.text('Guru Mata Pelajaran / Kelas,', colRightX, y + 4.5);

  const sigLineY = y + 19;
  doc.setFont('helvetica', 'bold');
  doc.text(CONFIG.KEPALA_SEKOLAH, colLeftX, sigLineY);
  doc.line(colLeftX, sigLineY + 1, colLeftX + 52, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`NIP. ${CONFIG.NIP_KEPALA_SEKOLAH}`, colLeftX, sigLineY + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(CONFIG.GURU, colRightX, sigLineY);
  doc.line(colRightX, sigLineY + 1, colRightX + 52, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`NIP. ${CONFIG.NIP_GURU}`, colRightX, sigLineY + 4.5);

  // Footer di setiap halaman
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Dokumen Kisi-Kisi Penulisan Soal Sumatif • ${CONFIG.SEKOLAH} • Kurikulum Merdeka Fase A`,
      marginLeft,
      pageHeight - 5
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginRight, pageHeight - 5, {
      align: 'right',
    });
  }

  doc.save(`Kisi_Kisi_Soal_${CONFIG.MATA_PELAJARAN.replace(/[^a-zA-Z0-9]/g, '_')}_Kelas_${CONFIG.KELAS.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

/**
 * 8. Export Kisi-Kisi Soal ke Format CSV (Excel)
 */
export function exportKisiKisiToCSV(summary: import('../data/kisiKisiData').KisiKisiSummary): void {
  const headers = [
    'No',
    'Elemen CP',
    'Capaian Pembelajaran (CP)',
    'Tujuan Pembelajaran (TP)',
    'Materi Pokok',
    'Indikator Soal',
    'Level Kognitif',
    'Bentuk Soal',
    'No Soal',
    'Kunci Jawaban',
    'Bobot Skor',
  ];

  const rows = summary.items.map((it) => [
    it.noSoal,
    `"${it.elemen}"`,
    `"${it.capaianPembelajaran.replace(/"/g, '""')}"`,
    `"${it.tujuanPembelajaran.replace(/"/g, '""')}"`,
    `"${it.materiPokok.replace(/"/g, '""')}"`,
    `"${it.indikatorSoal.replace(/"/g, '""')}"`,
    `"${it.levelKognitif}"`,
    `"${it.bentukSoal}"`,
    it.noSoal,
    `"${it.kunciJawaban.replace(/"/g, '""')}"`,
    it.bobotSkor,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Kisi_Kisi_Soal_Kelas_${CONFIG.KELAS}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


