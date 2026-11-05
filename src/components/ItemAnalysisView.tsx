import React, { useState, useMemo } from 'react';
import { CONFIG } from '../config';
import { Question, ExamResult } from '../types';
import {
  analyzeExamItems,
  generateSampleClassExamResults,
  ItemAnalysisSummary,
  QuestionItemAnalysis,
} from '../utils/itemAnalysis';
import {
  downloadItemAnalysisPDF,
  exportItemAnalysisToCSV,
  exportStudentItemMatrixToCSV,
} from '../utils/pdfGenerator';
import { QuestionIllustration } from './QuestionIllustration';
import { StudentResponseMatrixTable } from './StudentResponseMatrixTable';
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  FileDown,
  Sparkles,
  TrendingUp,
  Search,
  Filter,
  Edit3,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Users,
  Table,
  Eye,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

interface ItemAnalysisViewProps {
  questions: Question[];
  results: ExamResult[];
  onEditQuestion: (q: Question) => void;
  onSelectStudent?: (studentResult: ExamResult) => void;
}

export const ItemAnalysisView: React.FC<ItemAnalysisViewProps> = ({
  questions,
  results,
  onEditQuestion,
  onSelectStudent,
}) => {
  // Mode Tampilan: Telaah Per Butir Soal vs Matriks Seluruh Siswa
  const [viewMode, setViewMode] = useState<'per_butir' | 'matriks'>('per_butir');

  // Mode simulasi vs data riil
  const [useSampleData, setUseSampleData] = useState(false);
  const [sampleResults, setSampleResults] = useState<ExamResult[]>([]);

  // Filter & Search Per Butir Soal
  const [typeFilter, setTypeFilter] = useState<'all' | 'pg' | 'pgk_kategori' | 'pgk' | 'remedial'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Mudah' | 'Sedang' | 'Sukar'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null);

  // Search & Filter Respon Siswa di dalam Butir Soal Tertentu
  const [studentSearchPerItem, setStudentSearchPerItem] = useState<Record<number, string>>({});
  const [studentFilterPerItem, setStudentFilterPerItem] = useState<Record<number, 'all' | 'correct' | 'incorrect'>>({});

  // Toggle mode data simulasi jika data riil masih kosong atau sedikit
  const activeResults = useMemo(() => {
    if (useSampleData) {
      if (sampleResults.length === 0) {
        const gen = generateSampleClassExamResults(questions);
        setSampleResults(gen);
        return gen;
      }
      return sampleResults;
    }
    return results;
  }, [useSampleData, sampleResults, results, questions]);

  // Kalkulasi analisis butir soal
  const summary: ItemAnalysisSummary = useMemo(() => {
    return analyzeExamItems(questions, activeResults);
  }, [questions, activeResults]);

  // Handler Generate ulang simulasi
  const handleRegenerateSample = () => {
    const gen = generateSampleClassExamResults(questions);
    setSampleResults(gen);
    setUseSampleData(true);
  };

  // Filter item yang ditampilkan
  const filteredItems = useMemo(() => {
    return summary.items.filter((item) => {
      // Filter Type / Remedial
      if (typeFilter === 'remedial' && !item.remedialNeeded) return false;
      if (typeFilter === 'pg' && item.question.type !== 'pg') return false;
      if (typeFilter === 'pgk_kategori' && item.question.type !== 'pgk_kategori') return false;
      if (typeFilter === 'pgk' && item.question.type !== 'pgk') return false;

      // Filter Difficulty
      if (difficultyFilter !== 'all' && item.difficultyCategory !== difficultyFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = String(item.questionNumber).includes(q);
        const matchTopic = (item.question.topic || '').toLowerCase().includes(q);
        const matchText = (item.question.text || '').toLowerCase().includes(q);
        if (!matchNum && !matchTopic && !matchText) return false;
      }

      return true;
    });
  }, [summary.items, typeFilter, difficultyFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-md backdrop-blur-xs">
                Modul Pedagogis Kurikulum Merdeka
              </span>
              <span className="text-xs font-medium text-blue-300">
                Kelas {CONFIG.KELAS} SD
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <BarChart3 className="w-6 h-6 text-blue-300" />
              <span>Analisis Kualitas &amp; Daya Pembeda Butir Soal</span>
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Analisis komprehensif tingkat kesukaran ($P$), daya beda ($D$), efektivitas opsi
              pengecoh, serta identifikasi materi yang membutuhkan program pengayaan atau remedial.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Download PDF Laporan Analisis */}
            <button
              id="btn-download-item-analysis-pdf"
              onClick={() => downloadItemAnalysisPDF(summary)}
              disabled={summary.totalStudentsAnalyzed === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Unduh Laporan Analisis Butir Soal resmi (PDF Berkop)"
            >
              <FileDown className="w-4 h-4 text-rose-600" />
              <span>Cetak Laporan PDF</span>
            </button>

            {/* Export CSV / Excel */}
            <button
              id="btn-export-item-analysis-csv"
              onClick={() => exportItemAnalysisToCSV(summary)}
              disabled={summary.totalStudentsAnalyzed === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Export statistik analisis butir soal ke Microsoft Excel / CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-white" />
              <span>Export Ringkasan (CSV)</span>
            </button>

            {/* Export Matriks Respon Siswa (CSV) */}
            <button
              id="btn-export-matrix-csv"
              onClick={() => exportStudentItemMatrixToCSV(summary)}
              disabled={summary.totalStudentsAnalyzed === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Export tabel matriks lengkap seluruh siswa dan nomor soal ke Excel / CSV"
            >
              <Table className="w-4 h-4 text-white" />
              <span>Export Matriks Siswa (CSV)</span>
            </button>

            {/* Toggle Simulasi Kelas */}
            <button
              id="btn-toggle-sample-analysis"
              onClick={() => {
                if (!useSampleData) {
                  handleRegenerateSample();
                } else {
                  setUseSampleData(false);
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                useSampleData
                  ? 'bg-amber-400 text-slate-900 border-amber-300 hover:bg-amber-300 shadow-xs'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
              title="Gunakan simulasi data 24 siswa untuk melihat visualisasi analisis butir soal secara instan"
            >
              <Sparkles className={`w-4 h-4 ${useSampleData ? 'text-slate-900' : 'text-amber-300'}`} />
              <span>{useSampleData ? 'Kembalikan ke Data Riil' : 'Simulasi Kelas (24 Siswa)'}</span>
            </button>
          </div>
        </div>

        {/* Status Data Indicator */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-blue-200 gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                useSampleData ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
              }`}
            />
            <span>
              Sumber Data:{' '}
              <strong className="text-white">
                {useSampleData
                  ? 'Simulasi Kelas (24 Siswa Lengkap)'
                  : `${summary.totalStudentsAnalyzed} Siswa Tersimpan`}
              </strong>
            </span>
            {summary.totalStudentsAnalyzed === 0 && !useSampleData && (
              <span className="text-amber-300 ml-1">
                (Belum ada siswa yang submit. Klik tombol "Simulasi Kelas" untuk meninjau demo analisis).
              </span>
            )}
          </div>
          <div className="text-[11px] text-blue-200">
            Total Butir Soal: <strong className="text-white">{summary.totalQuestions} Soal</strong> •
            KKTP: <strong className="text-white">{CONFIG.KKTP}</strong>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rata-rata Ketercapaian / Daya Serap */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tingkat Kesukaran (P)
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {summary.averageDifficultyIndex.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              {summary.averageDifficultyIndex >= 0.7
                ? 'Mudah'
                : summary.averageDifficultyIndex >= 0.3
                ? 'Sedang (Ideal)'
                : 'Sukar'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Rata-rata ketercapaian seluruh siswa ({summary.difficultyCounts.mudah} Mudah,{' '}
            {summary.difficultyCounts.sedang} Sedang, {summary.difficultyCounts.sukar} Sukar)
          </p>
        </div>

        {/* Rata-rata Daya Beda (D) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Daya Pembeda (D)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-900">
              {summary.averageDiscriminationIndex.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {summary.averageDiscriminationIndex >= 0.4
                ? 'Sangat Baik'
                : summary.averageDiscriminationIndex >= 0.3
                ? 'Baik'
                : summary.averageDiscriminationIndex >= 0.2
                ? 'Cukup'
                : 'Perlu Revisi'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Kemampuan butir membedakan kelompok atas ({summary.discriminationCounts.sangatBaik}{' '}
            Sangat Baik, {summary.discriminationCounts.baik} Baik)
          </p>
        </div>

        {/* Butir Soal Perlu Remedial */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Perlu Remedial
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                summary.remedialItemNumbers.length > 0
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-black ${
                summary.remedialItemNumbers.length > 0 ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              {summary.remedialItemNumbers.length} Butir
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                summary.remedialItemNumbers.length > 0
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {summary.remedialItemNumbers.length > 0 ? 'Butuh Review' : 'Tuntas Semua'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 truncate">
            {summary.remedialItemNumbers.length > 0
              ? `Nomor Soal: ${summary.remedialItemNumbers.join(', ')}`
              : 'Seluruh materi dikuasai di atas batas minimal'}
          </p>
        </div>

        {/* Soal Kualitas Prima */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sangat Baik / Dikuasai
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-indigo-900">
              {summary.masteredItemNumbers.length} Butir
            </span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              Capai ≥ 75%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 truncate">
            {summary.masteredItemNumbers.length > 0
              ? `Nomor Soal: ${summary.masteredItemNumbers.join(', ')}`
              : 'Belum ada soal dengan ketercapaian tinggi'}
          </p>
        </div>
      </div>

      {/* Visual Ketercapaian Bar Matrix (20 Butir Soal) */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Peta Ketercapaian &amp; Tingkat Kesukaran Butir Soal 1 s.d. 20</span>
            </h4>
            <p className="text-xs text-slate-500">
              Klik pada batang nomor soal untuk langsung melompat ke rincian analisis butir tersebut.
            </p>
          </div>
          {/* Legenda */}
          <div className="flex items-center gap-3 text-[11px] font-semibold">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Mudah (≥ 70%)
            </span>
            <span className="flex items-center gap-1 text-blue-700">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              Sedang (30–69%)
            </span>
            <span className="flex items-center gap-1 text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              Sukar (&lt; 30%)
            </span>
          </div>
        </div>

        {/* Matrix Grid Bar */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2">
          {summary.items.map((item) => {
            const isSelected = expandedItemId === item.questionNumber;
            const barColor =
              item.difficultyCategory === 'Mudah'
                ? 'bg-emerald-500 hover:bg-emerald-600'
                : item.difficultyCategory === 'Sedang'
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-rose-500 hover:bg-rose-600';

            const badgeColor =
              item.difficultyCategory === 'Mudah'
                ? 'text-emerald-700 bg-emerald-50'
                : item.difficultyCategory === 'Sedang'
                ? 'text-blue-700 bg-blue-50'
                : 'text-rose-700 bg-rose-50';

            return (
              <button
                key={item.questionNumber}
                onClick={() => {
                  setExpandedItemId(isSelected ? null : item.questionNumber);
                  const el = document.getElementById(`item-card-${item.questionNumber}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1.5 ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/70'
                }`}
                title={`Soal No. ${item.questionNumber}: ${item.question.topic} (P: ${item.difficultyIndex})`}
              >
                <span className="text-xs font-black text-slate-800">
                  No. {item.questionNumber}
                </span>

                {/* Bar Grafis Mini */}
                <div className="w-full bg-slate-200 h-10 rounded-lg flex items-end overflow-hidden p-0.5">
                  <div
                    className={`w-full rounded-md transition-all ${barColor}`}
                    style={{ height: `${Math.max(15, item.correctPercentage)}%` }}
                  />
                </div>

                <div className="w-full flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-600">{item.correctPercentage}%</span>
                  <span className={`px-1 rounded-xs text-[9px] ${badgeColor}`}>
                    {item.difficultyCategory.charAt(0)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PENGALIH TAMPILAN: Analisis Per Butir Soal vs Matriks Jawaban Seluruh Siswa */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="tab-view-per-butir"
            onClick={() => setViewMode('per_butir')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'per_butir'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>1. Analisis Per Butir Soal (1 s.d. 20)</span>
          </button>

          <button
            id="tab-view-matriks-siswa"
            onClick={() => setViewMode('matriks')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'matriks'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>2. Matriks Jawaban Seluruh Siswa (Siswa × 20 Soal)</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                viewMode === 'matriks'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {summary.totalStudentsAnalyzed} Siswa
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-indigo-600" />
          <span>
            {viewMode === 'per_butir'
              ? 'Telaah mendalam statistik, kesukaran, dan respon siswa per soal'
              : 'Tabel matriks komprehensif jawaban individu setiap anak'}
          </span>
        </div>
      </div>

      {viewMode === 'matriks' ? (
        <StudentResponseMatrixTable
          summary={summary}
          onSelectStudent={onSelectStudent}
          onOpenQuestion={(qNum) => {
            setViewMode('per_butir');
            setExpandedItemId(qNum);
            setTimeout(() => {
              const el = document.getElementById(`item-card-${qNum}`);
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
          }}
        />
      ) : (
        <>
          {/* Filter Toolbar & Search */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Tabs Filter Tipe Soal */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Soal ({summary.totalQuestions})
            </button>
            <button
              onClick={() => setTypeFilter('pg')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                typeFilter === 'pg'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              1. Pilihan Ganda (10)
            </button>
            <button
              onClick={() => setTypeFilter('pgk_kategori')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                typeFilter === 'pgk_kategori'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              2. Benar / Salah (5)
            </button>
            <button
              onClick={() => setTypeFilter('pgk')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                typeFilter === 'pgk'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              3. Pilihan Kompleks (5)
            </button>
            <button
              onClick={() => setTypeFilter('remedial')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1 ${
                typeFilter === 'remedial'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Perlu Remedial ({summary.remedialItemNumbers.length})</span>
            </button>
          </div>

          {/* Filter Kesukaran & Search */}
          <div className="flex items-center gap-2">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as any)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Kesukaran</option>
              <option value="Mudah">Mudah (P ≥ 0.70)</option>
              <option value="Sedang">Sedang (0.30 - 0.69)</option>
              <option value="Sukar">Sukar (P &lt; 0.30)</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari topik / nomor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-44"
              />
            </div>
          </div>
        </div>
      </div>

      {/* List Kartu Analisis Butir Soal */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">Tidak ada butir soal yang sesuai filter.</p>
            <button
              onClick={() => {
                setTypeFilter('all');
                setDifficultyFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExpanded = expandedItemId === item.questionNumber;
            const q = item.question;

            return (
              <div
                id={`item-card-${item.questionNumber}`}
                key={item.questionNumber}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  item.remedialNeeded
                    ? 'border-rose-200 shadow-xs'
                    : isExpanded
                    ? 'border-blue-300 ring-1 ring-blue-200 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header Kartu Butir Soal */}
                <div
                  onClick={() => setExpandedItemId(isExpanded ? null : item.questionNumber)}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        item.remedialNeeded
                          ? 'bg-rose-100 text-rose-700'
                          : item.difficultyCategory === 'Mudah'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.questionNumber}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          Soal No. {item.questionNumber}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {q.type === 'pg'
                            ? 'Pilihan Ganda (3 Opsi)'
                            : q.type === 'pgk_kategori'
                            ? 'Benar / Salah (3 Argumen)'
                            : 'Pilihan Kompleks (3 Opsi)'}
                        </span>
                        {item.remedialNeeded && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Perlu Remedial
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 leading-snug">
                        {q.topic || q.text}
                      </h4>
                    </div>
                  </div>

                  {/* Ringkasan Metrik di Kanan Header */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                    {/* Tingkat Kesukaran (P) */}
                    <div className="text-right px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium">Kesukaran (P)</span>
                      <span className="text-xs font-black text-slate-900">
                        {item.difficultyIndex.toFixed(2)}{' '}
                        <span
                          className={`text-[10px] font-bold ${
                            item.difficultyCategory === 'Mudah'
                              ? 'text-emerald-600'
                              : item.difficultyCategory === 'Sedang'
                              ? 'text-blue-600'
                              : 'text-rose-600'
                          }`}
                        >
                          ({item.difficultyCategory})
                        </span>
                      </span>
                    </div>

                    {/* Daya Beda (D) */}
                    <div className="text-right px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium">Daya Beda (D)</span>
                      <span className="text-xs font-black text-slate-900">
                        {item.discriminationIndex.toFixed(2)}{' '}
                        <span
                          className={`text-[10px] font-bold ${
                            item.discriminationCategory === 'Jelek / Revisi'
                              ? 'text-rose-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          ({item.discriminationCategory})
                        </span>
                      </span>
                    </div>

                    {/* Persentase Benar */}
                    <div className="text-right px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 min-w-[75px]">
                      <span className="text-[10px] text-slate-400 block font-medium">Benar</span>
                      <span className="text-xs font-black text-emerald-700">
                        {item.correctCount} / {item.totalStudents} ({item.correctPercentage}%)
                      </span>
                    </div>

                    <div className="p-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Konten Detail saat Diperluas */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 bg-slate-50/40 space-y-6">
                    {/* Tampilan Pertanyaan & Ilustrasi Gambar */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-700">
                          Teks Soal &amp; Gambar Peraga:
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditQuestion(q);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Butir Soal</span>
                        </button>
                      </div>

                      {q.illustrationKey && (
                        <div className="max-w-xs mx-auto border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-2 shadow-xs">
                          <QuestionIllustration illustrationKey={q.illustrationKey} />
                        </div>
                      )}

                      <p className="text-sm font-semibold text-slate-800 whitespace-pre-line leading-relaxed">
                        {q.text}
                      </p>

                      <div className="text-xs text-slate-600 bg-blue-50/70 p-2.5 rounded-lg border border-blue-100">
                        <strong className="text-blue-900 block mb-0.5">Kunci Jawaban Resmi:</strong>
                        <span className="font-bold text-slate-800">
                          {q.type === 'pg' && (
                            <>
                              Opsi {q.correctAnswer} (
                              {q.options?.find((o) => o.id === q.correctAnswer)?.text || ''})
                            </>
                          )}
                          {q.type === 'pgk_kategori' && (
                            <>
                              P1:{' '}
                              {q.statements?.[0]?.correctAnswer ? 'BENAR' : 'SALAH'} • P2:{' '}
                              {q.statements?.[1]?.correctAnswer ? 'BENAR' : 'SALAH'} • P3:{' '}
                              {q.statements?.[2]?.correctAnswer ? 'BENAR' : 'SALAH'}
                            </>
                          )}
                          {q.type === 'pgk' && (
                            <>
                              Centang Opsi:{' '}
                              {Array.isArray(q.correctAnswer)
                                ? q.correctAnswer.join(', ')
                                : q.correctAnswer}
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* TABEL DISTRIBUSI OPSI & EFEKTIVITAS PENGECOH (Khusus PG 3 Opsi) */}
                    {q.type === 'pg' && item.optionDistributions.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Distribusi Pilihan Siswa &amp; Efektivitas Pengecoh (Distraktor)</span>
                          </h5>
                          <span className="text-[11px] text-slate-400">
                            Pengecoh efektif bila dipilih ≥ 5% siswa
                          </span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                              <tr>
                                <th className="p-3 w-14 text-center">Opsi</th>
                                <th className="p-3">Teks Pilihan Jawaban</th>
                                <th className="p-3 w-28 text-center">Pemilih (n)</th>
                                <th className="p-3 w-24 text-center">Persentase</th>
                                <th className="p-3 w-40 text-center">Grafik Pilihan</th>
                                <th className="p-3 w-36 text-center">Status Fungsi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {item.optionDistributions.map((opt) => {
                                return (
                                  <tr
                                    key={opt.id}
                                    className={
                                      opt.isCorrect
                                        ? 'bg-emerald-50/60 font-semibold'
                                        : 'hover:bg-slate-50'
                                    }
                                  >
                                    <td className="p-3 text-center">
                                      <span
                                        className={`inline-block w-6 h-6 rounded-full font-bold leading-6 ${
                                          opt.isCorrect
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-200 text-slate-700'
                                        }`}
                                      >
                                        {opt.id}
                                      </span>
                                    </td>
                                    <td className="p-3 text-slate-800">
                                      <div className="flex items-center gap-2">
                                        <span>{opt.text}</span>
                                        {opt.isCorrect && (
                                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                                            KUNCI
                                          </span>
                                        )}
                                      </div>

                                      {/* Nama-nama siswa yang memilih opsi ini */}
                                      {opt.studentNames && opt.studentNames.length > 0 && (
                                        <div className="mt-1.5 flex flex-wrap items-center gap-1">
                                          <span className="text-[10px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                                            <Users className="w-3 h-3 text-slate-400" />
                                            <span>Pemilih ({opt.studentNames.length}):</span>
                                          </span>
                                          {opt.studentNames.map((name) => {
                                            const studentObj = summary.studentsList.find(
                                              (s) => s.nama === name
                                            );
                                            return (
                                              <button
                                                key={name}
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (studentObj && onSelectStudent) {
                                                    onSelectStudent(studentObj);
                                                  }
                                                }}
                                                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-100 hover:text-indigo-800 text-slate-700 transition-colors cursor-pointer"
                                                title={`Klik untuk lihat lembar jawaban ${name}`}
                                              >
                                                {name}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </td>
                                    <td className="p-3 text-center font-bold text-slate-900">
                                      {opt.count} Siswa
                                    </td>
                                    <td className="p-3 text-center font-bold">
                                      {opt.percentage}%
                                    </td>
                                    <td className="p-3">
                                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full rounded-full transition-all ${
                                            opt.isCorrect ? 'bg-emerald-500' : 'bg-slate-400'
                                          }`}
                                          style={{ width: `${opt.percentage}%` }}
                                        />
                                      </div>
                                    </td>
                                    <td className="p-3 text-center">
                                      {opt.isCorrect ? (
                                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                          Kunci Jawaban
                                        </span>
                                      ) : opt.isEffectiveDistractor ? (
                                        <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                                          Pengecoh Berfungsi
                                        </span>
                                      ) : (
                                        <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                          Pengecoh Kurang Efektif
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* TABEL RINCIAN PERNYATAAN (Khusus Benar/Salah 3 Argumen) */}
                    {q.type === 'pgk_kategori' && item.statementAnalysis && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Analisis Ketepatan Siswa pada 3 Pernyataan Benar / Salah</span>
                        </h5>

                        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                              <tr>
                                <th className="p-3 w-12 text-center">No</th>
                                <th className="p-3">Kalimat Pernyataan</th>
                                <th className="p-3 w-28 text-center">Kunci</th>
                                <th className="p-3 w-28 text-center">Pilih Benar</th>
                                <th className="p-3 w-28 text-center">Pilih Salah</th>
                                <th className="p-3 w-28 text-center">Akurasi Siswa</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {item.statementAnalysis.map((st, sIdx) => {
                                return (
                                  <tr key={st.id} className="hover:bg-slate-50">
                                    <td className="p-3 text-center font-bold text-slate-600">
                                      P{sIdx + 1}
                                    </td>
                                    <td className="p-3 font-medium text-slate-800">{st.text}</td>
                                    <td className="p-3 text-center font-bold">
                                      <span
                                        className={`px-2 py-0.5 rounded-full text-[11px] ${
                                          st.correctAnswer
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-rose-100 text-rose-800'
                                        }`}
                                      >
                                        {st.correctAnswer ? 'BENAR' : 'SALAH'}
                                      </span>
                                    </td>
                                    <td className="p-3 text-center font-semibold text-slate-700">
                                      <div>{st.trueChosenCount} Siswa</div>
                                      {st.trueStudentNames && st.trueStudentNames.length > 0 && (
                                        <div className="mt-1 flex flex-wrap justify-center gap-1 max-w-xs mx-auto">
                                          {st.trueStudentNames.map((name) => {
                                            const studentObj = summary.studentsList.find(
                                              (s) => s.nama === name
                                            );
                                            return (
                                              <button
                                                key={name}
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (studentObj && onSelectStudent) {
                                                    onSelectStudent(studentObj);
                                                  }
                                                }}
                                                className="text-[9px] font-medium px-1.5 py-0.5 rounded-xs bg-emerald-50 text-emerald-800 hover:bg-emerald-100 cursor-pointer"
                                                title={`Lihat lembar jawaban ${name}`}
                                              >
                                                {name}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </td>
                                    <td className="p-3 text-center font-semibold text-slate-700">
                                      <div>{st.falseChosenCount} Siswa</div>
                                      {st.falseStudentNames && st.falseStudentNames.length > 0 && (
                                        <div className="mt-1 flex flex-wrap justify-center gap-1 max-w-xs mx-auto">
                                          {st.falseStudentNames.map((name) => {
                                            const studentObj = summary.studentsList.find(
                                              (s) => s.nama === name
                                            );
                                            return (
                                              <button
                                                key={name}
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (studentObj && onSelectStudent) {
                                                    onSelectStudent(studentObj);
                                                  }
                                                }}
                                                className="text-[9px] font-medium px-1.5 py-0.5 rounded-xs bg-rose-50 text-rose-800 hover:bg-rose-100 cursor-pointer"
                                                title={`Lihat lembar jawaban ${name}`}
                                              >
                                                {name}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </td>
                                    <td className="p-3 text-center font-bold">
                                      <span
                                        className={`px-2 py-0.5 rounded-md ${
                                          st.percentage >= 70
                                            ? 'text-emerald-700 bg-emerald-50'
                                            : st.percentage >= 40
                                            ? 'text-blue-700 bg-blue-50'
                                            : 'text-rose-700 bg-rose-50'
                                        }`}
                                      >
                                        {st.percentage}% Tepat
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* TABEL DISTRIBUSI CENTANG PGK KOMPLEKS */}
                    {q.type === 'pgk' && item.optionDistributions.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Distribusi Centang Opsi Pilihan Ganda Kompleks</span>
                        </h5>

                        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                              <tr>
                                <th className="p-3 w-14 text-center">Opsi</th>
                                <th className="p-3">Teks Pernyataan Centang</th>
                                <th className="p-3 w-32 text-center">Kunci Jawaban</th>
                                <th className="p-3 w-32 text-center">Siswa Mencengtang</th>
                                <th className="p-3 w-28 text-center">Persentase</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {item.optionDistributions.map((opt) => (
                                <tr
                                  key={opt.id}
                                  className={opt.isCorrect ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}
                                >
                                  <td className="p-3 text-center font-bold text-slate-700">
                                    {opt.id}
                                  </td>
                                  <td className="p-3 text-slate-800 font-medium">
                                    <div>{opt.text}</div>
                                    {/* Siswa yang mencentang opsi ini */}
                                    {opt.studentNames && opt.studentNames.length > 0 && (
                                      <div className="mt-1.5 flex flex-wrap items-center gap-1">
                                        <span className="text-[10px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                                          <Users className="w-3 h-3 text-slate-400" />
                                          <span>Mencentang ({opt.studentNames.length}):</span>
                                        </span>
                                        {opt.studentNames.map((name) => {
                                          const studentObj = summary.studentsList.find(
                                            (s) => s.nama === name
                                          );
                                          return (
                                            <button
                                              key={name}
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (studentObj && onSelectStudent) {
                                                  onSelectStudent(studentObj);
                                                }
                                              }}
                                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-100 hover:text-indigo-800 text-slate-700 transition-colors cursor-pointer"
                                              title={`Klik untuk lihat lembar jawaban ${name}`}
                                            >
                                              {name}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </td>
                                  <td className="p-3 text-center">
                                    {opt.isCorrect ? (
                                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                                        Wajib Dicentang
                                      </span>
                                    ) : (
                                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                        Pernyataan Salah
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-3 text-center font-bold text-slate-900">
                                    {opt.count} Siswa
                                  </td>
                                  <td className="p-3 text-center font-bold">{opt.percentage}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* TABEL DAFTAR JAWABAN SISWA / RESPON INDIVIDU PADA BUTIR SOAL INI */}
                    {(() => {
                      const filter = studentFilterPerItem[item.questionNumber] || 'all';
                      const query = (studentSearchPerItem[item.questionNumber] || '').toLowerCase().trim();

                      const displayedStudents = (item.studentResponses || []).filter((resp) => {
                        if (filter === 'correct' && !resp.isCorrect) return false;
                        if (filter === 'incorrect' && resp.isCorrect) return false;
                        if (query && !resp.studentName.toLowerCase().includes(query)) return false;
                        return true;
                      });

                      return (
                        <div className="space-y-3 pt-3 border-t border-slate-200">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div>
                              <h5 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-indigo-600" />
                                <span>Daftar Jawaban Siswa / Respon Individu (Soal No. {item.questionNumber})</span>
                              </h5>
                              <p className="text-[11px] text-slate-500">
                                Periksa pilihan jawaban yang dipilih oleh masing-masing siswa untuk butir soal ini.
                              </p>
                            </div>

                            {/* Filter & Search Siswa per Soal */}
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="flex items-center gap-1 text-[11px] font-bold">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setStudentFilterPerItem((prev) => ({
                                      ...prev,
                                      [item.questionNumber]: 'all',
                                    }))
                                  }
                                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                                    filter === 'all'
                                      ? 'bg-indigo-600 text-white shadow-xs'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  Semua ({item.studentResponses?.length || 0})
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setStudentFilterPerItem((prev) => ({
                                      ...prev,
                                      [item.questionNumber]: 'correct',
                                    }))
                                  }
                                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                                    filter === 'correct'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                  }`}
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Benar ({item.correctCount})</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setStudentFilterPerItem((prev) => ({
                                      ...prev,
                                      [item.questionNumber]: 'incorrect',
                                    }))
                                  }
                                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                                    filter === 'incorrect'
                                      ? 'bg-rose-600 text-white shadow-xs'
                                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                                  }`}
                                >
                                  <X className="w-3 h-3" />
                                  <span>Salah ({item.incorrectCount})</span>
                                </button>
                              </div>

                              <div className="relative">
                                <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                <input
                                  type="text"
                                  placeholder="Cari siswa..."
                                  value={studentSearchPerItem[item.questionNumber] || ''}
                                  onChange={(e) =>
                                    setStudentSearchPerItem((prev) => ({
                                      ...prev,
                                      [item.questionNumber]: e.target.value,
                                    }))
                                  }
                                  className="text-[11px] pl-7 pr-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-36"
                                />
                              </div>
                            </div>
                          </div>

                          {displayedStudents.length === 0 ? (
                            <div className="p-4 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                              Tidak ada siswa yang sesuai dengan filter pencarian.
                            </div>
                          ) : (
                            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white max-h-80">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0 z-10">
                                  <tr>
                                    <th className="p-2.5 w-12 text-center">Abs</th>
                                    <th className="p-2.5">Nama Siswa</th>
                                    <th className="p-2.5">Jawaban Siswa</th>
                                    <th className="p-2.5 w-28 text-center">Status</th>
                                    <th className="p-2.5 w-20 text-center">Skor</th>
                                    <th className="p-2.5 w-20 text-center">Nilai Ujian</th>
                                    <th className="p-2.5 w-28 text-center">Aksi</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {displayedStudents.map((resp) => {
                                    const studentObj = summary.studentsList.find(
                                      (s) => s.nama === resp.studentName
                                    );
                                    return (
                                      <tr
                                        key={resp.studentName}
                                        className={`hover:bg-slate-50 transition-colors ${
                                          resp.isCorrect ? 'bg-emerald-50/20' : 'bg-rose-50/20'
                                        }`}
                                      >
                                        <td className="p-2.5 text-center font-bold text-slate-600">
                                          {resp.noAbsen}
                                        </td>
                                        <td className="p-2.5">
                                          <span className="font-bold text-slate-800">{resp.studentName}</span>
                                          <span className="ml-1.5 text-[10px] text-slate-400 font-medium">
                                            ({resp.kelas})
                                          </span>
                                        </td>
                                        <td className="p-2.5">
                                          <span
                                            className={`inline-block px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                                              resp.isCorrect
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-rose-100 text-rose-800'
                                            }`}
                                          >
                                            {resp.answerSummary || '-'}
                                          </span>
                                        </td>
                                        <td className="p-2.5 text-center">
                                          <span
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                              resp.isCorrect
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-rose-100 text-rose-800'
                                            }`}
                                          >
                                            {resp.isCorrect ? (
                                              <>
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span>Benar</span>
                                              </>
                                            ) : (
                                              <>
                                                <XCircle className="w-3 h-3" />
                                                <span>Salah</span>
                                              </>
                                            )}
                                          </span>
                                        </td>
                                        <td className="p-2.5 text-center font-bold text-slate-700">
                                          {resp.score} pt
                                        </td>
                                        <td className="p-2.5 text-center font-black">
                                          <span
                                            className={
                                              resp.nilai >= 75
                                                ? 'text-emerald-700'
                                                : resp.nilai >= 60
                                                ? 'text-amber-700'
                                                : 'text-rose-700'
                                            }
                                          >
                                            {resp.nilai}
                                          </span>
                                        </td>
                                        <td className="p-2.5 text-center">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (studentObj && onSelectStudent) {
                                                onSelectStudent(studentObj);
                                              }
                                            }}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                                            title={`Buka lembar pengerjaan ${resp.studentName}`}
                                          >
                                            <Eye className="w-3 h-3" />
                                            <span>Lihat Hasil</span>
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* KOTAK REKOMENDASI PEDAGOGIS & TINDAK LANJUT GURU */}
                    <div
                      className={`p-4 rounded-xl border space-y-1.5 ${
                        item.remedialNeeded
                          ? 'bg-rose-50/70 border-rose-200'
                          : item.discriminationCategory === 'Jelek / Revisi'
                          ? 'bg-amber-50/70 border-amber-200'
                          : 'bg-emerald-50/70 border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {item.remedialNeeded ? (
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        <h6
                          className={`text-xs font-black uppercase tracking-wider ${
                            item.remedialNeeded
                              ? 'text-rose-900'
                              : item.discriminationCategory === 'Jelek / Revisi'
                              ? 'text-amber-900'
                              : 'text-emerald-900'
                          }`}
                        >
                          Rekomendasi Tindak Lanjut Guru (Kurikulum Merdeka):
                        </h6>
                      </div>
                      <p
                        className={`text-xs leading-relaxed font-medium ${
                          item.remedialNeeded
                            ? 'text-rose-800'
                            : item.discriminationCategory === 'Jelek / Revisi'
                            ? 'text-amber-800'
                            : 'text-emerald-800'
                        }`}
                      >
                        {item.recommendation}
                      </p>
                      <div className="pt-2 text-[11px] text-slate-500 flex flex-wrap gap-4 border-t border-slate-200/50">
                        <span>
                          Kelompok Atas Benar: <strong>{item.upperGroupCorrect} siswa</strong>
                        </span>
                        <span>
                          Kelompok Bawah Benar: <strong>{item.lowerGroupCorrect} siswa</strong>
                        </span>
                        <span>
                          Ukuran Kelompok ($n$): <strong>{item.groupSize} siswa</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
        </>
      )}
    </div>
  );
};
