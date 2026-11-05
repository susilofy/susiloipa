import React, { useState, useMemo } from 'react';
import { CONFIG } from '../config';
import { ExamResult, Question } from '../types';
import { ItemAnalysisSummary, StudentItemResponse } from '../utils/itemAnalysis';
import { exportStudentItemMatrixToCSV } from '../utils/pdfGenerator';
import { QuestionIllustration } from './QuestionIllustration';
import {
  Table,
  Search,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Users,
  Eye,
  X,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';

interface StudentResponseMatrixTableProps {
  summary: ItemAnalysisSummary;
  onSelectStudent?: (studentResult: ExamResult) => void;
  onOpenQuestion?: (questionNumber: number) => void;
}

export const StudentResponseMatrixTable: React.FC<StudentResponseMatrixTableProps> = ({
  summary,
  onSelectStudent,
  onOpenQuestion,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Lulus' | 'Belum Lulus'>('all');
  const [activeCellModal, setActiveCellModal] = useState<{
    student: ExamResult;
    question: Question;
    response: StudentItemResponse;
    qNumber: number;
  } | null>(null);

  // Daftar siswa yang diurutkan rapi berdasarkan nomor absen atau nama
  const sortedStudents = useMemo(() => {
    const list = [...summary.studentsList];
    return list.sort((a, b) => {
      const numA = parseInt(a.noAbsen, 10);
      const numB = parseInt(b.noAbsen, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.nama.localeCompare(b.nama);
    });
  }, [summary.studentsList]);

  // Filter siswa berdasarkan pencarian & kelulusan
  const filteredStudents = useMemo(() => {
    return sortedStudents.filter((st) => {
      // Filter status
      if (statusFilter !== 'all' && st.status !== statusFilter) return false;

      // Filter search nama / no absen
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = st.nama.toLowerCase().includes(q);
        const matchAbsen = st.noAbsen.toLowerCase().includes(q);
        if (!matchName && !matchAbsen) return false;
      }

      return true;
    });
  }, [sortedStudents, statusFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Top Header & Filter Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                Matriks Respon Individu
              </span>
              <span className="text-xs text-slate-500">
                {summary.totalStudentsAnalyzed} Siswa • {summary.totalQuestions} Soal
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Table className="w-5 h-5 text-indigo-600" />
              <span>Tabel Matriks Jawaban Siswa per Butir Soal (1 s.d. {summary.totalQuestions})</span>
            </h4>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Memudahkan guru memeriksa jawaban individual setiap anak pada masing-masing nomor soal.
              Klik nama siswa untuk melihat lembar jawaban lengkap atau klik sel untuk melihat rincian jawaban.
            </p>
          </div>

          {/* Export Matrix Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-export-matrix-csv"
              onClick={() => exportStudentItemMatrixToCSV(summary)}
              disabled={summary.totalStudentsAnalyzed === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Unduh tabel matriks siswa x soal ke file Excel / CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-white" />
              <span>Export Matriks ke Excel (CSV)</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-100 gap-2">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Siswa ({sortedStudents.length})
            </button>
            <button
              onClick={() => setStatusFilter('Lulus')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1 ${
                statusFilter === 'Lulus'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tuntas (≥ {CONFIG.KKTP})</span>
            </button>
            <button
              onClick={() => setStatusFilter('Belum Lulus')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1 ${
                statusFilter === 'Belum Lulus'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Perlu Bimbingan (&lt; {CONFIG.KKTP})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama / no. absen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 w-56"
            />
          </div>
        </div>
      </div>

      {/* Tabel Matriks Siswa (Scroll Horizontal Responsif dengan Kolom Kiri Sticky) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0 z-20 shadow-xs">
              <tr>
                {/* Kolom Sticky Kiri: No, Absen, Nama Siswa */}
                <th className="p-2.5 w-10 text-center sticky left-0 bg-slate-100 z-30 border-r border-slate-200">
                  No
                </th>
                <th className="p-2.5 w-12 text-center sticky left-10 bg-slate-100 z-30 border-r border-slate-200">
                  Abs
                </th>
                <th className="p-2.5 min-w-[160px] sm:min-w-[190px] sticky left-[88px] bg-slate-100 z-30 border-r-2 border-slate-300 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]">
                  Nama Siswa
                </th>

                {/* Kolom Nilai & Status */}
                <th className="p-2.5 w-16 text-center border-r border-slate-200 bg-slate-100">
                  Nilai
                </th>

                {/* Kolom Soal 1 s.d. 20 */}
                {summary.items.map((it) => (
                  <th
                    key={it.questionNumber}
                    onClick={() => onOpenQuestion && onOpenQuestion(it.questionNumber)}
                    className="p-2 w-14 text-center border-r border-slate-200 hover:bg-indigo-50/70 transition-colors cursor-pointer group"
                    title={`Klik untuk buka analisis detail Soal No. ${it.questionNumber}: ${it.question.topic}`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-black text-slate-800 group-hover:text-indigo-700">
                        S{it.questionNumber}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 group-hover:text-indigo-600">
                        {it.question.type === 'pg'
                          ? 'PG'
                          : it.question.type === 'pgk_kategori'
                          ? 'B/S'
                          : 'PGK'}
                      </span>
                    </div>
                  </th>
                ))}

                {/* Kolom Total Benar & Salah */}
                <th className="p-2.5 w-14 text-center border-r border-slate-200 bg-emerald-50 text-emerald-900">
                  Benar
                </th>
                <th className="p-2.5 w-14 text-center bg-rose-50 text-rose-900">
                  Salah
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={summary.items.length + 6}
                    className="p-12 text-center text-slate-400 font-medium"
                  >
                    <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Tidak ada data siswa yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, sIdx) => {
                  const isPassed = student.status === 'Lulus' || student.nilai >= CONFIG.KKTP;

                  return (
                    <tr
                      key={student.id || student.nama}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* No */}
                      <td className="p-2.5 text-center text-slate-500 font-semibold sticky left-0 bg-white z-10 border-r border-slate-200">
                        {sIdx + 1}
                      </td>

                      {/* No. Absen */}
                      <td className="p-2.5 text-center font-bold text-slate-700 sticky left-10 bg-white z-10 border-r border-slate-200">
                        {student.noAbsen}
                      </td>

                      {/* Nama Siswa (Clickable) */}
                      <td className="p-2.5 font-bold text-slate-900 sticky left-[88px] bg-white z-10 border-r-2 border-slate-300 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]">
                        <button
                          type="button"
                          onClick={() => onSelectStudent && onSelectStudent(student)}
                          className="flex items-center gap-1.5 text-left hover:text-indigo-600 transition-colors group cursor-pointer w-full"
                          title="Klik untuk membuka lembar jawaban siswa"
                        >
                          <span className="truncate max-w-[150px] sm:max-w-[180px]">
                            {student.nama}
                          </span>
                          <Eye className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </button>
                      </td>

                      {/* Nilai Siswa */}
                      <td className="p-2.5 text-center border-r border-slate-200">
                        <span
                          className={`font-black px-2 py-0.5 rounded-md text-xs ${
                            isPassed
                              ? 'text-emerald-700 bg-emerald-50'
                              : 'text-rose-700 bg-rose-50'
                          }`}
                        >
                          {student.nilai}
                        </span>
                      </td>

                      {/* Sel Jawaban Setiap Soal 1 s.d. 20 */}
                      {summary.items.map((it) => {
                        const resp = it.studentResponses.find(
                          (r) => r.studentName === student.nama
                        );
                        const isCorrect = resp?.isCorrect ?? false;
                        const score = resp?.score ?? 0;
                        const isPartial = score > 0 && score < 1;

                        // Label ringkas untuk di dalam sel
                        let cellBadgeText = '-';
                        if (resp) {
                          if (it.question.type === 'pg') {
                            cellBadgeText = resp.chosenOptionId || 'Ksg';
                          } else if (it.question.type === 'pgk_kategori') {
                            cellBadgeText = isCorrect ? 'B/S' : isPartial ? '½' : '0';
                          } else {
                            // PGK
                            cellBadgeText = isCorrect ? 'PGK' : '✗';
                          }
                        }

                        return (
                          <td
                            key={it.questionNumber}
                            onClick={() => {
                              if (resp) {
                                setActiveCellModal({
                                  student,
                                  question: it.question,
                                  response: resp,
                                  qNumber: it.questionNumber,
                                });
                              }
                            }}
                            className="p-1.5 text-center border-r border-slate-200 cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-inset transition-all"
                            title={`Soal No. ${it.questionNumber} • ${student.nama}: ${
                              isCorrect ? 'BENAR' : 'SALAH'
                            } (${resp?.answerSummary || 'Tidak ada'})`}
                          >
                            <div
                              className={`w-full py-1 rounded-md text-[11px] font-bold flex items-center justify-center gap-0.5 ${
                                isCorrect
                                  ? 'bg-emerald-100/80 text-emerald-800'
                                  : isPartial
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-rose-100/80 text-rose-800'
                              }`}
                            >
                              <span>{isCorrect ? '✓' : isPartial ? '~' : '✗'}</span>
                              <span className="text-[10px] font-mono">{cellBadgeText}</span>
                            </div>
                          </td>
                        );
                      })}

                      {/* Total Benar */}
                      <td className="p-2.5 text-center font-black text-emerald-700 bg-emerald-50/50 border-r border-slate-200">
                        {student.benar}
                      </td>

                      {/* Total Salah */}
                      <td className="p-2.5 text-center font-bold text-rose-600 bg-rose-50/50">
                        {student.salah}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* TFOOT: Baris Ringkasan Analisis Klasikal per Nomor Soal */}
            <tfoot className="bg-slate-100 text-slate-800 font-bold border-t-2 border-slate-300 sticky bottom-0 z-20 shadow-xs">
              {/* Baris 1: Jumlah Siswa Menjawab Benar (B) */}
              <tr className="border-b border-slate-200">
                <td
                  colSpan={4}
                  className="p-2.5 text-right font-black sticky left-0 bg-slate-100 z-30 border-r-2 border-slate-300"
                >
                  Jumlah Siswa Benar ($B$):
                </td>
                {summary.items.map((it) => (
                  <td
                    key={it.questionNumber}
                    className="p-2 text-center text-emerald-800 font-black border-r border-slate-200 bg-emerald-50/30"
                  >
                    {it.correctCount}
                  </td>
                ))}
                <td
                  colSpan={2}
                  className="p-2 text-center text-slate-500 font-medium text-[11px]"
                >
                  (Dari {summary.totalStudentsAnalyzed} Siswa)
                </td>
              </tr>

              {/* Baris 2: Persentase Ketercapaian Klasikal (%) */}
              <tr className="border-b border-slate-200">
                <td
                  colSpan={4}
                  className="p-2.5 text-right font-black sticky left-0 bg-slate-100 z-30 border-r-2 border-slate-300"
                >
                  Ketercapaian Klasikal (%):
                </td>
                {summary.items.map((it) => (
                  <td
                    key={it.questionNumber}
                    className={`p-2 text-center font-black border-r border-slate-200 ${
                      it.correctPercentage >= 70
                        ? 'text-emerald-700'
                        : it.correctPercentage >= 35
                        ? 'text-blue-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {it.correctPercentage}%
                  </td>
                ))}
                <td
                  colSpan={2}
                  className="p-2 text-center text-slate-500 font-medium text-[11px]"
                >
                  Rata-rata: {Math.round(summary.averageDifficultyIndex * 100)}%
                </td>
              </tr>

              {/* Baris 3: Tingkat Kesukaran (P) */}
              <tr>
                <td
                  colSpan={4}
                  className="p-2.5 text-right font-black sticky left-0 bg-slate-100 z-30 border-r-2 border-slate-300"
                >
                  Tingkat Kesukaran ($P$):
                </td>
                {summary.items.map((it) => (
                  <td
                    key={it.questionNumber}
                    className="p-1.5 text-center text-[10px] font-bold border-r border-slate-200"
                  >
                    <span
                      className={`px-1.5 py-0.5 rounded-sm block ${
                        it.difficultyCategory === 'Mudah'
                          ? 'bg-emerald-100 text-emerald-800'
                          : it.difficultyCategory === 'Sedang'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {it.difficultyCategory}
                    </span>
                  </td>
                ))}
                <td
                  colSpan={2}
                  className="p-2 text-center text-slate-500 font-medium text-[11px]"
                >
                  $P$ Rata: {summary.averageDifficultyIndex}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* MODAL POPUP RINCIAN SEL JAWABAN SISWA */}
      {activeCellModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div
              className={`p-4 sm:p-5 flex items-center justify-between text-white ${
                activeCellModal.response.isCorrect ? 'bg-emerald-700' : 'bg-rose-700'
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                  Rincian Jawaban Siswa
                </span>
                <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>{activeCellModal.student.nama}</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md">
                    Absen: {activeCellModal.student.noAbsen}
                  </span>
                </h4>
              </div>
              <button
                onClick={() => setActiveCellModal(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Soal Info */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">
                    Soal No. {activeCellModal.qNumber}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md">
                    {activeCellModal.question.type === 'pg'
                      ? 'Pilihan Ganda'
                      : activeCellModal.question.type === 'pgk_kategori'
                      ? 'Benar / Salah'
                      : 'Pilihan Kompleks'}
                  </span>
                </div>
                {(activeCellModal.question.illustrationKey || activeCellModal.question.id) && (
                  <div className="max-w-sm mx-auto my-1">
                    <QuestionIllustration
                      questionId={activeCellModal.question.id}
                      illustrationKey={activeCellModal.question.illustrationKey}
                    />
                  </div>
                )}
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {activeCellModal.question.text}
                </p>
              </div>

              {/* Status Jawaban & Kunci */}
              <div className="grid grid-cols-2 gap-3">
                {/* Jawaban Siswa */}
                <div
                  className={`p-3 rounded-xl border ${
                    activeCellModal.response.isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider block mb-1">
                    Jawaban Siswa:
                  </span>
                  <div className="flex items-center gap-1.5 font-black text-sm">
                    {activeCellModal.response.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="break-all">{activeCellModal.response.answerSummary}</span>
                  </div>
                  <span className="text-[11px] font-semibold block mt-1">
                    Status:{' '}
                    {activeCellModal.response.isCorrect ? 'Benar (Skor 1)' : 'Salah (Skor 0)'}
                  </span>
                </div>

                {/* Kunci Jawaban Resmi */}
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                  <span className="text-[10px] font-bold uppercase tracking-wider block mb-1">
                    Kunci Jawaban Resmi:
                  </span>
                  <span className="font-black text-sm block">
                    {activeCellModal.question.type === 'pg' && (
                      <>Opsi {activeCellModal.question.correctAnswer}</>
                    )}
                    {activeCellModal.question.type === 'pgk_kategori' && (
                      <>
                        P1:{' '}
                        {activeCellModal.question.statements?.[0]?.correctAnswer ? 'B' : 'S'} • P2:{' '}
                        {activeCellModal.question.statements?.[1]?.correctAnswer ? 'B' : 'S'} • P3:{' '}
                        {activeCellModal.question.statements?.[2]?.correctAnswer ? 'B' : 'S'}
                      </>
                    )}
                    {activeCellModal.question.type === 'pgk' && (
                      <>
                        {Array.isArray(activeCellModal.question.correctAnswer)
                          ? activeCellModal.question.correctAnswer.join(', ')
                          : activeCellModal.question.correctAnswer}
                      </>
                    )}
                  </span>
                  <span className="text-[11px] text-blue-700 block mt-1">
                    Materi: {activeCellModal.question.topic}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenQuestion) onOpenQuestion(activeCellModal.qNumber);
                    setActiveCellModal(null);
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Buka Analisis Soal No. {activeCellModal.qNumber} &rarr;
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onSelectStudent) onSelectStudent(activeCellModal.student);
                    setActiveCellModal(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Buka Hasil Lengkap Siswa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
