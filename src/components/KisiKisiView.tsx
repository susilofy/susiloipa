import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Search,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Eye,
  X,
  Layers,
  Sparkles,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { Question } from '../types';
import { CONFIG } from '../config';
import {
  buildKisiKisiItems,
  KisiKisiItem,
  KompetensiBahasaIndonesia,
  LevelKognitif,
} from '../data/kisiKisiData';
import { downloadKisiKisiPDF, exportKisiKisiToCSV } from '../utils/pdfGenerator';
import { QuestionIllustration } from './QuestionIllustration';

interface KisiKisiViewProps {
  questions: Question[];
  onOpenQuestionDetail?: (q: Question) => void;
}

export const KisiKisiView: React.FC<KisiKisiViewProps> = ({
  questions,
  onOpenQuestionDetail,
}) => {
  const summary = useMemo(() => buildKisiKisiItems(questions), [questions]);

  // State Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElemen, setSelectedElemen] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedBentuk, setSelectedBentuk] = useState<string>('all');
  const [activePreviewItem, setActivePreviewItem] = useState<KisiKisiItem | null>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    return summary.items.filter((item) => {
      // Filter elemen
      if (selectedElemen !== 'all' && item.elemen !== selectedElemen) return false;
      // Filter level
      if (selectedLevel !== 'all' && !item.levelKognitif.startsWith(selectedLevel)) return false;
      // Filter bentuk
      if (selectedBentuk !== 'all' && item.bentukSoal !== selectedBentuk) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNo = String(item.noSoal) === q;
        const matchElemen = item.elemen.toLowerCase().includes(q);
        const matchMateri = item.materiPokok.toLowerCase().includes(q);
        const matchIndikator = item.indikatorSoal.toLowerCase().includes(q);
        const matchTP = item.tujuanPembelajaran.toLowerCase().includes(q);
        return matchNo || matchElemen || matchMateri || matchIndikator || matchTP;
      }
      return true;
    });
  }, [summary.items, selectedElemen, selectedLevel, selectedBentuk, searchQuery]);

  const previewQuestion = useMemo(() => {
    if (!activePreviewItem) return null;
    return questions.find((q, idx) => idx + 1 === activePreviewItem.noSoal) || null;
  }, [activePreviewItem, questions]);

  return (
    <div className="space-y-6">
      {/* HEADER BANNER KISI-KISI SOAL */}
      <div className="bg-gradient-to-r from-sky-800 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/20 text-sky-200 border border-sky-400/30 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>Kurikulum Merdeka • Asesmen Sumatif {CONFIG.MATA_PELAJARAN}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <FileText className="w-7 h-7 text-sky-400" />
              <span>Kisi-Kisi Penulisan Soal Asesmen Sumatif</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Matriks pemetaan Kompetensi, Subkompetensi, Capaian Pembelajaran (CP), Indikator Soal, Level Kognitif,
              dan Kunci Jawaban instrumen asesmen {CONFIG.MATA_PELAJARAN} {CONFIG.SEKOLAH}.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="btn-download-kisi-kisi-pdf"
              onClick={() => downloadKisiKisiPDF(summary)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-md transition-all text-xs sm:text-sm cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Cetak / Unduh PDF</span>
            </button>
            <button
              id="btn-export-kisi-kisi-csv"
              onClick={() => exportKisiKisiToCSV(summary)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all text-xs sm:text-sm cursor-pointer active:scale-95"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Export CSV (Excel)</span>
            </button>
          </div>
        </div>

        {/* METRICS / STATISTIK DISTRIBUSI */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60">
          <div className="bg-slate-800/60 backdrop-blur-sm p-3 rounded-xl border border-slate-700/50">
            <div className="text-[11px] font-semibold text-sky-300 uppercase tracking-wider">Total Instrumen</div>
            <div className="text-2xl font-black text-white mt-0.5">{summary.totalSoal} Butir</div>
            <div className="text-[11px] text-slate-400 mt-1">100% Sesuai Kisi-kisi</div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm p-3 rounded-xl border border-slate-700/50">
            <div className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">Bentuk Soal</div>
            <div className="text-xs font-bold text-slate-200 mt-1 space-y-0.5">
              <div>• PG (18): <span className="text-white">{summary.distribusiBentuk.pg} Soal</span></div>
              <div>• Benar/Salah (9): <span className="text-white">{summary.distribusiBentuk.benarSalah} Soal</span></div>
              <div>• PGK (3): <span className="text-white">{summary.distribusiBentuk.pgk} Soal</span></div>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm p-3 rounded-xl border border-slate-700/50">
            <div className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">Tingkat Kesukaran</div>
            <div className="text-xs font-bold text-slate-200 mt-1 space-y-0.5">
              <div>• Mudah: <span className="text-white">{summary.distribusiKesukaran.mudah} Soal</span></div>
              <div>• Cukup (Sedang): <span className="text-white">{summary.distribusiKesukaran.sedang} Soal</span></div>
              <div>• Sulit (Sukar): <span className="text-white">{summary.distribusiKesukaran.sukar} Soal</span></div>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm p-3 rounded-xl border border-slate-700/50">
            <div className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">Kompetensi IPAS</div>
            <div className="text-xs font-bold text-slate-200 mt-1 space-y-0.5">
              <div>• Rangka: <span className="text-white">{summary.distribusiKompetensi.rangkaPasif} Soal</span></div>
              <div>• Sendi: <span className="text-white">{summary.distribusiKompetensi.sendiGerak} Soal</span></div>
              <div>• Otot: <span className="text-white">{summary.distribusiKompetensi.ototKesehatan} Soal</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & PENCARIAN */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari indikator soal, materi, subkompetensi, atau nomor soal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Filter Kompetensi */}
          <select
            value={selectedElemen}
            onChange={(e) => setSelectedElemen(e.target.value)}
            aria-label="Filter Kompetensi Bahasa Indonesia"
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">Semua Kompetensi ({summary.totalSoal})</option>
            <option value="Pemahaman Tekstual">Pemahaman Tekstual ({summary.distribusiKompetensi.pemahamanTekstual})</option>
            <option value="Pemahaman Inferensial">Pemahaman Inferensial ({summary.distribusiKompetensi.pemahamanInferensial})</option>
            <option value="Evaluasi dan Apresiasi">Evaluasi dan Apresiasi ({summary.distribusiKompetensi.evaluasiDanApresiasi})</option>
          </select>

          {/* Filter Level Kognitif */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            aria-label="Filter Level Kognitif"
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">Semua Level ({summary.totalSoal})</option>
            <option value="L1">L1 - Pemahaman ({summary.distribusiLevel.l1})</option>
            <option value="L2">L2 - Aplikasi ({summary.distribusiLevel.l2})</option>
            <option value="L3">L3 - Penalaran ({summary.distribusiLevel.l3})</option>
          </select>

          {/* Filter Bentuk Soal */}
          <select
            value={selectedBentuk}
            onChange={(e) => setSelectedBentuk(e.target.value)}
            aria-label="Filter Bentuk Soal"
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">Semua Bentuk ({summary.totalSoal})</option>
            <option value="Pilihan Ganda">Pilihan Ganda ({summary.distribusiBentuk.pg})</option>
            <option value="Benar / Salah">Benar / Salah ({summary.distribusiBentuk.benarSalah})</option>
            <option value="Pilihan Ganda Kompleks">PGK ({summary.distribusiBentuk.pgk})</option>
          </select>
        </div>
      </div>

      {/* TABEL KISI-KISI SOAL */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-bold tracking-wider text-[11px] uppercase">
                <th className="py-3 px-3 w-12 text-center border-r border-slate-800">No</th>
                <th className="py-3 px-3 w-28 border-r border-slate-800">Elemen CP</th>
                <th className="py-3 px-3 min-w-[180px] border-r border-slate-800">Capaian Pembelajaran (CP)</th>
                <th className="py-3 px-3 min-w-[180px] border-r border-slate-800">Tujuan Pembelajaran (TP)</th>
                <th className="py-3 px-3 min-w-[150px] border-r border-slate-800">Materi Pokok</th>
                <th className="py-3 px-3 min-w-[220px] border-r border-slate-800">Indikator Soal</th>
                <th className="py-3 px-3 w-28 text-center border-r border-slate-800">Level Kognitif</th>
                <th className="py-3 px-3 w-28 text-center border-r border-slate-800">Bentuk Soal</th>
                <th className="py-3 px-3 w-28 text-center border-r border-slate-800">Kunci Jawaban</th>
                <th className="py-3 px-3 w-16 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Tidak ada butir soal yang sesuai filter</p>
                    <p className="text-xs text-slate-400 mt-0.5">Coba sesuaikan kata kunci pencarian atau reset filter.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  // Badge style untuk kompetensi
                  const elemenBadgeColor =
                    item.elemen === 'Pemahaman Tekstual' || item.kompetensi === 'Pemahaman Tekstual'
                      ? 'bg-sky-50 text-sky-700 border-sky-200'
                      : item.elemen === 'Pemahaman Inferensial' || item.kompetensi === 'Pemahaman Inferensial'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200';

                  // Badge style untuk level
                  const levelBadgeColor = item.levelKognitif.startsWith('L1')
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : item.levelKognitif.startsWith('L2')
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300';

                  // Badge style untuk bentuk
                  const bentukBadgeColor =
                    item.bentukSoal === 'Pilihan Ganda'
                      ? 'bg-slate-100 text-slate-700 border-slate-300'
                      : item.bentukSoal === 'Benar / Salah'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-teal-50 text-teal-700 border-teal-200';

                  return (
                    <tr
                      key={item.noSoal}
                      className={`hover:bg-sky-50/50 transition-colors ${
                        idx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                      }`}
                    >
                      {/* No Soal */}
                      <td className="py-3 px-3 text-center font-bold text-slate-900 border-r border-slate-100">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-800 text-xs font-black">
                          {item.noSoal}
                        </span>
                      </td>

                      {/* Elemen */}
                      <td className="py-3 px-3 border-r border-slate-100 align-top">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${elemenBadgeColor}`}
                        >
                          {item.elemen}
                        </span>
                      </td>

                      {/* Capaian Pembelajaran */}
                      <td className="py-3 px-3 border-r border-slate-100 text-[11px] leading-relaxed text-slate-600 align-top">
                        {item.capaianPembelajaran}
                      </td>

                      {/* Tujuan Pembelajaran */}
                      <td className="py-3 px-3 border-r border-slate-100 text-[11px] leading-relaxed text-slate-800 font-medium align-top">
                        {item.tujuanPembelajaran}
                      </td>

                      {/* Materi Pokok */}
                      <td className="py-3 px-3 border-r border-slate-100 font-semibold text-slate-900 text-xs align-top">
                        {item.materiPokok}
                      </td>

                      {/* Indikator Soal */}
                      <td className="py-3 px-3 border-r border-slate-100 text-[11px] leading-relaxed text-slate-700 align-top">
                        {item.indikatorSoal}
                      </td>

                      {/* Level Kognitif */}
                      <td className="py-3 px-3 text-center border-r border-slate-100 align-top">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold border ${levelBadgeColor}`}
                        >
                          {item.levelKognitif}
                        </span>
                      </td>

                      {/* Bentuk Soal */}
                      <td className="py-3 px-3 text-center border-r border-slate-100 align-top">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-medium border ${bentukBadgeColor}`}
                        >
                          {item.bentukSoal}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">Skor: {item.bobotSkor}</div>
                      </td>

                      {/* Kunci Jawaban */}
                      <td className="py-3 px-3 text-center border-r border-slate-100 align-top">
                        <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-800 font-bold rounded border border-emerald-200 text-xs font-mono">
                          {item.kunciJawaban}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3 px-3 text-center align-top">
                        <button
                          id={`btn-preview-kisi-kisi-${item.noSoal}`}
                          onClick={() => setActivePreviewItem(item)}
                          title="Lihat stimulus dan butir soal asli"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-sky-100 hover:text-sky-700 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            Menampilkan <span className="font-bold text-slate-800">{filteredItems.length}</span> dari{' '}
            <span className="font-bold text-slate-800">{summary.totalSoal}</span> butir kisi-kisi soal
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>
              Satuan Pendidikan: <strong className="text-slate-700">{CONFIG.SEKOLAH}</strong>
            </span>
            <span>
              Guru Pengampu: <strong className="text-slate-700">{CONFIG.GURU}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* MODAL PREVIEW STIMULUS & BUTIR SOAL */}
      {activePreviewItem && previewQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-sky-950 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-sky-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  {activePreviewItem.noSoal}
                </span>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span>Stimulus Butir Soal #{activePreviewItem.noSoal}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-400/30">
                      {activePreviewItem.bentukSoal}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Elemen: {activePreviewItem.elemen} • Level: {activePreviewItem.levelKognitif}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePreviewItem(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Indikator & TP Info Card */}
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 space-y-2 text-xs">
                <div>
                  <span className="font-bold text-sky-900">Tujuan Pembelajaran (TP): </span>
                  <span className="text-sky-800">{activePreviewItem.tujuanPembelajaran}</span>
                </div>
                <div>
                  <span className="font-bold text-sky-900">Indikator Soal: </span>
                  <span className="text-sky-800">{activePreviewItem.indikatorSoal}</span>
                </div>
              </div>

              {/* Visual Gambar Ilustrasi Stimulus */}
              {previewQuestion.illustrationKey && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center">
                  <div className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                    Ilustrasi Grafis Stimulus Visual
                  </div>
                  <div className="max-w-xs w-full">
                    <QuestionIllustration illustrationKey={previewQuestion.illustrationKey} />
                  </div>
                </div>
              )}

              {/* Bunyi Teks Soal */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teks Soal:</div>
                <div className="bg-slate-100/70 border border-slate-200 p-3.5 rounded-xl font-medium text-slate-800 text-sm whitespace-pre-line leading-relaxed">
                  {previewQuestion.text}
                </div>
              </div>

              {/* Opsi Jawaban / Pernyataan */}
              {previewQuestion.type === 'pg' && previewQuestion.options && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Opsi Pilihan:</div>
                  <div className="space-y-1.5">
                    {previewQuestion.options.map((opt) => {
                      const isCorrect = opt.id === previewQuestion.correctAnswer;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-lg border text-xs flex items-center gap-2.5 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span>{opt.text}</span>
                          {isCorrect && (
                            <span className="ml-auto text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              Kunci Jawaban
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {previewQuestion.type === 'pgk_kategori' && previewQuestion.statements && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Pernyataan Benar / Salah (3 Argumen):
                  </div>
                  <div className="space-y-1.5">
                    {previewQuestion.statements.map((st, sIdx) => (
                      <div
                        key={st.id}
                        className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs flex items-center justify-between gap-3"
                      >
                        <span className="text-slate-800 font-medium">
                          P{sIdx + 1}. {st.text}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded text-xs font-black shrink-0 ${
                            st.correctAnswer
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {st.correctAnswer ? 'BENAR' : 'SALAH'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewQuestion.type === 'pgk' && previewQuestion.options && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Pernyataan Centang (PGK):
                  </div>
                  <div className="space-y-1.5">
                    {previewQuestion.options.map((opt) => {
                      const arr = Array.isArray(previewQuestion.correctAnswer)
                        ? previewQuestion.correctAnswer
                        : [previewQuestion.correctAnswer];
                      const isCorrect = arr.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-lg border text-xs flex items-center gap-2.5 ${
                            isCorrect
                              ? 'bg-teal-50 border-teal-300 font-bold text-teal-900'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isCorrect ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span>{opt.text}</span>
                          {isCorrect && (
                            <span className="ml-auto text-[11px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                              Harus Dicentang
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pembahasan Guru */}
              {previewQuestion.explanation && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <span>Pembahasan & Rubrik Penskoran:</span>
                  </div>
                  <p className="whitespace-pre-line leading-relaxed text-amber-800 font-medium">
                    {previewQuestion.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              {onOpenQuestionDetail ? (
                <button
                  onClick={() => {
                    const q = previewQuestion;
                    setActivePreviewItem(null);
                    onOpenQuestionDetail(q);
                  }}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Edit di Bank Soal
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={() => setActivePreviewItem(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
