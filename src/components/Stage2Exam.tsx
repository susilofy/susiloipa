import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { CONFIG } from '../config';
import {
  Question,
  ShuffledQuestion,
  StudentIdentity,
  AnswerValue,
  ExamResult,
  OptionItem,
} from '../types';
import { gasService } from '../services/gasService';
import { downloadExamQuestionsPDF } from '../utils/pdfGenerator';
import { QuestionIllustration } from './QuestionIllustration';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Download,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  User,
  Check,
  RefreshCw,
  ShieldAlert,
  Maximize2,
  AlertTriangle,
  Lock,
  EyeOff,
} from 'lucide-react';

interface Stage2ExamProps {
  student: StudentIdentity;
  questions: Question[];
  onFinishExam: (result: ExamResult) => void;
  strictSecurity?: boolean;
}

// Fisher-Yates shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const Stage2Exam: React.FC<Stage2ExamProps> = ({
  student,
  questions,
  onFinishExam,
  strictSecurity = true,
}) => {
  // 1. Acak urutan soal dan opsi jawaban saat tes dimulai
  const shuffledQuestions = useMemo<ShuffledQuestion[]>(() => {
    const shuffledQ: Question[] = shuffleArray<Question>(questions);

    return shuffledQ.map((q: Question) => {
      if (q.type === 'pg' || q.type === 'pgk') {
        if (q.options && q.options.length > 0) {
          const shuffledOpts: OptionItem[] = shuffleArray<OptionItem>(q.options);
          const standardLabels = ['A', 'B', 'C', 'D'];
          const remappedOptions: OptionItem[] = shuffledOpts.map((opt, idx) => ({
            id: standardLabels[idx] || opt.id,
            text: opt.text,
          }));

          return {
            ...q,
            originalQuestionId: q.id,
            shuffledOptions: remappedOptions,
          };
        }
      }
      return {
        ...q,
        originalQuestionId: q.id,
      };
    });
  }, [questions]);

  // State pengerjaan
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // =========================================================================
  // SISTEM KEAMANAN & INTEGRITAS UJIAN (ANTI-CHEAT)
  // =========================================================================
  // State Fullscreen
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [hasPromptedInitialFullscreen, setHasPromptedInitialFullscreen] = useState(false);

  // State Pelanggaran Pindah Tab / Keluar
  const [violationCount, setViolationCount] = useState(0);
  const [violationLogs, setViolationLogs] = useState<string[]>([]);
  const [activeWarningModal, setActiveWarningModal] = useState<{
    level: 1 | 2 | 3;
    title: string;
    message: string;
    timestamp: string;
  } | null>(null);

  // Status Auto Submit akibat pelanggaran maksimal
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
  const isAutoSubmittingRef = useRef(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const currentQ = shuffledQuestions[currentIndex];
  const totalQuestions = shuffledQuestions.length;

  // Cek apakah soal nomor tertentu sudah dijawab
  const isQuestionAnswered = (idx: number): boolean => {
    const ans = answers[idx];
    if (!ans) return false;

    const q = shuffledQuestions[idx];
    if (q.type === 'pg') {
      return typeof ans === 'string' && ans.length > 0;
    }
    if (q.type === 'pgk') {
      return Array.isArray(ans) && ans.length > 0;
    }
    if (q.type === 'pgk_kategori') {
      if (typeof ans === 'object' && !Array.isArray(ans)) {
        const statements = q.statements || [];
        return statements.every((st) => ans[st.id] !== undefined);
      }
      return false;
    }
    return false;
  };

  // Hitung jumlah soal yang telah dijawab
  const answeredCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < totalQuestions; i++) {
      if (isQuestionAnswered(i)) count++;
    }
    return count;
  }, [answers, totalQuestions, shuffledQuestions]);

  const allAnswered = answeredCount === totalQuestions;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Request Fullscreen Helper
  const requestAppFullscreen = useCallback(async () => {
    try {
      const docEl = document.documentElement;
      if (!document.fullscreenElement) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if ((docEl as any).webkitRequestFullscreen) {
          await (docEl as any).webkitRequestFullscreen();
        } else if ((docEl as any).msRequestFullscreen) {
          await (docEl as any).msRequestFullscreen();
        }
      }
      setIsFullscreen(true);
    } catch {
      // Browser iframe policy might block automatic fullscreen without click; user clicks button
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
  }, []);

  // Hitung Nilai & Validasi Hasil
  const calculateResult = useCallback(
    (forcedAnswers?: Record<number, AnswerValue>, forcedAutoSubmit = false, forcedViolations = violationCount, forcedLogs = violationLogs): ExamResult => {
      const workingAnswers = forcedAnswers || answersRef.current;
      let totalScore = 0;
      let benarCount = 0;

      shuffledQuestions.forEach((sq, idx) => {
        const userAns = workingAnswers[idx];
        const origQ = questions.find((q) => q.id === sq.originalQuestionId) || sq;

        if (sq.type === 'pg') {
          const correctOpt = origQ.options?.find((o) => o.id === origQ.correctAnswer);
          if (correctOpt && userAns === correctOpt.text) {
            totalScore += 1;
            benarCount += 1;
          }
        } else if (sq.type === 'pgk') {
          const correctKeys = Array.isArray(origQ.correctAnswer) ? origQ.correctAnswer : [];
          const correctTexts = (origQ.options || [])
            .filter((o) => correctKeys.includes(o.id))
            .map((o) => o.text);

          const userSelected = Array.isArray(userAns) ? userAns : [];
          const isMatch =
            correctTexts.length === userSelected.length &&
            correctTexts.every((txt) => userSelected.includes(txt));

          if (isMatch) {
            totalScore += 1;
            benarCount += 1;
          }
        } else if (sq.type === 'pgk_kategori') {
          const statements = origQ.statements || [];
          const userMap = (typeof userAns === 'object' && !Array.isArray(userAns) ? userAns : {}) as Record<string, boolean>;

          let statementsCorrect = 0;
          statements.forEach((st) => {
            if (userMap[st.id] === st.correctAnswer) {
              statementsCorrect += 1;
            }
          });

          if (statementsCorrect === statements.length) {
            totalScore += 1;
            benarCount += 1;
          } else {
            totalScore += statementsCorrect / statements.length;
          }
        }
      });

      const finalScore = Math.round((totalScore / totalQuestions) * 100);
      const salahCount = totalQuestions - benarCount;
      const status: 'Lulus' | 'Belum Lulus' = finalScore >= CONFIG.KKTP ? 'Lulus' : 'Belum Lulus';

      const tglLahirStr = student.tglLahir
        ? `${student.tglLahir.hari} ${student.tglLahir.bulan} ${student.tglLahir.tahun}`
        : '-';

      const answersByQuestionId: Record<number, AnswerValue> = {};
      shuffledQuestions.forEach((sq, idx) => {
        answersByQuestionId[sq.originalQuestionId] = workingAnswers[idx];
      });

      return {
        id: `res-${Date.now()}`,
        timestamp: new Date().toLocaleString('id-ID'),
        nama: student.nama,
        noAbsen: student.noAbsen,
        kelas: CONFIG.KELAS,
        tglLahir: tglLahirStr,
        benar: benarCount,
        salah: salahCount,
        nilai: finalScore,
        status,
        mataPelajaran: CONFIG.MATA_PELAJARAN,
        detailJawaban: answersByQuestionId,
        violationCount: forcedViolations,
        violationLogs: forcedLogs,
        isAutoSubmitted: forcedAutoSubmit,
      };
    },
    [questions, shuffledQuestions, totalQuestions, student, violationCount, violationLogs]
  );

  // Trigger Auto-Submit jika pelanggaran mencapai batas 3 kali
  const triggerAutoSubmit = useCallback(
    async (finalLogs: string[]) => {
      if (isAutoSubmittingRef.current) return;
      isAutoSubmittingRef.current = true;
      setIsAutoSubmitting(true);

      const calculatedResult = calculateResult(answersRef.current, true, 3, finalLogs);

      // Keluar dari fullscreen jika ada
      if (document.fullscreenElement && document.exitFullscreen) {
        try {
          await document.exitFullscreen();
        } catch {
          // ignore
        }
      }

      try {
        await gasService.submitExamResult(calculatedResult);
      } catch (e) {
        console.warn('Gagal sinkronisasi auto-submit ke cloud, tersimpan lokal:', e);
      } finally {
        setTimeout(() => {
          onFinishExam(calculatedResult);
        }, 1200);
      }
    },
    [calculateResult, onFinishExam]
  );

  // Handler Peringatan Pelanggaran
  const registerViolation = useCallback(
    (reason: string) => {
      if (!strictSecurity || isAutoSubmittingRef.current) return;

      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const logEntry = `Pukul ${timeStr}: ${reason}`;

      setViolationCount((prev) => {
        const nextCount = prev + 1;
        const nextLogs = [...violationLogs, logEntry];
        setViolationLogs(nextLogs);

        if (nextCount === 1) {
          setActiveWarningModal({
            level: 1,
            title: 'Peringatan 1 dari 3: Berpindah Halaman / Tab Terdeteksi',
            message:
              'Anda terdeteksi meninggalkan halaman ujian atau beralih ke aplikasi lain. Aktivitas ini tercatat secara otomatis ke dalam sistem dan rekap penilaian guru.',
            timestamp: timeStr,
          });
        } else if (nextCount === 2) {
          setActiveWarningModal({
            level: 2,
            title: 'Peringatan 2 dari 3: Peringatan Darurat!',
            message:
              'Segera fokus kembali ke lembar soal! Satu pelanggaran lagi maka ujian akan langsung dihentikan dan jawaban Anda dikirimkan secara paksa (Auto-Submit).',
            timestamp: timeStr,
          });
        } else if (nextCount >= 3) {
          setActiveWarningModal({
            level: 3,
            title: 'Batas Pelanggaran Maksimum Terlampaui (3/3)',
            message:
              'Sistem menghentikan ujian Anda secara otomatis karena terdeteksi keluar dari halaman sebanyak 3 kali. Seluruh jawaban yang terisi telah dikirimkan ke guru.',
            timestamp: timeStr,
          });
          triggerAutoSubmit(nextLogs);
        }

        return nextCount;
      });
    },
    [strictSecurity, violationLogs, triggerAutoSubmit]
  );

  // 1. Inisialisasi Fullscreen saat masuk halaman ujian
  useEffect(() => {
    if (strictSecurity && !hasPromptedInitialFullscreen) {
      setHasPromptedInitialFullscreen(true);
      requestAppFullscreen();
    }
  }, [strictSecurity, hasPromptedInitialFullscreen, requestAppFullscreen]);

  // 2. Pantau Perubahan Status Fullscreen
  useEffect(() => {
    if (!strictSecurity) return;

    const handleFullscreenChange = () => {
      const isFs = Boolean(document.fullscreenElement);
      setIsFullscreen(isFs);
      if (!isFs && !isAutoSubmittingRef.current) {
        registerViolation('Keluar dari mode Layar Penuh (Fullscreen)');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [strictSecurity, registerViolation]);

  // 3. Deteksi Pindah Tab & Aplikasi (Page Visibility API & Blur Event)
  useEffect(() => {
    if (!strictSecurity) return;

    const handleVisibilityChange = () => {
      if (document.hidden && !isAutoSubmittingRef.current) {
        registerViolation('Pindah tab browser / Meminimalkan jendela');
      }
    };

    const handleWindowBlur = () => {
      if (!isAutoSubmittingRef.current) {
        registerViolation('Fokus layar beralih ke luar aplikasi ujian');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [strictSecurity, registerViolation]);

  // 4. Pencegahan Keluar / Refresh Tidak Sengaja (beforeunload)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isAutoSubmittingRef.current) return;
      e.preventDefault();
      e.returnValue = 'Ujian sedang berlangsung! Jika Anda meninggalkan halaman, jawaban Anda mungkin hilang.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 5. Nonaktifkan Klik Kanan & Shortcut Berbahaya (Ctrl+C, Ctrl+V, F12, dsb)
  useEffect(() => {
    if (!strictSecurity) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cegah F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Cegah Ctrl+Shift+I / Ctrl+Shift+J (DevTools)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        return false;
      }
      // Cegah Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return false;
      }
      // Cegah Ctrl+C (Copy) & Ctrl+V (Paste) jika bukan dalam input form
      if (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'v' || e.key === 'V')) {
        const target = e.target as HTMLElement;
        if (!target || (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA')) {
          e.preventDefault();
          return false;
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [strictSecurity]);

  // Handler jawaban Pilihan Ganda (PG)
  const handleSelectPG = (optionText: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionText,
    }));
  };

  // Handler jawaban Pilihan Ganda Kompleks (PGK)
  const handleTogglePGK = (optionText: string) => {
    setAnswers((prev) => {
      const currentList = Array.isArray(prev[currentIndex]) ? (prev[currentIndex] as string[]) : [];
      if (currentList.includes(optionText)) {
        return {
          ...prev,
          [currentIndex]: currentList.filter((item) => item !== optionText),
        };
      } else {
        return {
          ...prev,
          [currentIndex]: [...currentList, optionText],
        };
      }
    });
  };

  // Handler jawaban PGK Kategori (Benar / Salah)
  const handleSetCategoryStatement = (statementId: string, value: boolean) => {
    setAnswers((prev) => {
      const currentMap =
        typeof prev[currentIndex] === 'object' && !Array.isArray(prev[currentIndex])
          ? { ...(prev[currentIndex] as Record<string, boolean>) }
          : {};
      currentMap[statementId] = value;
      return {
        ...prev,
        [currentIndex]: currentMap,
      };
    });
  };

  // Navigasi soal
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex(currentIndex + 1);
  };

  // Proses Kirim Jawaban Biasa ke Google Apps Script
  const handleConfirmSubmit = async () => {
    if (!allAnswered) {
      alert('Masih ada butir soal yang belum dijawab. Harap jawab seluruh soal terlebih dahulu!');
      setShowConfirmModal(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const calculatedResult = calculateResult(answers, false, violationCount, violationLogs);

    // Keluar dari fullscreen jika ada
    if (document.fullscreenElement && document.exitFullscreen) {
      try {
        await document.exitFullscreen();
      } catch {
        // ignore
      }
    }

    try {
      await gasService.submitExamResult(calculatedResult);
      setIsSubmitting(false);
      setShowConfirmModal(false);
      onFinishExam(calculatedResult);
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError(
        err.message ||
          'Gagal mengirim data ke server. Periksa koneksi internet atau konfigurasi Google Apps Script.'
      );
    }
  };

  const currentOptions = currentQ.shuffledOptions || currentQ.options || [];

  return (
    <div className={`max-w-6xl mx-auto py-6 px-4 sm:px-6 ${strictSecurity ? 'select-none' : ''}`}>
      {/* ========================================================================= */}
      {/* OVERLAY PEMBLOKIR: WAJIB MODE LAYAR PENUH (FULLSCREEN MANDATORY)          */}
      {/* ========================================================================= */}
      {strictSecurity && !isFullscreen && !isAutoSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border-2 border-rose-300 relative">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <span className="inline-block px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              Keamanan Ujian Aktif
            </span>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
              Ujian Wajib dalam Mode Layar Penuh!
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Untuk menjaga integritas dan ketertiban asesmen, Anda tidak diperkenankan keluar dari layar penuh atau membuka jendela lain selama ujian berlangsung.
            </p>

            <button
              type="button"
              id="btn-resume-fullscreen"
              onClick={requestAppFullscreen}
              className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Aktifkan Kembali Layar Penuh</span>
            </button>
            <p className="text-[11px] text-slate-400 mt-3">
              Pelanggaran keluar layar dicatat otomatis ke dalam sistem penilaian guru.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PERINGATAN PELANGGARAN PINDAH TAB (TOLERANSI 1, 2, DAN 3)            */}
      {/* ========================================================================= */}
      {activeWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className={`bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 text-center ${
              activeWarningModal.level === 3
                ? 'border-rose-600 bg-rose-50/20'
                : activeWarningModal.level === 2
                ? 'border-amber-500 bg-amber-50/20'
                : 'border-yellow-400'
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                activeWarningModal.level === 3
                  ? 'bg-rose-100 text-rose-600'
                  : activeWarningModal.level === 2
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {activeWarningModal.level === 3 ? (
                <ShieldAlert className="w-8 h-8" />
              ) : (
                <AlertTriangle className="w-8 h-8" />
              )}
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 bg-slate-100 text-slate-800 border border-slate-300">
              <span>Toleransi Pelanggaran: {violationCount} dari 3</span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2">
              {activeWarningModal.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              {activeWarningModal.message}
            </p>

            {/* Riwayat Pelanggaran */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1 mb-5">
              <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                Catatan Waktu Pelanggaran:
              </span>
              {violationLogs.map((log, idx) => (
                <div key={idx} className="text-rose-700 font-mono text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                  <span>{log}</span>
                </div>
              ))}
            </div>

            {activeWarningModal.level < 3 ? (
              <button
                type="button"
                id="btn-dismiss-warning"
                onClick={() => {
                  setActiveWarningModal(null);
                  requestAppFullscreen();
                }}
                className={`w-full py-3 px-4 font-bold rounded-xl text-white transition-all shadow-md cursor-pointer text-xs sm:text-sm ${
                  activeWarningModal.level === 2
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Saya Mengerti, Kembali Mengerjakan Ujian
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 py-3 text-rose-700 font-bold text-xs">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Pengiriman Paksa (Auto-Submit)...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header Info Siswa, Mode Keamanan, & Progres */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{student.nama}</span>
                <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                  Absen: {student.noAbsen}
                </span>
                <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">
                  Kelas {CONFIG.KELAS}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {CONFIG.SEKOLAH} • {CONFIG.MATA_PELAJARAN} ({CONFIG.MATERI})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Keamanan Ujian */}
            {strictSecurity && (
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  violationCount === 0
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : violationCount === 1
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}
                title="Sistem Keamanan Anti-Pindah Tab Aktif"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>
                  {violationCount === 0
                    ? 'Integritas: Tertib (0/3)'
                    : `Peringatan: ${violationCount}/3 Pelanggaran`}
                </span>
              </div>
            )}

            {/* Tombol Unduh Naskah Soal PDF */}
            <button
              id="btn-download-questions-pdf"
              onClick={() => downloadExamQuestionsPDF(questions)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-300 cursor-pointer"
              title="Unduh Lembar Naskah Soal dalam bentuk PDF"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Unduh Soal (PDF)</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-slate-600">
              Progres Pengerjaan: <span className="text-blue-700 font-bold">{answeredCount}</span> dari {totalQuestions} Soal Terjawab
            </span>
            <span className="text-blue-700 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Layout: Konten Soal + Navigasi Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Lembar Soal Aktif */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 min-h-[420px] flex flex-col justify-between">
            <div>
              {/* Header Nomor & Tipe Soal */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm sm:text-base font-extrabold px-3 py-1 bg-blue-700 text-white rounded-xl shadow-2xs">
                    Soal No. {currentIndex + 1}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {currentQ.type === 'pg' && 'Pilihan Ganda'}
                    {currentQ.type === 'pgk' && 'Pilihan Ganda Kompleks'}
                    {currentQ.type === 'pgk_kategori' && 'PGK Kategori (Benar / Salah)'}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {currentQ.topic}
                </span>
              </div>

              {/* Petunjuk Pengisian Berdasarkan Tipe */}
              <div className="mb-4 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-100 inline-block">
                {currentQ.type === 'pg' && 'Pilihlah salah satu jawaban yang paling tepat.'}
                {currentQ.type === 'pgk' && 'Pilihlah seluruh pernyataan yang bernilai benar (bisa lebih dari satu).'}
                {currentQ.type === 'pgk_kategori' && 'Tentukan pilihan Benar atau Salah untuk setiap pernyataan di bawah ini.'}
              </div>

              {/* Gambar / Ilustrasi Grafis Stimulus Soal */}
              {(currentQ.illustrationKey || currentQ.originalQuestionId || currentQ.id) && (
                <div className="mb-5 max-w-xl mx-auto">
                  <QuestionIllustration
                    questionId={currentQ.originalQuestionId || currentQ.id}
                    illustrationKey={currentQ.illustrationKey}
                  />
                </div>
              )}

              {/* Teks Soal */}
              <div className="text-sm sm:text-base text-slate-900 leading-relaxed font-medium whitespace-pre-line mb-6">
                {currentQ.text}
              </div>

              {/* Tampilan Opsi Jawaban: Pilihan Ganda (PG) */}
              {currentQ.type === 'pg' && (
                <div className="space-y-2.5">
                  {currentOptions.map((opt) => {
                    const isSelected = answers[currentIndex] === opt.text;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectPG(opt.text)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold ring-1 ring-blue-500'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {opt.id}
                        </div>
                        <span className="text-xs sm:text-sm mt-0.5 leading-normal flex-1">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Tampilan Opsi Jawaban: Pilihan Ganda Kompleks (PGK) */}
              {currentQ.type === 'pgk' && (
                <div className="space-y-2.5">
                  {currentOptions.map((opt) => {
                    const currentList = Array.isArray(answers[currentIndex])
                      ? (answers[currentIndex] as string[])
                      : [];
                    const isChecked = currentList.includes(opt.text);

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleTogglePGK(opt.text)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                          isChecked
                            ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-500'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border transition-colors ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                              : 'bg-white border-slate-300 text-slate-600'
                          }`}
                        >
                          {isChecked ? <Check className="w-4 h-4" /> : opt.id}
                        </div>
                        <span className="text-xs sm:text-sm mt-0.5 leading-normal flex-1">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Tampilan Opsi Jawaban: PGK Kategori (3 Pernyataan Benar/Salah) */}
              {currentQ.type === 'pgk_kategori' && currentQ.statements && (
                <div className="space-y-3.5">
                  {currentQ.statements.map((st, sIdx) => {
                    const currentMap =
                      typeof answers[currentIndex] === 'object' && !Array.isArray(answers[currentIndex])
                        ? (answers[currentIndex] as Record<string, boolean>)
                        : {};
                    const selectedVal = currentMap[st.id];

                    return (
                      <div
                        key={st.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-2.5 flex-1">
                          <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                            {st.text}
                          </p>
                        </div>

                        {/* Pilihan Tombol Benar / Salah */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleSetCategoryStatement(st.id, true)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              selectedVal === true
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Benar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetCategoryStatement(st.id, false)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              selectedVal === false
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Salah</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tombol Aksi Bawah: Sebelumnya & Berikutnya */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 gap-3">
              <button
                id="btn-prev-question"
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  id="btn-next-question"
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="btn-finish-test-prompt"
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Jawaban</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Grid Navigasi Nomor Soal & Ringkasan */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
              <span>Nomor Soal Ujian</span>
              <span className="text-[11px] font-normal text-slate-500">{totalQuestions} Butir</span>
            </h4>

            {/* Grid Soal */}
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 mb-4">
              {shuffledQuestions.map((_, i) => {
                const isCurrent = currentIndex === i;
                const isAnswered = isQuestionAnswered(i);

                let btnClass = 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
                if (isAnswered) {
                  btnClass = 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700';
                }
                if (isCurrent) {
                  btnClass = 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300 font-extrabold';
                }

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`h-9 rounded-lg font-bold text-xs flex items-center justify-center border transition-all cursor-pointer ${btnClass}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {/* Keterangan Warna */}
            <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <span>Soal Sedang Dikerjakan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <span>Soal Sudah Terjawab</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300" />
                <span>Belum Dijawab</span>
              </div>
            </div>

            {/* Tombol Pintas Kirim di Navigasi Kanan */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <button
                type="button"
                id="btn-sidebar-finish-test"
                onClick={() => setShowConfirmModal(true)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  allAnswered
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {allAnswered
                    ? 'Selesai & Kirim Hasil Ujian'
                    : `Kirim Jawaban (${answeredCount}/${totalQuestions})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL KONFIRMASI PENGIRIMAN JAWABAN */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Konfirmasi Pengiriman Jawaban
                </h3>
                <p className="text-xs text-slate-500">
                  Periksa kembali kepastian jawaban Anda
                </p>
              </div>
            </div>

            {!allAnswered ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs mb-5">
                <p className="font-bold mb-1">Peringatan: Belum Semua Soal Dijawab!</p>
                <p>
                  Anda baru menjawab <span className="font-bold">{answeredCount}</span> dari {totalQuestions} butir soal. Sesuai ketentuan, Anda tidak dapat mengirim tes sebelum seluruh soal terjawab.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs mb-5 space-y-1">
                <p className="font-bold">Apakah Anda yakin ingin mengirim jawaban?</p>
                <p>
                  Setelah dikirim, nilai akan dihitung dan tersimpan secara permanen ke rekap Google Spreadsheet sekolah.
                </p>
              </div>
            )}

            {submitError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs mb-4">
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Gagal Mengirim Data
                </p>
                <p>{submitError}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                id="btn-cancel-submit"
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setShowConfirmModal(false);
                  setSubmitError(null);
                }}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal / Kembali ke Soal
              </button>

              {allAnswered && (
                <button
                  id="btn-confirm-submit-answers"
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmSubmit}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim ke Server...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Ya, Kirim Jawaban</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
