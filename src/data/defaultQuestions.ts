import { Question } from '../types';

export const INITIAL_QUESTIONS: Question[] = [
  // =========================================================================
  // BAGIAN 1: PILIHAN GANDA (18 SOAL: NO 1 - 18)
  // Komposisi Tingkat Kesukaran: 6 Mudah, 6 Sedang, 6 Sukar
  // =========================================================================
  {
    id: 1,
    type: 'pg',
    topic: 'Alat Gerak Pasif pada Tubuh Manusia',
    difficulty: 'Mudah',
    text: 'Dalam sistem gerak manusia, tulang disebut sebagai alat gerak pasif karena ...',
    options: [
      { id: 'A', text: 'Tulang tidak dapat bergerak sendiri tanpa adanya tarikan dari kontraksi otot' },
      { id: 'B', text: 'Tulang hanya berfungsi sebagai tempat penimbunan zat kalsium dan lemak' },
      { id: 'C', text: 'Tulang tidak memiliki pembuluh darah dan jaringan saraf yang hidup' },
      { id: 'D', text: 'Tulang dapat bergerak otomatis meskipun tidak ada energi di dalam sel' },
    ],
    correctAnswer: 'A',
    explanation:
      'Tulang disebut sebagai alat gerak pasif karena tulang tidak mempunyai kemampuan untuk menggerakkan dirinya sendiri. Gerakan tulang terjadi akibat tarikan dan kontraksi dari otot yang melekat padanya sebagai alat gerak aktif.',
  },
  {
    id: 2,
    type: 'pg',
    topic: 'Rangka Kepala dan Perlindungan Organ Vital',
    difficulty: 'Mudah',
    text: 'Rangka kepala manusia (tengkorak) tersusun dari tulang-tulang pipih yang saling bertautan rapat. Organ vital manusia yang dilindungi oleh rongga tulang tengkorak adalah ...',
    options: [
      { id: 'A', text: 'Otak besar dan otak kecil sebagai pusat saraf' },
      { id: 'B', text: 'Jantung dan pembuluh darah aorta utama' },
      { id: 'C', text: 'Paru-paru kanan dan paru-paru kiri' },
      { id: 'D', text: 'Lambung dan usus halus pencernaan' },
    ],
    correctAnswer: 'A',
    explanation:
      'Fungsi utama tulang tengkorak (tempurung kepala) adalah membungkus dan melindungi jaringan lunak otak (otak besar, otak kecil, dan batang otak) dari benturan fisik mekanis yang berbahaya.',
  },
  {
    id: 3,
    type: 'pg',
    topic: 'Bagian Rangka Manusia dan Perlindungan Organ Dalam',
    difficulty: 'Sedang',
    illustrationKey: 'bagan_bagian_rangka_manusia',
    text: 'Perhatikan bagan pembagian tiga bagian rangka tubuh manusia di atas!\nRangka badan manusia tersusun atas tulang dada, tulang rusuk, dan tulang belakang. Pasangan organ dalam yang dilindungi secara bersama-sama oleh sangkar tulang rusuk dan tulang dada adalah ...',
    options: [
      { id: 'A', text: 'Jantung dan paru-paru' },
      { id: 'B', text: 'Otak besar dan bola mata' },
      { id: 'C', text: 'Ginjal dan usus besar' },
      { id: 'D', text: 'Kantong kemih dan lambung' },
    ],
    correctAnswer: 'A',
    explanation:
      'Tulang dada dan 12 pasang tulang rusuk membentuk rongga dada (sangkar toraks) yang memiliki fungsi vital melindungi organ pernapasan (paru-paru) dan organ peredaran darah (jantung) dari benturan.',
  },
  {
    id: 4,
    type: 'pg',
    topic: 'Alat Gerak Aktif pada Tubuh Manusia',
    difficulty: 'Mudah',
    text: 'Otot disebut sebagai alat gerak aktif pada tubuh manusia karena memiliki kemampuan khusus untuk ...',
    options: [
      { id: 'A', text: 'Melakukan kontraksi (memendek) dan relaksasi (mengendur)' },
      { id: 'B', text: 'Menghasilkan sel-sel darah merah di dalam sumsumnya' },
      { id: 'C', text: 'Menyimpan cadangan mineral kalsium dan fosfor tubuh' },
      { id: 'D', text: 'Membentuk kerangka tubuh yang kaku dan tidak elastis' },
    ],
    correctAnswer: 'A',
    explanation:
      'Otot disebut alat gerak aktif karena serabut-serabut otot memiliki protein aktin dan miosin yang dapat berkontraksi (memendek dan menebal) serta berelaksasi (mengendur dan memanjang) untuk menghasilkan gerakan.',
  },
  {
    id: 5,
    type: 'pg',
    topic: 'Hubungan Rangka, Otot, dan Jaringan Tendon',
    difficulty: 'Sedang',
    illustrationKey: 'bagan_gerak_aktif_pasif',
    text: 'Perhatikan bagan mekanisme kerja sama sistem gerak pada gambar di atas!\nAgar tarikan tenaga kontraksi otot dapat menggerakkan tulang rangka, ujung otot harus melekat erat pada permukaan tulang. Jaringan ikat padat dan liat yang menghubungkan ujung otot dengan tulang disebut ...',
    options: [
      { id: 'A', text: 'Tendon (urat otot)' },
      { id: 'B', text: 'Ligamen pembungkus sendi' },
      { id: 'C', text: 'Minyak sinovial pelumas' },
      { id: 'D', text: 'Cairan sumsum merah tulang' },
    ],
    correctAnswer: 'A',
    explanation:
      'Tendon adalah jaringan ikat serabut kolagen yang sangat kuat, liat, dan padat yang berfungsi menghubungkan jaringan otot dengan tulang sehingga tarikan otot dapat diteruskan menjadi gerakan tulang.',
  },
  {
    id: 6,
    type: 'pg',
    topic: 'Perbedaan Tulang Rawan dan Tulang Keras',
    difficulty: 'Sukar',
    text: 'Berdasarkan zat penyusunnya, tulang dibedakan menjadi tulang rawan (kartilago) dan tulang keras (osteon). Bagian tubuh manusia yang seluruhnya tetap tersusun dari tulang rawan elastis hingga dewasa adalah ...',
    options: [
      { id: 'A', text: 'Daun telinga dan ujung hidung' },
      { id: 'B', text: 'Tulang paha dan tulang betis' },
      { id: 'C', text: 'Tulang tengkorak dan tulang rahang' },
      { id: 'D', text: 'Tulang pengumpil dan tulang hasta' },
    ],
    correctAnswer: 'A',
    explanation:
      'Daun telinga, ujung hidung, dan epiglotis tersusun atas tulang rawan (kartilago elastis) yang banyak mengandung serabut elastin dan kolagen tanpa endapan kalsium padat, sehingga bersifat lentur dan fleksibel seumur hidup.',
  },
  {
    id: 7,
    type: 'pg',
    topic: 'Fungsi Utama Sistem Rangka Manusia',
    difficulty: 'Mudah',
    text: 'Selain berfungsi dalam pergerakan tubuh, fungsi penting lain dari rangka manusia adalah sebagai ...',
    options: [
      { id: 'A', text: 'Penegak dan pemberi bentuk dasar tubuh manusia' },
      { id: 'B', text: 'Penyalur zat makanan ke seluruh sel-sel darah' },
      { id: 'C', text: 'Pengatur suhu tubuh saat berada di udara dingin' },
      { id: 'D', text: 'Penghasil hormon pengatur denyut otot jantung' },
    ],
    correctAnswer: 'A',
    explanation:
      'Tanpa adanya susunan rangka, tubuh manusia akan berbentuk gumpalan daging tanpa bentuk tetap. Rangka bertindak sebagai pilar penyangga penegak tubuh serta pemberi bentuk tubuh yang khas.',
  },
  {
    id: 8,
    type: 'pg',
    topic: 'Kerja Otot Antagonis: Bisep dan Trisep',
    difficulty: 'Sedang',
    illustrationKey: 'bagan_otot_bisep_trisep',
    text: 'Perhatikan gambar mekanisme kerja otot bisep dan trisep pada lengan atas di atas!\nKetika seseorang menekuk lengan bawahnya ke arah atas (gerakan fleksi), kondisi otot bisep dan otot trisep yang tepat adalah ...',
    options: [
      { id: 'A', text: 'Otot bisep berkontraksi (memendek), sedangkan otot trisep berelaksasi (memanjang)' },
      { id: 'B', text: 'Otot bisep berelaksasi (memanjang), sedangkan otot trisep berkontraksi (memendek)' },
      { id: 'C', text: 'Kedua otot bisep dan trisep sama-sama berkontraksi kuat secara bersamaan' },
      { id: 'D', text: 'Kedua otot bisep dan trisep sama-sama berelaksasi lemas tanpa tegangan' },
    ],
    correctAnswer: 'A',
    explanation:
      'Kerja otot bisep dan trisep bersifat antagonis (berlawanan). Saat menekuk siku, otot bisep di lengan depan berkontraksi menarik tulang pengumpil, sementara otot trisep di lengan belakang berelaksasi mengendur.',
  },
  {
    id: 9,
    type: 'pg',
    topic: 'Analisis Gerak Sinergis dan Antagonis Otot',
    difficulty: 'Sukar',
    text: 'Otot pronator teres dan pronator kuadratus yang berada pada lengan bawah bekerja bersama-sama secara sinergis. Gerakan yang dihasilkan oleh kerja sama otot pronator tersebut adalah ...',
    options: [
      { id: 'A', text: 'Menelungkupkan telapak tangan ke arah bawah' },
      { id: 'B', text: 'Menengadahkan telapak tangan ke arah atas' },
      { id: 'C', text: 'Mengangkat lengan menjauhi sumbu tubuh' },
      { id: 'D', text: 'Menekuk sendi lutut ke arah belakang paha' },
    ],
    correctAnswer: 'A',
    explanation:
      'Gerak sinergis adalah kerja dua otot atau lebih yang searah. Otot pronator teres dan otot pronator kuadratus bekerja bersama untuk memutar lengan bawah sehingga telapak tangan menelungkup (menghadap ke bawah).',
  },
  {
    id: 10,
    type: 'pg',
    topic: 'Konsep Dasar Persendian pada Manusia',
    difficulty: 'Mudah',
    text: 'Hubungan antartulang yang satu dengan tulang lainnya sehingga memungkinkan terjadinya pergerakan pada bagian tubuh disebut ...',
    options: [
      { id: 'A', text: 'Sendi (artikulasi)' },
      { id: 'B', text: 'Fasia (selaput otot)' },
      { id: 'C', text: 'Tendon (urat liat)' },
      { id: 'D', text: 'Periosteum (selaput tulang)' },
    ],
    correctAnswer: 'A',
    explanation:
      'Sendi atau artikulasi adalah struktur penghubung tempat bertemunya dua atau lebih tulang pada tubuh manusia yang memungkinkan terjadinya fleksibilitas dan pergerakan rangka.',
  },
  {
    id: 11,
    type: 'pg',
    topic: 'Identifikasi Sendi Peluru dan Arah Gerakannya',
    difficulty: 'Sedang',
    illustrationKey: 'bagan_jenis_jenis_sendi',
    text: 'Perhatikan diagram ragam sendi gerak pada gambar di atas!\nPersendian yang menghubungkan bonggol tulang paha dengan mangkuk gelang panggul mampu melakukan gerakan berputar bebas ke segala arah. Persendian ini tergolong ke dalam jenis ...',
    options: [
      { id: 'A', text: 'Sendi peluru' },
      { id: 'B', text: 'Sendi engsel' },
      { id: 'C', text: 'Sendi pelana' },
      { id: 'D', text: 'Sendi putar' },
    ],
    correctAnswer: 'A',
    explanation:
      'Sendi peluru (ball and socket joint) memiliki ujung berbentuk bonggol bulat yang masuk ke dalam rongga cekung mangkuk sendi, memungkinkan gerakan ke segala arah (contoh: gelang bahu-lengan atas dan gelang panggul-paha).',
  },
  {
    id: 12,
    type: 'pg',
    topic: 'Sendi Putar dan Sendi Pelana',
    difficulty: 'Sukar',
    text: 'Saat kita menolehkan kepala ke kiri dan ke kanan, terjadi gerakan memutar di bagian leher atas. Persendian dan pasangan tulang yang memungkinkan gerakan rotasi kepala tersebut adalah ...',
    options: [
      { id: 'A', text: 'Sendi putar antara tulang atlas (leher pertama) dan tulang tengkorak' },
      { id: 'B', text: 'Sendi engsel antara tulang rahang bawah dan tulang pelipis' },
      { id: 'C', text: 'Sendi peluru antara tulang leher dan tulang selangka dada' },
      { id: 'D', text: 'Sendi geser antara tulang rusuk pertama dan tulang dada' },
    ],
    correctAnswer: 'A',
    explanation:
      'Gerakan menggeleng dan memutar kepala dimungkinkan oleh adanya sendi putar (pivot joint) di antara tulang atlas (ruas tulang leher pertama) dengan tulang tengkorak, di mana satu tulang berfungsi sebagai poros putaran.',
  },
  {
    id: 13,
    type: 'pg',
    topic: 'Karakteristik dan Ciri Otot Lurik (Otot Rangka)',
    difficulty: 'Mudah',
    text: 'Cermatilah ciri-ciri jaringan otot berikut:\n1) Bentuk sel silindris memanjang dengan corak garis terang dan gelap\n2) Memiliki banyak inti sel (nukleus) yang terletak di tepi sel\n3) Bekerja secara sadar di bawah pengaruh perintah otak\n4) Melekat langsung pada tulang rangka tubuh\nCiri-ciri tersebut merupakan karakteristik dari ...',
    options: [
      { id: 'A', text: 'Otot lurik (otot rangka)' },
      { id: 'B', text: 'Otot polos pada lambung' },
      { id: 'C', text: 'Otot miokardium jantung' },
      { id: 'D', text: 'Otot pembuluh darah arteri' },
    ],
    correctAnswer: 'A',
    explanation:
      'Otot lurik atau otot rangka memiliki bentuk silindris panjang bergaris melintang (lurik), inti sel banyak di tepi, bekerja di bawah kehendak otak (sadar/volunter), dan melekat pada rangka tubuh.',
  },
  {
    id: 14,
    type: 'pg',
    topic: 'Ciri dan Cara Kerja Otot Polos',
    difficulty: 'Sedang',
    illustrationKey: 'bagan_tiga_jenis_otot',
    text: 'Perhatikan bagan karakteristik tiga jenis otot pada gambar di atas!\nOrgan lambung dan usus halus dapat mencerna serta meremas makanan secara otomatis tanpa kita sadari maupun tanpa rasa lelah. Jenis jaringan otot yang menyusun dinding organ pencernaan tersebut adalah ...',
    options: [
      { id: 'A', text: 'Otot polos yang berinti satu di tengah dan bekerja tidak sadar' },
      { id: 'B', text: 'Otot lurik yang berinti banyak di tepi dan bekerja cepat lelah' },
      { id: 'C', text: 'Otot jantung yang bercabang dan hanya bekerja saat tidur' },
      { id: 'D', text: 'Otot rangka yang digerakkan oleh kehendak saraf sadar' },
    ],
    correctAnswer: 'A',
    explanation:
      'Dinding organ pencernaan seperti lambung dan usus tersusun atas otot polos (smooth muscle). Berbentuk gelendong dengan satu inti di tengah, bekerja lambat, teratur, tidak mudah lelah, dan di luar kehendak (involunter).',
  },
  {
    id: 15,
    type: 'pg',
    topic: 'Fisiologi Kelelahan Otot dan Penumpukan Asam Laktat',
    difficulty: 'Sukar',
    text: 'Setelah berlari cepat menempuh jarak jauh tanpa melakukan pemanasan terlebih dahulu, betis Made terasa kaku, pegal, dan mengalami kram otot yang nyeri. Penyebab utama kram dan kelelahan otot tersebut adalah ...',
    options: [
      { id: 'A', text: 'Penumpukan asam laktat akibat respirasi anaerob di sel otot saat kekurangan oksigen' },
      { id: 'B', text: 'Patahnya tulang kering akibat benturan keras saat berpijak di tanah' },
      { id: 'C', text: 'Habisnya cairan pelumas sendi sinovial di dalam tempurung lutut' },
      { id: 'D', text: 'Kelebihan cadangan gula glukosa yang tidak terurai di dalam otot lurik' },
    ],
    correctAnswer: 'A',
    explanation:
      'Saat berolahraga berat dengan pasokan oksigen terbatas, sel otot melakukan fermentasi asam laktat secara anaerob untuk menghasilkan energi cepat. Penumpukan asam laktat yang berlebih di serabut otot menimbulkan rasa pegal, linu, dan kram.',
  },
  {
    id: 16,
    type: 'pg',
    topic: 'Kelainan Tulang Belakang: Kifosis, Lordosis, Skoliosis',
    difficulty: 'Sedang',
    illustrationKey: 'bagan_kelainan_tulang_belakang',
    text: 'Perhatikan diagram kelainan tulang belakang pada gambar di atas!\nSeorang siswa sering menulis dengan posisi tubuh miring ke samping kanan dan meletakkan beban tas sekolah hanya pada satu bahu saja secara terus-menerus. Kelainan tulang belakang yang membengkok ke arah samping melengkung seperti huruf S disebut ...',
    options: [
      { id: 'A', text: 'Skoliosis' },
      { id: 'B', text: 'Kifosis' },
      { id: 'C', text: 'Lordosis' },
      { id: 'D', text: 'Osteoporosis' },
    ],
    correctAnswer: 'A',
    explanation:
      'Skoliosis adalah kelainan kelengkungan tulang belakang yang membengkok ke samping (membentuk huruf C atau S) akibat kebiasaan posisi duduk miring atau sering membawa tas ransel berat hanya di satu sisi pundak.',
  },
  {
    id: 17,
    type: 'pg',
    topic: 'Penyakit Tulang: Osteoporosis dan Rakitis',
    difficulty: 'Sukar',
    text: 'Seorang kakek berusia 70 tahun sering mengalami nyeri punggung dan tulangnya sangat rentan retak meskipun hanya terkena benturan ringan. Dokter menyatakan terjadi penurunan kepadatan massa tulang akibat hilangnya kalsium. Kelainan tulang ini dikenal dengan nama ...',
    options: [
      { id: 'A', text: 'Osteoporosis (tulang rapuh dan keropos)' },
      { id: 'B', text: 'Rakitis (tulang kaki melengkung huruf O atau X)' },
      { id: 'C', text: 'Fraktura terbuka (tulang patah mencuat)' },
      { id: 'D', text: 'Dislokasi (pergeseran sendi dari mangkuknya)' },
    ],
    correctAnswer: 'A',
    explanation:
      'Osteoporosis adalah kondisi medis di mana tulang mengalami pengeroposan dan penurunan massa/kepadatan mineral kalsium seiring bertambahnya usia, sehingga tulang menjadi sangat rapuh dan mudah patah.',
  },
  {
    id: 18,
    type: 'pg',
    topic: 'Pertolongan Pertama pada Cedera Patah Tulang (Fraktura)',
    difficulty: 'Sukar',
    text: 'Saat bermain sepak bola di lapangan, Budi terjatuh keras dan dicurigai mengalami patah tulang (fraktura tertutup) pada tulang lengan bawahnya. Tindakan pertolongan pertama yang paling tepat dan aman dilakukan adalah ...',
    options: [
      { id: 'A', text: 'Memasang bidai/spalk penyangga di kedua sisi lengan dan mengikatnya agar posisi tulang tidak bergeser' },
      { id: 'B', text: 'Menarik dan memutar lengan bawah sekuat tenaga untuk meluruskan kembali bentuknya' },
      { id: 'C', text: 'Mengurut dan memijat bagian lengan yang bengkak menggunakan minyak urut panas' },
      { id: 'D', text: 'Menyuruh korban langsung menggerak-gerakkan jari tangannya untuk menguji kekuatan tulang' },
    ],
    correctAnswer: 'A',
    explanation:
      'Pertolongan pertama pada cedera patah tulang adalah imobilisasi menggunakan bidai (spalk) yang diikat secara lembut di dua persendian terdekat agar tulang tidak bergeser dan tidak melukai pembuluh darah atau jaringan saraf sekitarnya.',
  },

  // =========================================================================
  // BAGIAN 2: PILIHAN GANDA KOMPLEKS (3 SOAL: NO 19 - 21)
  // Kemungkinan lebih dari 1 pilihan jawaban benar, setiap soal memiliki 3 opsi
  // Komposisi Tingkat Kesukaran: 1 Mudah, 1 Sedang, 1 Sukar
  // =========================================================================
  {
    id: 19,
    type: 'pgk',
    topic: 'Fungsi Penting Rangka Tubuh Manusia',
    difficulty: 'Mudah',
    text: 'Rangka tubuh manusia memiliki peranan yang sangat penting bagi keberlangsungan hidup. Manakah di antara pernyataan berikut yang merupakan fungsi benar dari sistem rangka manusia? (Pilihan jawaban benar dapat lebih dari satu!)',
    options: [
      { id: 'A', text: 'Memberi bentuk postur tubuh dan menyangga tubuh agar dapat berdiri tegak' },
      { id: 'B', text: 'Melindungi organ-organ dalam yang lunak seperti otak, jantung, dan paru-paru' },
      { id: 'C', text: 'Memompa darah bersih beroksigen ke seluruh jaringan pembuluh kapiler tubuh' },
    ],
    correctAnswer: ['A', 'B'],
    explanation:
      'Pemeriksaan setiap opsi:\n• Pilihan A: Benar, rangka memberikan bentuk arsitektur tubuh serta menyangga postur tegak.\n• Pilihan B: Benar, tulang tengkorak dan tulang rusuk membungkus organ vital lunak dari benturan.\n• Pilihan C: Salah, memompa darah adalah fungsi dari organ jantung (otot jantung), bukan rangka tulang.\nJadi jawaban yang benar adalah A dan B.',
  },
  {
    id: 20,
    type: 'pgk',
    topic: 'Koordinasi Persendian saat Berolahraga',
    difficulty: 'Sedang',
    illustrationKey: 'bagan_sendi_olahraga',
    text: 'Perhatikan gambar koordinasi sendi saat menendang bola dan berlari di atas!\nSaat seorang atlet sepak bola berlari dan menendang bola ke arah gawang, sendi apa sajakah yang bekerja aktif pada anggota gerak bawah tersebut? (Pilihan jawaban benar dapat lebih dari satu!)',
    options: [
      { id: 'A', text: 'Sendi peluru pada pertemuan tulang paha dan gelang panggul yang mengayunkan kaki ke segala arah' },
      { id: 'B', text: 'Sendi engsel pada lutut yang menekuk dan meluruskan tungkai kaki dengan hentakan ke satu arah' },
      { id: 'C', text: 'Sendi mati pada tempurung kepala yang mengunci gerakan tulang tengkorak' },
    ],
    correctAnswer: ['A', 'B'],
    explanation:
      'Pemeriksaan setiap opsi:\n• Pilihan A: Benar, sendi peluru di panggul memberikan keleluasaan tungkai paha berayun bebas membidik bola.\n• Pilihan B: Benar, sendi engsel di lutut menekuk lalu menghentak kuat meluruskan tungkai bawah saat menyepak bola.\n• Pilihan C: Salah, sendi mati di tengkorak (sutura) tidak terlibat dalam pergerakan menendang bola pada tungkai kaki.\nJadi jawaban yang benar adalah A dan B.',
  },
  {
    id: 21,
    type: 'pgk',
    topic: 'Karakteristik Otot Polos dan Otot Jantung',
    difficulty: 'Sukar',
    text: 'Otot polos dan otot jantung memiliki kesamaan mekanisme kerja yang berbeda dari otot lurik. Manakah pernyataan berikut yang benar mengenai karakteristik otot polos dan/atau otot jantung? (Pilihan jawaban benar dapat lebih dari satu!)',
    options: [
      { id: 'A', text: 'Keduanya bekerja secara involunter (tidak sadar) tanpa memerlukan instruksi perintah pikiran kita' },
      { id: 'B', text: 'Otot jantung memiliki struktur silindris yang bercabang dengan serat mirip lurik dan bekerja secara ritmis memompa darah' },
      { id: 'C', text: 'Otot polos melekat erat pada tulang rangka tubuh dan sangat mudah mengalami kelelahan saat digerakkan' },
    ],
    correctAnswer: ['A', 'B'],
    explanation:
      'Pemeriksaan setiap opsi:\n• Pilihan A: Benar, otot polos dan otot jantung bekerja otomatis di luar kesadaran (involunter) sepanjang waktu.\n• Pilihan B: Benar, otot jantung berbentuk silindris bercabang (anyaman sinsitium) yang berdenyut ritmis tanpa henti.\n• Pilihan C: Salah, otot yang melekat pada rangka dan mudah lelah adalah otot lurik/rangka, bukan otot polos.\nJadi pilihan jawaban yang benar adalah A dan B.',
  },

  // =========================================================================
  // BAGIAN 3: PILIHAN GANDA KOMPLEKS KATEGORI (9 SOAL: NO 22 - 30)
  // Pernyataan Benar/Salah, setiap soal memiliki 3 deskripsi
  // Komposisi Tingkat Kesukaran: 3 Mudah, 3 Sedang, 3 Sukar
  // =========================================================================
  {
    id: 22,
    type: 'pgk_kategori',
    topic: 'Konsep Alat Gerak Aktif dan Pasif',
    difficulty: 'Mudah',
    text: 'Cermatilah konsep dasar sistem lokomosi (alat gerak) pada tubuh manusia berikut!\nTentukan kebenaran dari setiap pernyataan di bawah ini (Pilih Benar atau Salah pada setiap baris):',
    statements: [
      {
        id: 's1',
        text: 'Tulang disebut alat gerak pasif karena memerlukan tarikan dari otot untuk dapat digerakkan.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Otot disebut alat gerak aktif karena memiliki kemampuan relaksasi dan kontraksi untuk menghasilkan gaya gerak.',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Jika otot mengalami kelumpuhan, tulang rangka tetap dapat bergerak bebas secara mandiri tanpa hambatan.',
        correctAnswer: false,
      },
    ],
    explanation:
      'Pembahasan alat gerak aktif dan pasif:\n1. Tulang adalah alat gerak pasif karena digerakkan oleh otot (BENAR).\n2. Otot adalah alat gerak aktif berkat kemampuan kontraksi dan relaksasinya (BENAR).\n3. Tulang tidak bisa bergerak mandiri jika otot pendukungnya lumpuh (SALAH).',
  },
  {
    id: 23,
    type: 'pgk_kategori',
    topic: 'Postur Sikap Duduk Ergonomis untuk Tulang Belakang',
    difficulty: 'Sedang',
    illustrationKey: 'infografik_postur_duduk_ergonomis',
    text: 'Perhatikan infografik postur sikap duduk ergonomis di meja belajar pada gambar di atas!\nTentukan kebenaran dari setiap kebiasaan dalam menjaga kesehatan tulang belakang berikut (Pilih Benar atau Salah pada setiap baris):',
    statements: [
      {
        id: 's1',
        text: 'Duduk dengan punggung tegak bersandar dan kedua telapak kaki menapak rata di lantai membantu mencegah kelainan kifosis.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Membungkuk sangat dekat dengan meja saat menulis berjam-jam dapat membuat otot leher tegang dan merusak lengkung tulang belakang.',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Membawa tas ransel sekolah yang sangat berat dengan hanya menggantungkannya pada satu bahu baik untuk melatih keseimbangan tulang.',
        correctAnswer: false,
      },
    ],
    explanation:
      'Pembahasan sikap ergonomis tulang:\n1. Duduk tegak dengan tumpuan kaki rata menstabilkan lengkung alami vertebra dan mencegah bungkuk/kifosis (BENAR).\n2. Membungkuk dekat meja memicu kelelahan leher, bahu, dan deformasi tulang punggung (BENAR).\n3. Membawa tas berat di satu bahu memicu kemiringan tulang belakang (skoliosis), bukan melatih keseimbangan (SALAH).',
  },
  {
    id: 24,
    type: 'pgk_kategori',
    topic: 'Klasifikasi Hubungan Antartulang (Sinartrosis, Amfiartrosis, Diartrosis)',
    difficulty: 'Sukar',
    text: 'Berdasarkan tingkat keleluasaan gerakannya, sendi dikelompokkan menjadi sendi mati, sendi kaku, dan sendi gerak.\nTentukan kebenaran dari setiap analisis jenis persendian berikut (Pilih Benar atau Salah pada setiap baris):',
    statements: [
      {
        id: 's1',
        text: 'Hubungan antartulang tengkorak (sutura) tergolong sendi mati (sinartrosis) yang sama sekali tidak dapat digerakkan.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Persendian antartulang belakang tergolong sendi kaku (amfiartrosis) yang hanya memungkinkan pergerakan secara terbatas.',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Sendi siku dan sendi lutut merupakan contoh sendi mati karena hanya bisa bergerak ke satu arah saja.',
        correctAnswer: false,
      },
    ],
    explanation:
      'Pembahasan klasifikasi persendian:\n1. Sutura pada tengkorak adalah sendi mati (sinartrosis) tanpa celah gerak demi melindungi otak (BENAR).\n2. Hubungan antar-ruas tulang belakang dihubungkan cakram tulang rawan sehingga hanya memungkinkan gerak terbatas (amfiartrosis) (BENAR).\n3. Sendi siku dan lutut adalah sendi gerak (diartrosis tipe engsel), bukan sendi mati (SALAH).',
  },
  {
    id: 25,
    type: 'pgk_kategori',
    topic: 'Susunan Tulang Rangka Kepala dan Anggota Gerak',
    difficulty: 'Mudah',
    text: 'Cermatilah nama-nama tulang penyusun rangka tubuh manusia berikut!\nTentukan kebenaran dari pengelompokan letak tulang di bawah ini (Pilih Benar atau Salah pada setiap baris):',
    statements: [
      {
        id: 's1',
        text: 'Tulang dahi, tulang baji, dan tulang pelipis merupakan bagian dari susunan tulang rangka kepala (tengkorak).',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Tulang lengan atas (humerus), tulang pengumpil (radius), dan tulang hasta (ulna) merupakan tulang anggota gerak atas (tangan).',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Tulang paha, tulang kering, dan tulang betis merupakan tulang penyusun sangkar pelindung organ dada.',
        correctAnswer: false,
      },
    ],
    explanation:
      'Pembahasan susunan rangka:\n1. Tulang dahi, pelipis, dan baji adalah tulang penyusun kranium tengkorak kepala (BENAR).\n2. Humerus, radius, dan ulna menyusun lengan tangan sebagai anggota gerak atas (BENAR).\n3. Tulang paha, kering, dan betis adalah anggota gerak bawah (tungkai kaki), bukan sangkar dada (SALAH).',
  },
  {
    id: 26,
    type: 'pgk_kategori',
    topic: 'Mekanisme Kontraksi dan Relaksasi Otot',
    difficulty: 'Sedang',
    text: 'Cermatilah pernyataan mengenai kondisi fisik dan kimia otot saat melakukan kerja mekanis berikut!\nTentukan kebenaran dari setiap pernyataan di bawah ini (Pilih Benar atau Salah pada setiap baris):',
    statements: [
      {
        id: 's1',
        text: 'Ketika otot berkontraksi, bentuk serabut otot akan memendek, menebal, dan menjadi lebih keras teraba.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Ketika otot berelaksasi, bentuk serabut otot akan memanjang, mengendur, dan kembali ke ukuran semula.',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Otot manusia hanya dapat mendorong tulang ke arah depan dan tidak memiliki kemampuan menarik tulang sama sekali.',
        correctAnswer: false,
      },
    ],
    explanation:
      'Pembahasan sifat kerja otot:\n1. Kontraksi ditandai dengan memendek, menebal, dan mengencangnya otot (BENAR).\n2. Relaksasi adalah kembalinya otot ke kondisi rileks, memanjang, dan mengendur (BENAR).\n3. Otot hanya bekerja dengan cara MENARIK tulang melalui kontraksi, otot tidak dapat mendorong tulang (SALAH).',
  },
  {
    id: 27,
    type: 'pgk_kategori',
    topic: 'Nutrisi dan Pembiasaan Hidup Sehat untuk Tulang dan Otot',
    difficulty: 'Sedang',
    illustrationKey: 'bagan_kesehatan_tulang_otot',
    text: 'Perhatikan bagan pilar menjaga kesehatan tulang dan otot pada gambar di atas!\nTentukan kebenaran dari setiap upaya menjaga kesehatan rangka dan otot berikut (Pilih Benar atau Salah pada setiap baris):',
    statements: [
      {
        id: 's1',
        text: 'Mengonsumsi makanan kaya kalsium seperti susu, keju, dan ikan teri membantu memperkuat kepadatan matriks tulang keras.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Terpapar sinar matahari pagi membantu pembentukan vitamin D aktif di kulit yang diperlukan untuk penyerapan kalsium.',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Kurang bergerak dan jarang berolahraga merupakan cara terbaik untuk menghemat cairan sendi agar tidak cepat aus.',
        correctAnswer: false,
      },
    ],
    explanation:
      'Pembahasan perawatan organ gerak:\n1. Kalsium dan fosfor adalah mineral utama pembentuk massa tulang yang padat dan kokoh (BENAR).\n2. Sinar UV-B matahari pagi memicu sintesis vitamin D3 di kulit agar kalsium dapat diserap usus ke tulang (BENAR).\n3. Kurang bergerak justru menyebabkan atrofi (pengecilan) otot dan kekakuan sendi, olahraga teratur melumasi sendi (SALAH).',
  },
  {
    id: 28,
    type: 'pgk_kategori',
    topic: 'Kelainan Sistem Otot: Atrofi, Hipertrofi, dan Tetanus',
    difficulty: 'Sukar',
    text: 'Cermatilah berbagai kelainan dan gangguan yang dapat terjadi pada jaringan otot manusia berikut!\nTentukan kebenaran dari setiap penjelasan kelainan otot di bawah ini (Pilih Benar atau Salah pada setiap baris):',
    statements: [
      {
        id: 's1',
        text: 'Atrofi otot adalah kondisi mengecilnya massa dan hilangnya kekuatan otot akibat otot lama tidak digerakkan atau penyakit saraf.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Tetanus adalah kondisi kejang otot yang terus menerus akibat racun bakteri Clostridium tetani yang masuk melalui luka kotor.',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Hipertrofi otot adalah penyakit mengeroposnya tulang belakang akibat kekurangan asupan zat besi dalam darah.',
        correctAnswer: false,
      },
    ],
    explanation:
      'Pembahasan kelainan otot:\n1. Atrofi otot adalah penyusutan volume serabut otot (misal saat kaki digips lama tidak digerakkan) (BENAR).\n2. Tetanus dipicu toksin bakteri Clostridium tetani yang menyebabkan otot kejang berkepanjangan (BENAR).\n3. Hipertrofi otot adalah pembesaran massa otot yang sehat akibat latihan beban rutin, bukan pengeroposan tulang (SALAH).',
  },
  {
    id: 29,
    type: 'pgk_kategori',
    topic: 'Struktur Pelindung dan Pelumas Persendian',
    difficulty: 'Mudah',
    text: 'Pada persendian yang dapat digerakkan secara bebas (diartrosis), terdapat struktur pendukung yang menjamin gerakan sendi berjalan mulus.\nTentukan kebenaran dari setiap fungsi struktur persendian berikut (Pilih Benar atau Salah pada setiap baris):',
    statements: [
      {
        id: 's1',
        text: 'Minyak sinovial (cairan sendi) berfungsi sebagai pelumas yang mengurangi gesekan antartulang saat sendi digerakkan.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Tulang rawan hialin yang melapisi ujung tulang berfungsi sebagai bantalan peredam kejut saat terjadi hentakan.',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Ligamen berfungsi sebagai saluran penghantar makanan dari lambung langsung ke dalam rongga persendian.',
        correctAnswer: false,
      },
    ],
    explanation:
      'Pembahasan struktur persendian:\n1. Cairan sinovial melumasi rongga sendi seperti oli mesin agar tulang tidak saling mengikis (BENAR).\n2. Tulang rawan di ujung tulang meredam benturan hentakan mekanik (BENAR).\n3. Ligamen adalah pita jaringan ikat yang mengikat tulang dengan tulang agar persendian tidak terlepas/dislokasi, bukan saluran makanan (SALAH).',
  },
  {
    id: 30,
    type: 'pgk_kategori',
    topic: 'Tindakan Pertolongan Pertama Cedera Sendi dan Otot (Metode RICE)',
    difficulty: 'Sukar',
    text: 'Saat berolahraga basket di sekolah, pergelangan kaki Made terkilir (keseleo/sprain) dan mengalami pembengkakan kemerahan.\nTentukan kebenaran dari langkah-langkah penanganan awal menggunakan prinsip metode RICE (Rest, Ice, Compression, Elevation) berikut (Pilih Benar atau Salah pada setiap baris):',
    statements: [
      {
        id: 's1',
        text: 'Mengistirahatkan bagian kaki yang terkilir (Rest) dan segera mengompresnya dengan es dingin (Ice) untuk meredakan radang dan bengkak.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Membalut pergelangan kaki menggunakan perban elastis (Compression) dan menopang posisi kaki lebih tinggi dari letak jantung (Elevation).',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Segera mengoleskan balsem yang sangat panas dan mengurut keras bagian sendi yang baru saja bengkak agar pembuluh darah cepat pecah.',
        correctAnswer: false,
      },
    ],
    explanation:
      'Pembahasan metode RICE untuk cedera terkilir:\n1. Rest (istirahatkan) dan Ice (kompres dingin 15 menit) menyempitkan pembuluh darah untuk mengurangi pendarahan dalam dan bengkak (BENAR).\n2. Compression (balut tekan lembut) dan Elevation (posisikan lebih tinggi dari jantung) melancarkan aliran balik vena (BENAR).\n3. Memijat keras atau mengoles panas pada cedera baru yang meradang sangat berbahaya karena dapat memperparah robekan ligamen dan pembengkakan (SALAH).',
  },
];
