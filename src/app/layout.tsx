import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-noto-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "کتب خانہ — اردو ادب کی خوبصورت دنیا",
    template: "%s | کتب خانہ",
  },
  description: "جہاں ہر کتاب ایک نئی دنیا ہے — اردو ناول، ادب، کہانیاں اور شاعری کا ایک خوبصورت ڈیجیٹل کتب خانہ",
  openGraph: {
    type: "website",
    locale: "ur_PK",
    siteName: "کتب خانہ",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4a1c24",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ur"
      dir="rtl"
      className={`${inter.variable} ${playfair.variable} ${notoNastaliq.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-cream-50 text-charcoal-800 antialiased paper-texture">
        <Header />
        <main className="flex-1 pb-20 md:pb-8">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
