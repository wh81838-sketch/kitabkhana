import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="font-serif text-6xl text-burgundy-800/20 mb-4">404</p>
      <h1 className="font-urdu text-2xl font-semibold text-burgundy-900 mb-3">
        صفحہ نہیں ملا
      </h1>
      <p className="font-urdu text-charcoal-600 mb-8 max-w-md">
        جو آپ تلاش کر رہے ہیں وہ یہاں موجود نہیں۔ شاید کتب خانے میں واپس چلیں۔
      </p>
      <Link
        href="/"
        className="inline-flex px-6 py-3 rounded-xl bg-burgundy-800 text-cream-50 font-urdu font-medium hover:bg-burgundy-700 transition-colors"
      >
        ہوم پیج
      </Link>
    </div>
  );
}
