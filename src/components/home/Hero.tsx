import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-burgundy-900 via-burgundy-800 to-burgundy-950 text-cream-50">
      {/* Subtle decorative pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="font-serif text-gold-400 text-sm sm:text-base tracking-widest mb-4 opacity-90">
            A Private Digital Library
          </p>
          <h1 className="font-urdu text-3xl sm:text-4xl md:text-5xl font-semibold leading-relaxed mb-5">
            خوش آمدید، کتابوں کی اس دنیا میں
          </h1>
          <p className="font-urdu text-base sm:text-lg text-cream-200/90 leading-relaxed mb-8 max-w-xl">
            اردو ادب، ناول اور کہانیاں — ایک خوبصورت ڈیجیٹل کتب خانے میں
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/library"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cream-50 text-burgundy-900 font-urdu font-medium text-base shadow-lg hover:bg-white hover:shadow-xl transition-all active:scale-[0.98]"
            >
              کتب خانہ دیکھیں
              <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/library?sort=newest"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-cream-200/40 text-cream-50 font-urdu font-medium text-base hover:bg-white/10 transition-all active:scale-[0.98]"
            >
              نئی کتابیں
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-cream-50 to-transparent" />
    </section>
  );
}
