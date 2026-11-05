import { Question } from '../types';

export type KompetensiIPAS =
  | 'Rangka & Alat Gerak Pasif'
  | 'Sendi & Mekanisme Gerak'
  | 'Otot & Kesehatan Organ Gerak';

// Alias backward-compatibility
export type KompetensiBahasaIndonesia = KompetensiIPAS | string;
export type ElemenMatematika = KompetensiIPAS | string;

export type LevelKognitif = 'L1 (Pemahaman)' | 'L2 (Aplikasi)' | 'L3 (Penalaran)';

export interface KisiKisiItem {
  noSoal: number;
  kompetensi: KompetensiIPAS | string;
  subkompetensi: string;
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  materiPokok: string;
  indikatorSoal: string;
  levelKognitif: LevelKognitif;
  bentukSoal: 'Pilihan Ganda' | 'Benar / Salah' | 'Pilihan Ganda Kompleks';
  kunciJawaban: string;
  bobotSkor: number;
  stimulusText?: string;
  illustrationKey?: string;
  elemen: string;
}

export interface KisiKisiSummary {
  totalSoal: number;
  distribusiKompetensi: {
    rangkaPasif: number;
    sendiGerak: number;
    ototKesehatan: number;
    pemahamanTekstual?: number;
    pemahamanInferensial?: number;
    evaluasiDanApresiasi?: number;
    [key: string]: number | undefined;
  };
  distribusiLevel: {
    l1: number;
    l2: number;
    l3: number;
  };
  distribusiBentuk: {
    pg: number;
    benarSalah: number;
    pgk: number;
  };
  distribusiKesukaran: {
    mudah: number;
    sedang: number;
    sukar: number;
  };
  items: KisiKisiItem[];
  distribusiElemen: {
    [key: string]: number;
  };
}

/**
 * Data Master Matriks Kisi-Kisi Penulisan Soal Tes Sumatif IPAS
 * Lingkup Materi: Rangka, Sendi, dan Otot (Alat Gerak Aktif dan Pasif)
 */
export const KISI_KISI_MASTER: Record<
  number,
  Omit<KisiKisiItem, 'noSoal' | 'kunciJawaban' | 'bentukSoal' | 'stimulusText' | 'illustrationKey' | 'elemen'>
> = {
  // =========================================================================
  // NO 1 - 18: PILIHAN GANDA (18 BUTIR: 6 MUDAH, 6 SEDANG, 6 SUKAR)
  // =========================================================================
  1: {
    kompetensi: 'Rangka & Alat Gerak Pasif',
    subkompetensi: 'Memahami konsep tulang sebagai alat gerak pasif',
    capaianPembelajaran: 'Peserta didik memahami peranan organ rangka dan otot dalam sistem gerak manusia',
    tujuanPembelajaran: 'Peserta didik mampu menjelaskan alasan tulang disebut alat gerak pasif',
    materiPokok: 'Alat Gerak Pasif pada Tubuh Manusia',
    indikatorSoal: 'Disajikan konsep sistem gerak, peserta didik dapat menentukan alasan tulang disebut sebagai alat gerak pasif',
    levelKognitif: 'L1 (Pemahaman)',
    bobotSkor: 1,
  },
  2: {
    kompetensi: 'Rangka & Alat Gerak Pasif',
    subkompetensi: 'Mengidentifikasi fungsi rangka kepala (tengkorak)',
    capaianPembelajaran: 'Peserta didik mengidentifikasi fungsi perlindungan rangka terhadap organ vital dalam',
    tujuanPembelajaran: 'Peserta didik mampu menyebutkan organ dalam yang dilindungi rongga tengkorak',
    materiPokok: 'Rangka Kepala dan Perlindungan Organ Vital',
    indikatorSoal: 'Disajikan deskripsi tulang tengkorak, peserta didik dapat menentukan organ vital yang dilindunginya',
    levelKognitif: 'L1 (Pemahaman)',
    bobotSkor: 1,
  },
  3: {
    kompetensi: 'Rangka & Alat Gerak Pasif',
    subkompetensi: 'Menganalisis bagian rangka badan dan organ vital yang dilindungi',
    capaianPembelajaran: 'Peserta didik mampu mengelompokkan bagian rangka tubuh dan fungsi protektifnya',
    tujuanPembelajaran: 'Peserta didik mampu mengidentifikasi organ dalam sangkar tulang rusuk dan dada',
    materiPokok: 'Bagian Rangka Manusia dan Perlindungan Organ Dalam',
    indikatorSoal: 'Disajikan bagan bagian rangka manusia, peserta didik dapat menentukan pasangan organ yang dilindungi tulang rusuk dan dada',
    levelKognitif: 'L2 (Aplikasi)',
    bobotSkor: 1,
  },
  4: {
    kompetensi: 'Otot & Kesehatan Organ Gerak',
    subkompetensi: 'Memahami konsep otot sebagai alat gerak aktif',
    capaianPembelajaran: 'Peserta didik memahami sifat dan kemampuan jaringan otot dalam sistem lokomosi',
    tujuanPembelajaran: 'Peserta didik mampu menjelaskan kemampuan khusus otot sebagai alat gerak aktif',
    materiPokok: 'Alat Gerak Aktif pada Tubuh Manusia',
    indikatorSoal: 'Disajikan konsep lokomosi, peserta didik dapat menjelaskan alasan otot disebut alat gerak aktif',
    levelKognitif: 'L1 (Pemahaman)',
    bobotSkor: 1,
  },
  5: {
    kompetensi: 'Otot & Kesehatan Organ Gerak',
    subkompetensi: 'Mengidentifikasi jaringan penghubung otot dan tulang (tendon)',
    capaianPembelajaran: 'Peserta didik menganalisis keterkaitan jaringan penunjang gerak tubuh',
    tujuanPembelajaran: 'Peserta didik mampu mengidentifikasi jaringan tendon sebagai penghubung otot dengan tulang',
    materiPokok: 'Hubungan Rangka, Otot, dan Jaringan Tendon',
    indikatorSoal: 'Disajikan bagan hubungan otot dan tulang, peserta didik dapat menentukan nama jaringan pengikat otot ke tulang',
    levelKognitif: 'L2 (Aplikasi)',
    bobotSkor: 1,
  },
  6: {
    kompetensi: 'Rangka & Alat Gerak Pasif',
    subkompetensi: 'Membedakan karakteristik tulang rawan dan tulang keras',
    capaianPembelajaran: 'Peserta didik mampu menganalisis struktur jaringan penyusun tulang pada manusia',
    tujuanPembelajaran: 'Peserta didik mampu mengidentifikasi organ tubuh yang tersusun atas tulang rawan elastis',
    materiPokok: 'Perbedaan Tulang Rawan dan Tulang Keras',
    indikatorSoal: 'Disajikan karakteristik jenis tulang, peserta didik dapat menentukan bagian tubuh yang tersusun atas tulang rawan hingga dewasa',
    levelKognitif: 'L3 (Penalaran)',
    bobotSkor: 1,
  },
  7: {
    kompetensi: 'Rangka & Alat Gerak Pasif',
    subkompetensi: 'Memahami fungsi utama sistem rangka tubuh',
    capaianPembelajaran: 'Peserta didik memahami fungsi rangka secara komprehensif bagi tubuh manusia',
    tujuanPembelajaran: 'Peserta didik mampu menyebutkan fungsi penegak dan pemberi bentuk tubuh',
    materiPokok: 'Fungsi Utama Sistem Rangka Manusia',
    indikatorSoal: 'Disajikan fungsi organ tubuh, peserta didik dapat menentukan fungsi rangka sebagai penegak dan pemberi bentuk',
    levelKognitif: 'L1 (Pemahaman)',
    bobotSkor: 1,
  },
  8: {
    kompetensi: 'Otot & Kesehatan Organ Gerak',
    subkompetensi: 'Menganalisis mekanisme kerja otot antagonis bisep dan trisep',
    capaianPembelajaran: 'Peserta didik mampu mendemonstrasikan dan menjelaskan gerak fleksi dan ekstensi lengan',
    tujuanPembelajaran: 'Peserta didik mampu menentukan kondisi kontraksi/relaksasi bisep dan trisep saat menekuk siku',
    materiPokok: 'Kerja Otot Antagonis: Bisep dan Trisep',
    indikatorSoal: 'Disajikan gambar lengan menekuk siku, peserta didik dapat menganalisis keadaan otot bisep dan trisep secara tepat',
    levelKognitif: 'L2 (Aplikasi)',
    bobotSkor: 1,
  },
  9: {
    kompetensi: 'Otot & Kesehatan Organ Gerak',
    subkompetensi: 'Menganalisis kerja gerak otot sinergis',
    capaianPembelajaran: 'Peserta didik mampu membedakan gerak sinergis dan antagonis pada sistem otot',
    tujuanPembelajaran: 'Peserta didik mampu menganalisis gerak menelungkupkan tangan oleh otot pronator',
    materiPokok: 'Analisis Gerak Sinergis dan Antagonis Otot',
    indikatorSoal: 'Disajikan nama otot pronator teres dan kuadratus, peserta didik dapat menentukan arah gerakan sinergis yang dihasilkan',
    levelKognitif: 'L3 (Penalaran)',
    bobotSkor: 1,
  },
  10: {
    kompetensi: 'Sendi & Mekanisme Gerak',
    subkompetensi: 'Memahami definisi dan peranan persendian (artikulasi)',
    capaianPembelajaran: 'Peserta didik memahami konsep hubungan antartulang dalam pergerakan',
    tujuanPembelajaran: 'Peserta didik mampu menjelaskan pengertian persendian pada manusia',
    materiPokok: 'Konsep Dasar Persendian pada Manusia',
    indikatorSoal: 'Disajikan deskripsi hubungan antartulang, peserta didik dapat mengidentifikasi istilah persendian (artikulasi)',
    levelKognitif: 'L1 (Pemahaman)',
    bobotSkor: 1,
  },
  11: {
    kompetensi: 'Sendi & Mekanisme Gerak',
    subkompetensi: 'Mengidentifikasi sendi peluru dan arah gerakannya',
    capaianPembelajaran: 'Peserta didik mengidentifikasi jenis sendi gerak (diartrosis) berdasarkan arah gerakan',
    tujuanPembelajaran: 'Peserta didik mampu menentukan nama jenis sendi pada gelang panggul dan paha',
    materiPokok: 'Identifikasi Sendi Peluru dan Arah Gerakannya',
    indikatorSoal: 'Disajikan ilustrasi persendian gelang panggul dan paha, peserta didik dapat menentukan jenis sendi peluru',
    levelKognitif: 'L2 (Aplikasi)',
    bobotSkor: 1,
  },
  12: {
    kompetensi: 'Sendi & Mekanisme Gerak',
    subkompetensi: 'Menganalisis sendi putar pada leher dan kepala',
    capaianPembelajaran: 'Peserta didik mampu menganalisis mekanisme kerja sendi putar pada sumbu tubuh',
    tujuanPembelajaran: 'Peserta didik mampu menjelaskan sendi putar antara tulang atlas dan tengkorak',
    materiPokok: 'Sendi Putar dan Sendi Pelana',
    indikatorSoal: 'Disajikan gerak menolehkan kepala, peserta didik dapat menganalisis persendian dan pasangan tulang yang terlibat',
    levelKognitif: 'L3 (Penalaran)',
    bobotSkor: 1,
  },
  13: {
    kompetensi: 'Otot & Kesehatan Organ Gerak',
    subkompetensi: 'Memahami ciri morfologi dan sifat kerja otot lurik',
    capaianPembelajaran: 'Peserta didik mampu mengidentifikasi karakteristik 3 jenis jaringan otot',
    tujuanPembelajaran: 'Peserta didik mampu mengenali ciri-ciri khas otot lurik (otot rangka)',
    materiPokok: 'Karakteristik dan Ciri Otot Lurik (Otot Rangka)',
    indikatorSoal: 'Disajikan 4 ciri jaringan otot, peserta didik dapat mengidentifikasi ciri tersebut sebagai otot lurik',
    levelKognitif: 'L1 (Pemahaman)',
    bobotSkor: 1,
  },
  14: {
    kompetensi: 'Otot & Kesehatan Organ Gerak',
    subkompetensi: 'Mengidentifikasi letak dan cara kerja otot polos',
    capaianPembelajaran: 'Peserta didik mampu membedakan kerja otot volunter dan involunter',
    tujuanPembelajaran: 'Peserta didik mampu mengidentifikasi otot polos pada organ pencernaan',
    materiPokok: 'Ciri dan Cara Kerja Otot Polos',
    indikatorSoal: 'Disajikan bagan tiga jenis otot, peserta didik dapat menentukan jenis otot penyusun dinding organ lambung dan usus',
    levelKognitif: 'L2 (Aplikasi)',
    bobotSkor: 1,
  },
  15: {
    kompetensi: 'Otot & Kesehatan Organ Gerak',
    subkompetensi: 'Menganalisis faktor fisiologis penyebab kelelahan otot',
    capaianPembelajaran: 'Peserta didik mampu memahami proses biologis terjadinya kram dan kelelahan otot',
    tujuanPembelajaran: 'Peserta didik mampu menganalisis penimbunan asam laktat akibat respirasi anaerob',
    materiPokok: 'Fisiologi Kelelahan Otot dan Penumpukan Asam Laktat',
    indikatorSoal: 'Disajikan kasus kram otot saat lari tanpa pemanasan, peserta didik dapat menganalisis penyebab penumpukan asam laktat',
    levelKognitif: 'L3 (Penalaran)',
    bobotSkor: 1,
  },
  16: {
    kompetensi: 'Rangka & Alat Gerak Pasif',
    subkompetensi: 'Menganalisis kelainan bentuk tulang belakang',
    capaianPembelajaran: 'Peserta didik mampu mengidentifikasi kelainan rangka akibat postur kebiasaan buruk',
    tujuanPembelajaran: 'Peserta didik mampu membedakan kelainan skoliosis, kifosis, dan lordosis',
    materiPokok: 'Kelainan Tulang Belakang: Kifosis, Lordosis, Skoliosis',
    indikatorSoal: 'Disajikan diagram kelainan tulang belakang dan studi kasus posisi duduk miring, peserta didik dapat mengidentifikasi skoliosis',
    levelKognitif: 'L2 (Aplikasi)',
    bobotSkor: 1,
  },
  17: {
    kompetensi: 'Rangka & Alat Gerak Pasif',
    subkompetensi: 'Mendiagnosis kelainan osteoporosis pada sistem rangka',
    capaianPembelajaran: 'Peserta didik memahami penyakit sistem gerak dan penyebab biologisnya',
    tujuanPembelajaran: 'Peserta didik mampu menjelaskan proses pengeroposan massa tulang osteoporosis',
    materiPokok: 'Penyakit Tulang: Osteoporosis dan Rakitis',
    indikatorSoal: 'Disajikan riwayat medis nyeri tulang dan rapuh pada lansia, peserta didik dapat mendiagnosis osteoporosis',
    levelKognitif: 'L3 (Penalaran)',
    bobotSkor: 1,
  },
  18: {
    kompetensi: 'Rangka & Alat Gerak Pasif',
    subkompetensi: 'Mengevaluasi tindakan pertolongan pertama fraktura tulang',
    capaianPembelajaran: 'Peserta didik mampu menerapkan prinsip pertolongan pertama kegawatdaruratan patah tulang',
    tujuanPembelajaran: 'Peserta didik mampu menentukan prosedur pembidaian (spalk) yang benar',
    materiPokok: 'Pertolongan Pertama pada Cedera Patah Tulang (Fraktura)',
    indikatorSoal: 'Disajikan skenario cedera fraktura tertutup di lapangan, peserta didik dapat mengevaluasi tindakan pertolongan pertama pembidaian yang aman',
    levelKognitif: 'L3 (Penalaran)',
    bobotSkor: 1,
  },

  // =========================================================================
  // NO 19 - 21: PILIHAN GANDA KOMPLEKS (3 BUTIR: 1 MUDAH, 1 SEDANG, 1 SUKAR)
  // =========================================================================
  19: {
    kompetensi: 'Rangka & Alat Gerak Pasif',
    subkompetensi: 'Menganalisis ragam fungsi rangka tubuh (PGK)',
    capaianPembelajaran: 'Peserta didik memahami peranan multi-fungsi rangka tubuh',
    tujuanPembelajaran: 'Peserta didik mampu memilih pernyataan yang tepat mengenai fungsi rangka',
    materiPokok: 'Fungsi Penting Rangka Tubuh Manusia',
    indikatorSoal: 'Disajikan 3 pernyataan fungsi organ, peserta didik dapat memilih fungsi rangka yang benar',
    levelKognitif: 'L1 (Pemahaman)',
    bobotSkor: 1,
  },
  20: {
    kompetensi: 'Sendi & Mekanisme Gerak',
    subkompetensi: 'Menganalisis koordinasi persendian gerak olahraga (PGK)',
    capaianPembelajaran: 'Peserta didik mampu mengintegrasikan konsep sendi peluru dan engsel saat berolahraga',
    tujuanPembelajaran: 'Peserta didik mampu menentukan sendi yang aktif pada tungkai bawah saat menendang',
    materiPokok: 'Koordinasi Persendian saat Berolahraga',
    indikatorSoal: 'Disajikan ilustrasi gerakan menendang bola, peserta didik dapat memilih sendi peluru dan engsel yang terlibat',
    levelKognitif: 'L2 (Aplikasi)',
    bobotSkor: 1,
  },
  21: {
    kompetensi: 'Otot & Kesehatan Organ Gerak',
    subkompetensi: 'Membandingkan karakteristik otot polos dan jantung (PGK)',
    capaianPembelajaran: 'Peserta didik mampu menganalisis persamaan dan perbedaan sifat otot involunter',
    tujuanPembelajaran: 'Peserta didik mampu memilih karakteristik benar dari otot polos dan otot jantung',
    materiPokok: 'Karakteristik Otot Polos dan Otot Jantung',
    indikatorSoal: 'Disajikan 3 karakteristik jaringan otot, peserta didik dapat memilih sifat otot polos dan otot jantung yang benar',
    levelKognitif: 'L3 (Penalaran)',
    bobotSkor: 1,
  },

  // =========================================================================
  // NO 22 - 30: BENAR / SALAH (9 BUTIR: 3 MUDAH, 3 SEDANG, 3 SUKAR)
  // =========================================================================
  22: {
    kompetensi: 'Rangka & Alat Gerak Pasif',
    subkompetensi: 'Memverifikasi konsep alat gerak aktif dan pasif (Benar/Salah)',
    capaianPembelajaran: 'Peserta didik mampu mengevaluasi pernyataan ilmiah sistem gerak',
    tujuanPembelajaran: 'Peserta didik mampu memverifikasi sifat gerak pasif tulang dan gerak aktif otot',
    materiPokok: 'Konsep Alat Gerak Aktif dan Pasif',
    indikatorSoal: 'Disajikan 3 pernyataan interaksi tulang dan otot, peserta didik dapat menentukan kebenaran (Benar/Salah)',
    levelKognitif: 'L1 (Pemahaman)',
    bobotSkor: 1,
  },
  23: {
    kompetensi: 'Rangka & Alat Gerak Pasif',
    subkompetensi: 'Mengevaluasi postur duduk ergonomis di meja belajar (Benar/Salah)',
    capaianPembelajaran: 'Peserta didik mampu membiasakan postur tubuh sehat dalam kehidupan sehari-hari',
    tujuanPembelajaran: 'Peserta didik mampu menilai kebiasaan duduk benar vs salah terhadap tulang belakang',
    materiPokok: 'Postur Sikap Duduk Ergonomis untuk Tulang Belakang',
    indikatorSoal: 'Disajikan infografik postur duduk, peserta didik dapat memvalidasi 3 pernyataan sikap tubuh',
    levelKognitif: 'L2 (Aplikasi)',
    bobotSkor: 1,
  },
  24: {
    kompetensi: 'Sendi & Mekanisme Gerak',
    subkompetensi: 'Menganalisis klasifikasi sinartrosis, amfiartrosis, dan diartrosis (Benar/Salah)',
    capaianPembelajaran: 'Peserta didik mampu membedakan persendian berdasarkan keleluasaan gerakan',
    tujuanPembelajaran: 'Peserta didik mampu memverifikasi sifat sendi mati, kaku, dan gerak',
    materiPokok: 'Klasifikasi Hubungan Antartulang',
    indikatorSoal: 'Disajikan 3 pernyataan klasifikasi sendi tubuh, peserta didik dapat memvalidasi kebenarannya',
    levelKognitif: 'L3 (Penalaran)',
    bobotSkor: 1,
  },
  25: {
    kompetensi: 'Rangka & Alat Gerak Pasif',
    subkompetensi: 'Mengelompokkan tulang kepala, badan, dan anggota gerak (Benar/Salah)',
    capaianPembelajaran: 'Peserta didik mampu mengenali anatomi tulang manusia secara akurat',
    tujuanPembelajaran: 'Peserta didik mampu memverifikasi pengelompokan tulang tubuh',
    materiPokok: 'Susunan Tulang Rangka Kepala dan Anggota Gerak',
    indikatorSoal: 'Disajikan 3 pengelompokan nama tulang, peserta didik dapat memverifikasi kebenarannya',
    levelKognitif: 'L1 (Pemahaman)',
    bobotSkor: 1,
  },
  26: {
    kompetensi: 'Otot & Kesehatan Organ Gerak',
    subkompetensi: 'Menganalisis mekanisme kontraksi dan relaksasi serabut otot (Benar/Salah)',
    capaianPembelajaran: 'Peserta didik memahami proses fisik perubahan bentuk otot saat bekerja',
    tujuanPembelajaran: 'Peserta didik mampu menilai deskripsi pemendekan serabut otot',
    materiPokok: 'Mekanisme Kontraksi dan Relaksasi Otot',
    indikatorSoal: 'Disajikan 3 pernyataan sifat kerja otot, peserta didik dapat menentukan nilai kebenarannya',
    levelKognitif: 'L2 (Aplikasi)',
    bobotSkor: 1,
  },
  27: {
    kompetensi: 'Rangka & Alat Gerak Pasif',
    subkompetensi: 'Mengevaluasi nutrisi dan pembiasaan hidup sehat tulang (Benar/Salah)',
    capaianPembelajaran: 'Peserta didik menerapkan pola makan bergizi dan aktivitas fisik untuk rangka',
    tujuanPembelajaran: 'Peserta didik mampu menilai peran kalsium, vitamin D, dan olahraga',
    materiPokok: 'Nutrisi dan Pembiasaan Hidup Sehat untuk Tulang dan Otot',
    indikatorSoal: 'Disajikan diagram 4 pilar kesehatan tulang, peserta didik dapat memvalidasi 3 pernyataan gaya hidup',
    levelKognitif: 'L2 (Aplikasi)',
    bobotSkor: 1,
  },
  28: {
    kompetensi: 'Otot & Kesehatan Organ Gerak',
    subkompetensi: 'Menganalisis kelainan otot atrofi, tetanus, dan hipertrofi (Benar/Salah)',
    capaianPembelajaran: 'Peserta didik memahami patologi dan kelainan pada sistem muskular',
    tujuanPembelajaran: 'Peserta didik mampu membedakan penyebab dan gejala kelainan otot',
    materiPokok: 'Kelainan Sistem Otot: Atrofi, Hipertrofi, dan Tetanus',
    indikatorSoal: 'Disajikan 3 deskripsi kelainan otot manusia, peserta didik dapat menganalisis kebenarannya',
    levelKognitif: 'L3 (Penalaran)',
    bobotSkor: 1,
  },
  29: {
    kompetensi: 'Sendi & Mekanisme Gerak',
    subkompetensi: 'Memahami fungsi cairan sinovial, tulang rawan, dan ligamen (Benar/Salah)',
    capaianPembelajaran: 'Peserta didik memahami anatomi pelindung persendian diartrosis',
    tujuanPembelajaran: 'Peserta didik mampu memverifikasi peranan pelumas sinovial dan ligamen',
    materiPokok: 'Struktur Pelindung dan Pelumas Persendian',
    indikatorSoal: 'Disajikan 3 fungsi struktur persendian, peserta didik dapat memvalidasi kebenarannya',
    levelKognitif: 'L1 (Pemahaman)',
    bobotSkor: 1,
  },
  30: {
    kompetensi: 'Otot & Kesehatan Organ Gerak',
    subkompetensi: 'Mengevaluasi protokol RICE untuk cedera terkilir (Benar/Salah)',
    capaianPembelajaran: 'Peserta didik mampu menerapkan prinsip pertolongan pertama cedera olahraga',
    tujuanPembelajaran: 'Peserta didik mampu memvalidasi langkah Rest, Ice, Compression, dan Elevation',
    materiPokok: 'Tindakan Pertolongan Pertama Cedera Sendi dan Otot (Metode RICE)',
    indikatorSoal: 'Disajikan 3 langkah penanganan cedera sprain, peserta didik dapat mengevaluasi kebenarannya',
    levelKognitif: 'L3 (Penalaran)',
    bobotSkor: 1,
  },
};

/**
 * Menghasilkan data instrumen kisi-kisi terintegrasi secara otomatis
 */
export function buildKisiKisiItems(questions: Question[]): KisiKisiSummary {
  const items: KisiKisiItem[] = questions.map((q, idx) => {
    const noSoal = idx + 1;
    const master =
      KISI_KISI_MASTER[noSoal] || {
        kompetensi: 'Rangka & Alat Gerak Pasif' as KompetensiIPAS,
        subkompetensi: 'Mengidentifikasi sistem organ gerak pada manusia',
        capaianPembelajaran: 'Peserta didik memahami sistem gerak aktif dan pasif manusia',
        tujuanPembelajaran: 'Peserta didik mampu menganalisis mekanisme gerak manusia',
        materiPokok: q.topic || 'Rangka, Sendi, dan Otot',
        indikatorSoal: `Disajikan stimulus soal nomor ${noSoal}, peserta didik dapat menjawab pertanyaan dengan tepat.`,
        levelKognitif: 'L2 (Aplikasi)' as LevelKognitif,
        bobotSkor: 1,
      };

    let bentukSoal: 'Pilihan Ganda' | 'Benar / Salah' | 'Pilihan Ganda Kompleks' = 'Pilihan Ganda';
    if (q.type === 'pgk_kategori') {
      bentukSoal = 'Benar / Salah';
    } else if (q.type === 'pgk') {
      bentukSoal = 'Pilihan Ganda Kompleks';
    }

    let kunciJawaban = '-';
    if (q.type === 'pg') {
      const optText = q.options?.find((o) => o.id === q.correctAnswer)?.text;
      kunciJawaban = optText ? `${q.correctAnswer} (${optText})` : String(q.correctAnswer || 'A');
    } else if (q.type === 'pgk_kategori') {
      const st = q.statements || [];
      const parts = st.map((s, sIdx) => `P${sIdx + 1}: ${s.correctAnswer ? 'BENAR' : 'SALAH'}`);
      kunciJawaban = parts.join(' | ') || 'P1:B | P2:B | P3:S';
    } else if (q.type === 'pgk') {
      const arr = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
      kunciJawaban = `Opsi ${arr.join(' dan ')}`;
    }

    return {
      noSoal,
      kompetensi: master.kompetensi,
      subkompetensi: master.subkompetensi,
      capaianPembelajaran: master.capaianPembelajaran,
      tujuanPembelajaran: master.tujuanPembelajaran,
      materiPokok: q.topic || master.materiPokok,
      indikatorSoal: master.indikatorSoal,
      levelKognitif: master.levelKognitif,
      bentukSoal,
      kunciJawaban,
      bobotSkor: master.bobotSkor,
      stimulusText: q.text,
      illustrationKey: q.illustrationKey,
      elemen: master.kompetensi,
    };
  });

  const rangkaCount = items.filter((i) => i.kompetensi === 'Rangka & Alat Gerak Pasif').length;
  const sendiCount = items.filter((i) => i.kompetensi === 'Sendi & Mekanisme Gerak').length;
  const ototCount = items.filter((i) => i.kompetensi === 'Otot & Kesehatan Organ Gerak').length;

  const distribusiKompetensi = {
    rangkaPasif: rangkaCount,
    sendiGerak: sendiCount,
    ototKesehatan: ototCount,
    pemahamanTekstual: rangkaCount,
    pemahamanInferensial: sendiCount,
    evaluasiDanApresiasi: ototCount,
  };

  const distribusiLevel = {
    l1: items.filter((i) => i.levelKognitif.startsWith('L1')).length,
    l2: items.filter((i) => i.levelKognitif.startsWith('L2')).length,
    l3: items.filter((i) => i.levelKognitif.startsWith('L3')).length,
  };

  const distribusiBentuk = {
    pg: items.filter((i) => i.bentukSoal === 'Pilihan Ganda').length,
    benarSalah: items.filter((i) => i.bentukSoal === 'Benar / Salah').length,
    pgk: items.filter((i) => i.bentukSoal === 'Pilihan Ganda Kompleks').length,
  };

  const distribusiKesukaran = {
    mudah: questions.filter((q) => q.difficulty === 'Mudah').length || 10,
    sedang: questions.filter((q) => q.difficulty === 'Sedang').length || 10,
    sukar: questions.filter((q) => q.difficulty === 'Sukar').length || 10,
  };

  return {
    totalSoal: items.length,
    distribusiKompetensi,
    distribusiLevel,
    distribusiBentuk,
    distribusiKesukaran,
    items,
    distribusiElemen: {
      'Rangka & Alat Gerak Pasif': rangkaCount,
      'Sendi & Mekanisme Gerak': sendiCount,
      'Otot & Kesehatan Organ Gerak': ototCount,
      pemahamanTekstual: rangkaCount,
      pemahamanInferensial: sendiCount,
      evaluasiDanApresiasi: ototCount,
    },
  };
}
