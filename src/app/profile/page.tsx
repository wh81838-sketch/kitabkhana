export default function ProfilePage() {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-10">
        <div className="w-24 h-24 mx-auto rounded-full bg-burgundy-800/10 border-2 border-cream-300 flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-burgundy-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="font-urdu text-2xl font-semibold text-burgundy-900">
          قاری
        </h1>
        <p className="font-serif text-sm text-charcoal-600 mt-1">
          Private Library Member
        </p>
      </div>

      <div className="space-y-3">
        <ProfileLink href="/favorites" label="پسندیدہ کتابیں" />
        <ProfileLink href="/library?filter=progress" label="جاری کتابیں" />
        <ProfileLink href="#" label="بک مارکس" />
        <ProfileLink href="#" label="پڑھنے کی ترجیحات" />
        <div className="pt-4 border-t border-cream-200">
          <p className="font-urdu text-sm text-charcoal-600 text-center">
            یہ ایک ذاتی ڈیجیٹل کتب خانہ ہے۔
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between p-4 rounded-xl bg-white border border-cream-200 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-shadow"
    >
      <span className="font-urdu text-base text-charcoal-800">{label}</span>
      <svg className="w-5 h-5 text-charcoal-600 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}
