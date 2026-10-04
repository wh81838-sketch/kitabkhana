type Props = {
  message: string;
};

export function PersonalNote({ message }: Props) {
  return (
    <section className="py-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-burgundy-900 to-burgundy-800 px-6 py-8 sm:px-10 sm:py-10 text-center">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cream-50/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <p className="relative font-urdu text-lg sm:text-xl text-cream-50 leading-relaxed max-w-xl mx-auto">
          {message}
        </p>
        <p className="relative mt-3 font-serif text-xs text-gold-400/80 tracking-wider">
          For you
        </p>
      </div>
    </section>
  );
}
