import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Urdu Adab Library...");

  // Categories
  const categoriesData = [
    { name: "اردو ناول", slug: "urdu-novels", description: "کلاسیکی اور معاصر اردو ناول", sortOrder: 1 },
    { name: "رومانوی ناول", slug: "romantic-novels", description: "محبت اور جذبات کی کہانیاں", sortOrder: 2 },
    { name: "کلاسیکی ادب", slug: "classical-literature", description: "اردو ادب کے شاہکار", sortOrder: 3 },
    { name: "تاریخی ناول", slug: "historical-novels", description: "تاریخ کی دلچسپ کہانیاں", sortOrder: 4 },
    { name: "افسانے", slug: "short-stories", description: "مختصر کہانیاں اور افسانے", sortOrder: 5 },
    { name: "شاعری", slug: "poetry", description: "اردو شاعری کا خزانہ", sortOrder: 6 },
    { name: "اسلامی ادب", slug: "islamic-literature", description: "دینی اور اصلاحی ادب", sortOrder: 7 },
    { name: "جاسوسی ادب", slug: "detective", description: "سنسنی خیز اور جاسوسی ناول", sortOrder: 8 },
    { name: "مزاحیہ ادب", slug: "humor", description: "ہنسی اور مزاح کی دنیا", sortOrder: 9 },
    { name: "بچوں کا ادب", slug: "children", description: "نوجوانوں اور بچوں کے لیے", sortOrder: 10 },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Authors
  const authorsData = [
    { name: "بانو قدسیہ", slug: "bano-qudsia", biography: "ممتاز اردو ناول نگار اور ڈرامہ نویس" },
    { name: "عبداللہ حسین", slug: "abdullah-hussain", biography: "اردو ادب کے عظیم ناول نگار" },
    { name: "قرۃ العین حیدر", slug: "qurratulain-hyder", biography: "اردو کی ممتاز ناول نگار" },
    { name: "اشفاق احمد", slug: "ashfaq-ahmed", biography: "اردو کے مشہور افسانہ نگار اور ڈرامہ نویس" },
    { name: "سعادت حسن منٹو", slug: "saadat-hasan-manto", biography: "اردو کے عظیم افسانہ نگار" },
    { name: "علامہ اقبال", slug: "allama-iqbal", biography: "شاعر مشرق" },
    { name: "نمرہ احمد", slug: "nimra-ahmed", biography: "معاصر اردو ناول نگار" },
    { name: "نذیر احمد", slug: "nazeer-ahmed", biography: "اردو ناول کے بانیوں میں سے ایک" },
  ];

  for (const author of authorsData) {
    await prisma.author.upsert({
      where: { slug: author.slug },
      update: {},
      create: author,
    });
  }

  // Get IDs
  const catMap = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );
  const authorMap = Object.fromEntries(
    (await prisma.author.findMany()).map((a) => [a.slug, a.id])
  );

  // Books (demo / public-domain style metadata only)
  const booksData = [
    {
      title: "راجہ گدھ",
      alternateTitle: "Raja Gidh",
      slug: "raja-gidh",
      description: "بانو قدسیہ کا شاہکار ناول جو انسانی نفسیات، اخلاقیات اور روحانیت کی گہری کھوج کرتا ہے۔",
      genre: "فلسفیانہ ناول",
      publicationYear: 1981,
      pages: 420,
      featured: true,
      status: "published",
      authorId: authorMap["bano-qudsia"],
      categoryId: catMap["urdu-novels"],
    },
    {
      title: "اداس نسلیں",
      alternateTitle: "Udaas Naslein",
      slug: "udaas-naslain",
      description: "برصغیر کی تاریخ پر مبنی ایک عظیم ناول جو تین نسلوں کی کہانی بیان کرتا ہے۔",
      publicationYear: 1963,
      pages: 580,
      featured: true,
      status: "published",
      authorId: authorMap["abdullah-hussain"],
      categoryId: catMap["historical-novels"],
    },
    {
      title: "آگ کا دریا",
      alternateTitle: "Aag Ka Darya",
      slug: "aag-ka-darya",
      description: "ہندوستان کی دو ہزار سالہ تاریخ کو ایک ناول کی شکل میں پیش کرنے والا عظیم الشان کام۔",
      publicationYear: 1959,
      pages: 720,
      featured: true,
      status: "published",
      authorId: authorMap["qurratulain-hyder"],
      categoryId: catMap["classical-literature"],
    },
    {
      title: "مراۃ العروس",
      slug: "mirat-ul-uroos",
      description: "اردو کا پہلا ناول سمجھا جانے والا یہ شاہکار ایک گھریلو کہانی کے ذریعے سماجی اصلاح کا پیغام دیتا ہے۔",
      publicationYear: 1869,
      pages: 280,
      featured: false,
      status: "published",
      authorId: authorMap["nazeer-ahmed"],
      categoryId: catMap["classical-literature"],
      copyrightStatus: "public_domain",
    },
    {
      title: "زاویہ",
      slug: "zavia",
      description: "اشفاق احمد کے مشہور ٹیلی ویژن پروگرام کی کتابی شکل۔ زندگی کے گہرے مشاہدات اور فلسفیانہ گفتگو۔",
      publicationYear: 1990,
      pages: 350,
      featured: true,
      status: "published",
      authorId: authorMap["ashfaq-ahmed"],
      categoryId: catMap["short-stories"],
    },
    {
      title: "ٹوبہ ٹیک سنگھ",
      slug: "toba-tek-singh",
      description: "منٹو کا مشہور افسانہ جو تقسیم ہند کی المناک حقیقت کو بیان کرتا ہے۔",
      publicationYear: 1955,
      pages: 24,
      featured: false,
      status: "published",
      authorId: authorMap["saadat-hasan-manto"],
      categoryId: catMap["short-stories"],
    },
    {
      title: "شکوہ اور جوابِ شکوہ",
      slug: "shikwa-jawab-e-shikwa",
      description: "اقبال کی مشہور نظمیں جو اللہ سے گفتگو اور امت مسلمہ کی حالت پر روشنی ڈالتی ہیں۔",
      publicationYear: 1911,
      pages: 48,
      featured: false,
      status: "published",
      authorId: authorMap["allama-iqbal"],
      categoryId: catMap["poetry"],
      copyrightStatus: "public_domain",
    },
    {
      title: "پیرِ کامل",
      alternateTitle: "Peer-e-Kamil",
      slug: "peer-e-kamil",
      description: "ایک روحانی اور رومانوی سفر کی کہانی جو قاری کے دل کو چھو جاتی ہے۔",
      genre: "اسلامی رومانوی",
      publicationYear: 2004,
      pages: 512,
      featured: true,
      status: "published",
      authorId: authorMap["nimra-ahmed"],
      categoryId: catMap["romantic-novels"],
    },
  ];

  for (const book of booksData) {
    await prisma.book.upsert({
      where: { slug: book.slug },
      update: {},
      create: book,
    });
  }

  // Default settings
  const settings = [
    { key: "library_name", value: "کتب خانہ" },
    { key: "tagline", value: "جہاں ہر کتاب ایک نئی دنیا ہے" },
    { key: "personal_greeting", value: "تمہاری پسند کی کتابوں کے نام، ایک اپنی سی دنیا۔" },
    { key: "welcome_message", value: "خوش آمدید، کتابوں کی اس دنیا میں" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }


  // Admin user
  const adminHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@kitabkhana.local" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@kitabkhana.local",
      passwordHash: adminHash,
      role: "admin",
    },
  });
  console.log("Admin: admin@kitabkhana.local / admin123");

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
