export type Book = {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  author: string;
  authorSlug: string;
  category: string;
  categorySlug: string;
  genre?: string;
  description: string;
  coverUrl?: string;
  publicationYear?: number;
  pages?: number;
  featured: boolean;
  status: "published" | "draft";
  readingProgress?: number;
  isFavorite?: boolean;
  sourceUrl?: string;
  readingUrl?: string;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  bookCount: number;
};

export type Author = {
  id: string;
  name: string;
  slug: string;
  biography?: string;
  bookCount: number;
};

export const categories: Category[] = [
  { id: "1", name: "اردو ناول", slug: "urdu-novels", description: "کلاسیکی اور معاصر اردو ناول", bookCount: 12 },
  { id: "2", name: "رومانوی ناول", slug: "romantic-novels", description: "محبت اور جذبات کی کہانیاں", bookCount: 8 },
  { id: "3", name: "کلاسیکی ادب", slug: "classical-literature", description: "اردو ادب کے شاہکار", bookCount: 6 },
  { id: "4", name: "تاریخی ناول", slug: "historical-novels", description: "تاریخ کی دلچسپ کہانیاں", bookCount: 4 },
  { id: "5", name: "افسانے", slug: "short-stories", description: "مختصر کہانیاں اور افسانے", bookCount: 7 },
  { id: "6", name: "شاعری", slug: "poetry", description: "اردو شاعری کا خزانہ", bookCount: 5 },
  { id: "7", name: "اسلامی ادب", slug: "islamic-literature", description: "دینی اور اصلاحی ادب", bookCount: 3 },
  { id: "8", name: "جاسوسی ادب", slug: "detective", description: "سنسنی خیز اور جاسوسی ناول", bookCount: 4 },
  { id: "9", name: "مزاحیہ ادب", slug: "humor", description: "ہنسی اور مزاح کی دنیا", bookCount: 2 },
  { id: "10", name: "بچوں کا ادب", slug: "children", description: "نوجوانوں اور بچوں کے لیے", bookCount: 3 },
];

export const authors: Author[] = [
  { id: "1", name: "بانو قدسیہ", slug: "bano-qudsia", biography: "ممتاز اردو ناول نگار اور ڈرامہ نویس", bookCount: 5 },
  { id: "2", name: "عبداللہ حسین", slug: "abdullah-hussain", biography: "اردو ادب کے عظیم ناول نگار", bookCount: 4 },
  { id: "3", name: "امراؤ جان ادا", slug: "mirza-hadi-ruswa", bookCount: 1 },
  { id: "4", name: "قرۃ العین حیدر", slug: "qurratulain-hyder", bookCount: 3 },
  { id: "5", name: "اشفاق احمد", slug: "ashfaq-ahmed", bookCount: 6 },
  { id: "6", name: "ممتاز مفتی", slug: "mumtaaz-mufti", bookCount: 2 },
  { id: "7", name: "سعادت حسن منٹو", slug: "saadat-hasan-manto", bookCount: 8 },
  { id: "8", name: "فیض احمد فیض", slug: "faiz-ahmed-faiz", bookCount: 4 },
];

export const demoBooks: Book[] = [
  {
    id: "1",
    slug: "raja-gidh",
    title: "راجہ گدھ",
    titleEn: "Raja Gidh",
    author: "بانو قدسیہ",
    authorSlug: "bano-qudsia",
    category: "اردو ناول",
    categorySlug: "urdu-novels",
    genre: "فلسفیانہ ناول",
    description: "بانو قدسیہ کا شاہکار ناول جو انسانی نفسیات، اخلاقیات اور روحانیت کی گہری کھوج کرتا ہے۔ ایک ایسی کہانی جو قاری کو اپنے اندر جھانکنے پر مجبور کرتی ہے۔",
    featured: true,
    status: "published",
    readingProgress: 63,
    isFavorite: true,
    publicationYear: 1981,
    pages: 420,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    slug: "udaas-naslain",
    title: "اداس نسلیں",
    titleEn: "Udaas Naslein",
    author: "عبداللہ حسین",
    authorSlug: "abdullah-hussain",
    category: "تاریخی ناول",
    categorySlug: "historical-novels",
    description: "برصغیر کی تاریخ پر مبنی ایک عظیم ناول جو تین نسلوں کی کہانی بیان کرتا ہے۔ آزادی کی تحریک اور تقسیم کے اثرات کو بیان کرنے والا شاہکار۔",
    featured: true,
    status: "published",
    readingProgress: 12,
    publicationYear: 1963,
    pages: 580,
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    slug: "aag-ka-darya",
    title: "آگ کا دریا",
    titleEn: "Aag Ka Darya",
    author: "قرۃ العین حیدر",
    authorSlug: "qurratulain-hyder",
    category: "کلاسیکی ادب",
    categorySlug: "classical-literature",
    description: "ہندوستان کی دو ہزار سالہ تاریخ کو ایک ناول کی شکل میں پیش کرنے والا عظیم الشان کام۔ وقت، محبت اور تہذیب کی کہانی۔",
    featured: true,
    status: "published",
    publicationYear: 1959,
    pages: 720,
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    slug: "mirat-ul-uroos",
    title: "مراۃ العروس",
    author: "نذیر احمد",
    authorSlug: "nazeer-ahmed",
    category: "کلاسیکی ادب",
    categorySlug: "classical-literature",
    description: "اردو کا پہلا ناول سمجھا جانے والا یہ شاہکار ایک گھریلو کہانی کے ذریعے سماجی اصلاح کا پیغام دیتا ہے۔",
    featured: false,
    status: "published",
    publicationYear: 1869,
    pages: 280,
    createdAt: "2024-03-01",
  },
  {
    id: "5",
    slug: "zavia",
    title: "زاویہ",
    author: "اشفاق احمد",
    authorSlug: "ashfaq-ahmed",
    category: "افسانے",
    categorySlug: "short-stories",
    description: "اشفاق احمد کے مشہور ٹیلی ویژن پروگرام کی کتابی شکل۔ زندگی کے گہرے مشاہدات اور فلسفیانہ گفتگو۔",
    featured: true,
    status: "published",
    isFavorite: true,
    readingProgress: 45,
    publicationYear: 1990,
    pages: 350,
    createdAt: "2024-02-15",
  },
  {
    id: "6",
    slug: "toba-tek-singh",
    title: "ٹوبہ ٹیک سنگھ",
    author: "سعادت حسن منٹو",
    authorSlug: "saadat-hasan-manto",
    category: "افسانے",
    categorySlug: "short-stories",
    description: "منٹو کا مشہور افسانہ جو تقسیم ہند کی المناک حقیقت کو بیان کرتا ہے۔ اردو ادب کا ایک لازوال شاہکار۔",
    featured: false,
    status: "published",
    publicationYear: 1955,
    pages: 24,
    createdAt: "2024-03-10",
  },
  {
    id: "7",
    slug: "shikwa-jawab-e-shikwa",
    title: "شکوہ اور جوابِ شکوہ",
    author: "علامہ اقبال",
    authorSlug: "allama-iqbal",
    category: "شاعری",
    categorySlug: "poetry",
    description: "اقبال کی مشہور نظمیں جو اللہ سے گفتگو اور امت مسلمہ کی حالت پر روشنی ڈالتی ہیں۔",
    featured: false,
    status: "published",
    publicationYear: 1911,
    pages: 48,
    createdAt: "2024-02-28",
  },
  {
    id: "8",
    slug: "peer-e-kamil",
    title: "پیرِ کامل",
    titleEn: "Peer-e-Kamil",
    author: "نمرہ احمد",
    authorSlug: "nimra-ahmed",
    category: "رومانوی ناول",
    categorySlug: "romantic-novels",
    genre: "اسلامی رومانوی",
    description: "ایک روحانی اور رومانوی سفر کی کہانی جو قاری کے دل کو چھو جاتی ہے۔",
    featured: true,
    status: "published",
    readingProgress: 28,
    isFavorite: true,
    publicationYear: 2004,
    pages: 512,
    createdAt: "2024-01-05",
  },
];

export const personalGreeting = "تمہاری پسند کی کتابوں کے نام، ایک اپنی سی دنیا۔";
export const libraryName = "کتب خانہ";
export const tagline = "جہاں ہر کتاب ایک نئی دنیا ہے";
