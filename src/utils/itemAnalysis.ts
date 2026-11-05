import { Question, ExamResult, AnswerValue } from '../types';
import { CONFIG } from '../config';

export interface OptionDistributionItem {
  id: string; // 'A', 'B', 'C'
  text: string;
  count: number;
  percentage: number;
  isCorrect: boolean;
  isEffectiveDistractor?: boolean; // Pengecoh efektif jika dipilih minimal 5% peserta
  studentNames?: string[]; // Nama siswa yang memilih opsi ini
}

export interface StatementAnalysisItem {
  id: string;
  text: string;
  correctAnswer: boolean;
  trueChosenCount: number;
  falseChosenCount: number;
  correctCount: number;
  percentage: number;
  trueStudentNames?: string[]; // Nama siswa yang memilih Benar
  falseStudentNames?: string[]; // Nama siswa yang memilih Salah
}

export interface StudentItemResponse {
  studentName: string;
  noAbsen: string;
  kelas: string;
  nilai: number;
  isCorrect: boolean;
  score: number; // 0, 0.33, 0.67, 1
  answerSummary: string; // Teks representasi ringkas dan jelas
  chosenOptionId?: string;
  rawAnswer?: AnswerValue;
  studentResult: ExamResult;
}

export interface QuestionItemAnalysis {
  question: Question;
  questionNumber: number;
  totalStudents: number;
  correctCount: number;
  incorrectCount: number;
  partialCount: number; // Untuk soal kategori yang benar sebagian
  correctPercentage: number;
  
  // Tingkat Kesukaran (P = B / N)
  difficultyIndex: number; // 0.00 s.d. 1.00
  difficultyCategory: 'Mudah' | 'Sedang' | 'Sukar';

  // Daya Pembeda (D = (BA - BB) / n)
  discriminationIndex: number; // -1.00 s.d. 1.00
  discriminationCategory: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Jelek / Revisi';
  upperGroupCorrect: number;
  lowerGroupCorrect: number;
  groupSize: number;

  // Analisis Pengecoh / Opsi & Jawaban Siswa
  optionDistributions: OptionDistributionItem[];
  statementAnalysis?: StatementAnalysisItem[];
  studentResponses: StudentItemResponse[];

  // Rekomendasi Pedagogis
  recommendation: string;
  remedialNeeded: boolean;
}

export interface ItemAnalysisSummary {
  totalQuestions: number;
  totalStudentsAnalyzed: number;
  averageDifficultyIndex: number;
  averageDiscriminationIndex: number;
  difficultyCounts: {
    mudah: number;
    sedang: number;
    sukar: number;
  };
  discriminationCounts: {
    sangatBaik: number;
    baik: number;
    cukup: number;
    jelek: number;
  };
  remedialItemNumbers: number[];
  masteredItemNumbers: number[];
  items: QuestionItemAnalysis[];
  studentsList: ExamResult[];
}

/**
 * Mengevaluasi jawaban satu siswa terhadap satu soal tertentu
 * Mengembalikan:
 * - isCorrect: boolean
 * - score: number (0 sampai 1)
 * - chosenOptionId?: string ('A', 'B', 'C' jika PG)
 * - chosenStatements?: Record<string, boolean> (jika PGK Kategori)
 * - chosenPGKIds?: string[] (jika PGK)
 */
export function evaluateStudentAnswer(
  q: Question,
  rawAnswer: AnswerValue | undefined
): {
  isCorrect: boolean;
  score: number;
  chosenOptionId?: string;
  chosenStatements?: Record<string, boolean>;
  chosenPGKIds?: string[];
} {
  if (rawAnswer === undefined || rawAnswer === null) {
    return { isCorrect: false, score: 0 };
  }

  // 1. SOAL PILIHAN GANDA (PG)
  if (q.type === 'pg') {
    const ansText = typeof rawAnswer === 'string' ? rawAnswer.trim() : '';
    // Cocokkan apakah user menjawab ID ('A' / 'B' / 'C') atau teks opsi
    const matchedOption = q.options?.find(
      (opt) => opt.id === ansText || opt.text.trim() === ansText
    );
    const chosenOptionId = matchedOption ? matchedOption.id : ansText;
    const isCorrect = chosenOptionId === q.correctAnswer;
    return {
      isCorrect,
      score: isCorrect ? 1 : 0,
      chosenOptionId,
    };
  }

  // 2. SOAL BENAR / SALAH (PGK Kategori - 3 Pernyataan)
  if (q.type === 'pgk_kategori') {
    const userMap = (
      typeof rawAnswer === 'object' && !Array.isArray(rawAnswer)
        ? rawAnswer
        : {}
    ) as Record<string, boolean>;

    const statements = q.statements || [];
    if (statements.length === 0) return { isCorrect: false, score: 0 };

    let correctStatements = 0;
    statements.forEach((st) => {
      if (userMap[st.id] === st.correctAnswer) {
        correctStatements += 1;
      }
    });

    const isFullCorrect = correctStatements === statements.length;
    const score = correctStatements / statements.length;

    return {
      isCorrect: isFullCorrect,
      score,
      chosenStatements: userMap,
    };
  }

  // 3. SOAL PILIHAN GANDA KOMPLEKS (PGK)
  if (q.type === 'pgk') {
    const selectedList = Array.isArray(rawAnswer)
      ? (rawAnswer as string[])
      : typeof rawAnswer === 'string'
      ? [rawAnswer]
      : [];

    // Map teks ke ID jika yang disimpan adalah teks
    const chosenPGKIds: string[] = [];
    selectedList.forEach((item) => {
      const matchOpt = q.options?.find(
        (o) => o.id === item || o.text.trim() === item.trim()
      );
      if (matchOpt) {
        chosenPGKIds.push(matchOpt.id);
      } else if (item.length === 1) {
        chosenPGKIds.push(item);
      }
    });

    const correctKeys = Array.isArray(q.correctAnswer)
      ? q.correctAnswer
      : q.correctAnswer
      ? [q.correctAnswer]
      : [];

    const isCorrect =
      chosenPGKIds.length === correctKeys.length &&
      correctKeys.every((k) => chosenPGKIds.includes(k));

    return {
      isCorrect,
      score: isCorrect ? 1 : 0,
      chosenPGKIds,
    };
  }

  return { isCorrect: false, score: 0 };
}

/**
 * Format representasi teks jawaban siswa yang ramah dibaca guru
 */
export function formatStudentAnswerSummary(
  q: Question,
  rawAnswer: AnswerValue | undefined,
  evaluation: {
    isCorrect: boolean;
    score: number;
    chosenOptionId?: string;
    chosenStatements?: Record<string, boolean>;
    chosenPGKIds?: string[];
  }
): string {
  if (rawAnswer === undefined || rawAnswer === null) {
    return 'Belum Menjawab';
  }

  // 1. Pilihan Ganda
  if (q.type === 'pg') {
    if (!evaluation.chosenOptionId) return 'Belum Menjawab';
    const opt = q.options?.find((o) => o.id === evaluation.chosenOptionId);
    return `Opsi ${evaluation.chosenOptionId}${opt ? ` (${opt.text})` : ''}`;
  }

  // 2. Benar / Salah (PGK Kategori)
  if (q.type === 'pgk_kategori') {
    const stList = q.statements || [];
    const parts = stList.map((st, idx) => {
      const val = evaluation.chosenStatements?.[st.id];
      const strVal = val === true ? 'B' : val === false ? 'S' : '-';
      return `P${idx + 1}:${strVal}`;
    });
    return parts.join(', ');
  }

  // 3. Pilihan Kompleks
  if (q.type === 'pgk') {
    if (!evaluation.chosenPGKIds || evaluation.chosenPGKIds.length === 0) {
      return 'Tidak ada opsi dipilih';
    }
    const optLabels = evaluation.chosenPGKIds.map((id) => {
      const opt = q.options?.find((o) => o.id === id);
      return opt ? `Opsi ${id} (${opt.text})` : `Opsi ${id}`;
    });
    return optLabels.join('; ');
  }

  return String(rawAnswer);
}

/**
 * Melakukan Analisis Butir Soal Komprehensif dari hasil seluruh siswa
 */
export function analyzeExamItems(
  questions: Question[],
  results: ExamResult[]
): ItemAnalysisSummary {
  // Siswa yang valid untuk dianalisis
  const totalStudents = results.length;

  if (totalStudents === 0 || questions.length === 0) {
    return {
      totalQuestions: questions.length,
      totalStudentsAnalyzed: 0,
      averageDifficultyIndex: 0,
      averageDiscriminationIndex: 0,
      difficultyCounts: { mudah: 0, sedang: 0, sukar: 0 },
      discriminationCounts: { sangatBaik: 0, baik: 0, cukup: 0, jelek: 0 },
      remedialItemNumbers: [],
      masteredItemNumbers: [],
      items: questions.map((q, idx) => createEmptyAnalysis(q, idx + 1)),
      studentsList: [],
    };
  }

  // Urutkan siswa berdasarkan total skor / nilai tertinggi ke terendah
  // untuk pembagian Kelompok Atas dan Kelompok Bawah (Daya Pembeda)
  const sortedStudents = [...results].sort((a, b) => (b.nilai || 0) - (a.nilai || 0));

  // Menghitung ukuran kelompok pembeda (proporsi 33% - 50% siswa)
  const groupSize = Math.max(1, Math.floor(totalStudents * (totalStudents >= 10 ? 0.33 : 0.5)));
  const upperGroup = sortedStudents.slice(0, groupSize);
  const lowerGroup = sortedStudents.slice(totalStudents - groupSize);

  const items: QuestionItemAnalysis[] = questions.map((q, qIndex) => {
    const questionNumber = qIndex + 1;
    let correctCount = 0;
    let incorrectCount = 0;
    let partialCount = 0;

    // Distribusi Opsi (untuk PG dan PGK)
    const optionCounts: Record<string, number> = {};
    const optionStudentNames: Record<string, string[]> = {};
    q.options?.forEach((opt) => {
      optionCounts[opt.id] = 0;
      optionStudentNames[opt.id] = [];
    });

    // Analisis Pernyataan (untuk PGK Kategori)
    const statementCounts: Record<
      string,
      { trueChosen: number; falseChosen: number; correctChosen: number }
    > = {};
    const statementTrueStudents: Record<string, string[]> = {};
    const statementFalseStudents: Record<string, string[]> = {};
    q.statements?.forEach((st) => {
      statementCounts[st.id] = { trueChosen: 0, falseChosen: 0, correctChosen: 0 };
      statementTrueStudents[st.id] = [];
      statementFalseStudents[st.id] = [];
    });

    // Respon Individual Setiap Siswa pada butir ini
    const studentResponses: StudentItemResponse[] = [];

    // Iterasi seluruh siswa untuk butir soal ini
    results.forEach((student) => {
      // Ambil jawaban siswa untuk soal ini
      // Bisa tersimpan di student.detailJawaban[q.id] atau student.detailJawaban[qIndex]
      const rawAns =
        student.detailJawaban?.[q.id] ??
        student.detailJawaban?.[qIndex] ??
        student.detailJawaban?.[String(q.id) as any];

      const evaluation = evaluateStudentAnswer(q, rawAns);

      if (evaluation.isCorrect) {
        correctCount += 1;
      } else if (evaluation.score > 0 && evaluation.score < 1) {
        partialCount += 1;
      } else {
        incorrectCount += 1;
      }

      const answerSummary = formatStudentAnswerSummary(q, rawAns, evaluation);

      studentResponses.push({
        studentName: student.nama,
        noAbsen: student.noAbsen || '-',
        kelas: student.kelas || 'I',
        nilai: student.nilai || 0,
        isCorrect: evaluation.isCorrect,
        score: evaluation.score,
        answerSummary,
        chosenOptionId: evaluation.chosenOptionId,
        rawAnswer: rawAns,
        studentResult: student,
      });

      // Distribusi Opsi PG
      if (q.type === 'pg' && evaluation.chosenOptionId) {
        if (optionCounts[evaluation.chosenOptionId] !== undefined) {
          optionCounts[evaluation.chosenOptionId] += 1;
          optionStudentNames[evaluation.chosenOptionId].push(student.nama);
        }
      }

      // Distribusi Opsi PGK
      if (q.type === 'pgk' && evaluation.chosenPGKIds) {
        evaluation.chosenPGKIds.forEach((optId) => {
          if (optionCounts[optId] !== undefined) {
            optionCounts[optId] += 1;
            optionStudentNames[optId].push(student.nama);
          }
        });
      }

      // Distribusi Pernyataan PGK Kategori
      if (q.type === 'pgk_kategori' && evaluation.chosenStatements) {
        q.statements?.forEach((st) => {
          const userVal = evaluation.chosenStatements?.[st.id];
          if (userVal === true) {
            statementCounts[st.id].trueChosen += 1;
            statementTrueStudents[st.id].push(student.nama);
            if (st.correctAnswer === true) {
              statementCounts[st.id].correctChosen += 1;
            }
          } else if (userVal === false) {
            statementCounts[st.id].falseChosen += 1;
            statementFalseStudents[st.id].push(student.nama);
            if (st.correctAnswer === false) {
              statementCounts[st.id].correctChosen += 1;
            }
          }
        });
      }
    });

    // Urutkan student responses sesuai nomor absen secara rapi
    studentResponses.sort((a, b) => {
      const numA = parseInt(a.noAbsen, 10);
      const numB = parseInt(b.noAbsen, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.studentName.localeCompare(b.studentName);
    });

    // 1. Indeks Tingkat Kesukaran (P = (B + 0.5 * Parsial) / N)
    const effectiveCorrect = correctCount + partialCount * 0.5;
    const difficultyIndex = Math.round((effectiveCorrect / totalStudents) * 100) / 100;
    
    let difficultyCategory: 'Mudah' | 'Sedang' | 'Sukar' = 'Sedang';
    if (difficultyIndex >= 0.70) {
      difficultyCategory = 'Mudah';
    } else if (difficultyIndex < 0.30) {
      difficultyCategory = 'Sukar';
    } else {
      difficultyCategory = 'Sedang';
    }

    // 2. Daya Pembeda (D = (BA - BB) / n)
    let upperCorrect = 0;
    upperGroup.forEach((st) => {
      const rawAns =
        st.detailJawaban?.[q.id] ??
        st.detailJawaban?.[qIndex] ??
        st.detailJawaban?.[String(q.id) as any];
      const ev = evaluateStudentAnswer(q, rawAns);
      if (ev.isCorrect || ev.score >= 0.6) upperCorrect += 1;
    });

    let lowerCorrect = 0;
    lowerGroup.forEach((st) => {
      const rawAns =
        st.detailJawaban?.[q.id] ??
        st.detailJawaban?.[qIndex] ??
        st.detailJawaban?.[String(q.id) as any];
      const ev = evaluateStudentAnswer(q, rawAns);
      if (ev.isCorrect || ev.score >= 0.6) lowerCorrect += 1;
    });

    const diffD = (upperCorrect - lowerCorrect) / groupSize;
    const discriminationIndex = Math.round(diffD * 100) / 100;

    let discriminationCategory: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Jelek / Revisi' = 'Baik';
    if (discriminationIndex >= 0.40) {
      discriminationCategory = 'Sangat Baik';
    } else if (discriminationIndex >= 0.30) {
      discriminationCategory = 'Baik';
    } else if (discriminationIndex >= 0.20) {
      discriminationCategory = 'Cukup';
    } else {
      discriminationCategory = 'Jelek / Revisi';
    }

    // 3. Distribusi Opsi & Efektivitas Pengecoh
    const optionDistributions: OptionDistributionItem[] = (q.options || []).map((opt) => {
      const count = optionCounts[opt.id] || 0;
      const percentage = Math.round((count / totalStudents) * 100);
      const isCorrect = Array.isArray(q.correctAnswer)
        ? q.correctAnswer.includes(opt.id)
        : q.correctAnswer === opt.id;
      const isEffectiveDistractor = !isCorrect && percentage >= 5;

      return {
        id: opt.id,
        text: opt.text,
        count,
        percentage,
        isCorrect,
        isEffectiveDistractor,
        studentNames: optionStudentNames[opt.id] || [],
      };
    });

    // 4. Analisis Pernyataan Kategori (jika ada)
    const statementAnalysis: StatementAnalysisItem[] | undefined = q.statements?.map((st) => {
      const data = statementCounts[st.id] || { trueChosen: 0, falseChosen: 0, correctChosen: 0 };
      const percentage = Math.round((data.correctChosen / totalStudents) * 100);
      return {
        id: st.id,
        text: st.text,
        correctAnswer: st.correctAnswer,
        trueChosenCount: data.trueChosen,
        falseChosenCount: data.falseChosen,
        correctCount: data.correctChosen,
        percentage,
        trueStudentNames: statementTrueStudents[st.id] || [],
        falseStudentNames: statementFalseStudents[st.id] || [],
      };
    });

    // 5. Rekomendasi Pedagogis & Kebutuhan Remedial
    let recommendation = '';
    const remedialNeeded = difficultyIndex < 0.35 || (incorrectCount > totalStudents * 0.65);

    if (remedialNeeded) {
      recommendation = 'Ketercapaian rendah (< 35%). Materi esensial ini memerlukan remedial pembelajaran klasikal.';
    } else if (discriminationIndex < 0.20 && difficultyCategory !== 'Mudah') {
      recommendation = 'Daya pembeda rendah. Butir soal atau kalimat pengecoh perlu ditelaah dan diperbaiki.';
    } else if (difficultyCategory === 'Mudah' && discriminationIndex >= 0.20) {
      recommendation = 'Materi dikuasai sangat baik oleh sebagian besar siswa. Soal baik & layak dipertahankan.';
    } else if (difficultyCategory === 'Sedang' && discriminationIndex >= 0.30) {
      recommendation = 'Kualitas butir soal prima: tingkat kesukaran ideal dan berdaya beda tinggi.';
    } else {
      recommendation = 'Kualitas soal cukup baik dan dapat digunakan kembali dengan penyempurnaan kecil.';
    }

    const correctPercentage = Math.round((correctCount / totalStudents) * 100);

    return {
      question: q,
      questionNumber,
      totalStudents,
      correctCount,
      incorrectCount,
      partialCount,
      correctPercentage,
      difficultyIndex,
      difficultyCategory,
      discriminationIndex,
      discriminationCategory,
      upperGroupCorrect: upperCorrect,
      lowerGroupCorrect: lowerCorrect,
      groupSize,
      optionDistributions,
      statementAnalysis,
      studentResponses,
      recommendation,
      remedialNeeded,
    };
  });

  // Ringkasan Keseluruhan
  const sumDiff = items.reduce((acc, curr) => acc + curr.difficultyIndex, 0);
  const sumDisc = items.reduce((acc, curr) => acc + curr.discriminationIndex, 0);

  const averageDifficultyIndex = Math.round((sumDiff / items.length) * 100) / 100;
  const averageDiscriminationIndex = Math.round((sumDisc / items.length) * 100) / 100;

  const difficultyCounts = {
    mudah: items.filter((i) => i.difficultyCategory === 'Mudah').length,
    sedang: items.filter((i) => i.difficultyCategory === 'Sedang').length,
    sukar: items.filter((i) => i.difficultyCategory === 'Sukar').length,
  };

  const discriminationCounts = {
    sangatBaik: items.filter((i) => i.discriminationCategory === 'Sangat Baik').length,
    baik: items.filter((i) => i.discriminationCategory === 'Baik').length,
    cukup: items.filter((i) => i.discriminationCategory === 'Cukup').length,
    jelek: items.filter((i) => i.discriminationCategory === 'Jelek / Revisi').length,
  };

  const remedialItemNumbers = items.filter((i) => i.remedialNeeded).map((i) => i.questionNumber);
  const masteredItemNumbers = items.filter((i) => i.difficultyIndex >= 0.75).map((i) => i.questionNumber);

  return {
    totalQuestions: questions.length,
    totalStudentsAnalyzed: totalStudents,
    averageDifficultyIndex,
    averageDiscriminationIndex,
    difficultyCounts,
    discriminationCounts,
    remedialItemNumbers,
    masteredItemNumbers,
    items,
    studentsList: results,
  };
}

function createEmptyAnalysis(q: Question, num: number): QuestionItemAnalysis {
  return {
    question: q,
    questionNumber: num,
    totalStudents: 0,
    correctCount: 0,
    incorrectCount: 0,
    partialCount: 0,
    correctPercentage: 0,
    difficultyIndex: 0,
    difficultyCategory: 'Sedang',
    discriminationIndex: 0,
    discriminationCategory: 'Cukup',
    upperGroupCorrect: 0,
    lowerGroupCorrect: 0,
    groupSize: 0,
    studentResponses: [],
    optionDistributions: (q.options || []).map((o) => ({
      id: o.id,
      text: o.text,
      count: 0,
      percentage: 0,
      isCorrect: Array.isArray(q.correctAnswer)
        ? q.correctAnswer.includes(o.id)
        : q.correctAnswer === o.id,
      studentNames: [],
    })),
    recommendation: 'Belum ada data pengerjaan siswa yang tersimpan.',
    remedialNeeded: false,
  };
}

/**
 * Membuat data simulasi respons 24 siswa satu kelas yang realistis
 * Sangat berguna untuk guru agar dapat langsung meninjau tampilan analisis butir soal
 */
export function generateSampleClassExamResults(questions: Question[]): ExamResult[] {
  const studentNames = [
    'Aditya Pratama',
    'Aisyah Putri Rahayu',
    'Ananda Rizky Saputra',
    'Bagus Wicaksono',
    'Bima Satria Dewa',
    'Cantika Dewi Lestari',
    'Dimas Arya Nugraha',
    'Dinda Ayu Permata',
    'Fajar Kurniawan',
    'Gita Citra Maharani',
    'Hafiz Maulana',
    'Indah Permatasari',
    'Kadek Arya Suputra',
    'Larasati Kusuma',
    'Made Danendra',
    'Nabila Shafa Azzahra',
    'Ni Kadek Sri Wahyuni',
    'Putu Bagus Daniswara',
    'Rafi Ahmad Pratama',
    'Rani Maharani',
    'Surya Dharma Wijaya',
    'Tiara Salsabila',
    'Wahyu Hidayat',
    'Zahra Nur Aini',
  ];

  // Tingkat kemampuan siswa (dari kelompok mahir, sedang, hingga pemula)
  const abilities = [
    0.95, 0.92, 0.88, 0.85, 0.82, 0.80, // Mahir
    0.78, 0.75, 0.72, 0.70, 0.68, 0.65, // Sedang Atas
    0.62, 0.60, 0.58, 0.55, 0.52, 0.50, // Sedang Bawah
    0.45, 0.42, 0.38, 0.35, 0.30, 0.25, // Perlu Bimbingan
  ];

  const now = new Date();

  return studentNames.map((name, idx) => {
    const ability = abilities[idx] || 0.65;
    const detailJawaban: Record<number, AnswerValue> = {};
    let correctCount = 0;
    let scoreTotal = 0;

    questions.forEach((q) => {
      // Bobot soal berdasarkan tingkat kesukaran riil butir soal
      let itemDifficulty = 0.75;
      if (q.difficulty === 'Sukar') {
        itemDifficulty = 0.52;
      } else if (q.difficulty === 'Sedang') {
        itemDifficulty = 0.72;
      } else {
        itemDifficulty = 0.88;
      }

      // Probabilitas siswa ini menjawab benar
      const prob = Math.min(0.98, Math.max(0.1, ability * itemDifficulty * 1.3));
      const willBeCorrect = Math.random() < prob;

      if (q.type === 'pg') {
        const correctOpt = q.options?.find((o) => o.id === q.correctAnswer);
        if (willBeCorrect && correctOpt) {
          detailJawaban[q.id] = correctOpt.text;
          correctCount += 1;
          scoreTotal += 1;
        } else {
          // Pilih salah satu pengecoh
          const distractors = q.options?.filter((o) => o.id !== q.correctAnswer) || [];
          const picked = distractors[Math.floor(Math.random() * distractors.length)];
          detailJawaban[q.id] = picked ? picked.text : 'Jawaban Salah';
        }
      } else if (q.type === 'pgk_kategori') {
        const statements = q.statements || [];
        const ansMap: Record<string, boolean> = {};
        let stCorrect = 0;
        statements.forEach((st) => {
          const stProb = Math.min(0.95, Math.max(0.2, ability * 1.2));
          const isStCorrect = Math.random() < stProb;
          ansMap[st.id] = isStCorrect ? st.correctAnswer : !st.correctAnswer;
          if (isStCorrect) stCorrect += 1;
        });
        detailJawaban[q.id] = ansMap;
        if (stCorrect === statements.length) {
          correctCount += 1;
          scoreTotal += 1;
        } else {
          scoreTotal += stCorrect / statements.length;
        }
      } else if (q.type === 'pgk') {
        const correctKeys = Array.isArray(q.correctAnswer) ? q.correctAnswer : [];
        if (willBeCorrect) {
          const correctTexts = (q.options || [])
            .filter((o) => correctKeys.includes(o.id))
            .map((o) => o.text);
          detailJawaban[q.id] = correctTexts;
          correctCount += 1;
          scoreTotal += 1;
        } else {
          // Centang yang kurang tepat
          const randomOpt = q.options?.[Math.floor(Math.random() * (q.options?.length || 1))];
          detailJawaban[q.id] = randomOpt ? [randomOpt.text] : [];
        }
      }
    });

    const finalScore = Math.round((scoreTotal / questions.length) * 100);
    const incorrectCount = questions.length - correctCount;

    return {
      id: `sim-${idx + 1}`,
      timestamp: new Date(now.getTime() - (24 - idx) * 360000).toLocaleString('id-ID'),
      nama: name,
      noAbsen: String(idx + 1).padStart(2, '0'),
      kelas: CONFIG.KELAS,
      tglLahir: '12 Mei 2014',
      benar: correctCount,
      salah: incorrectCount,
      nilai: finalScore,
      status: finalScore >= CONFIG.KKTP ? 'Lulus' : 'Belum Lulus',
      detailJawaban,
    };
  });
}
