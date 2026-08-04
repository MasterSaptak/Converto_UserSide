import Link from 'next/link';

export function NeedHelpCTA() {
  return (
    <div className="w-full border-t-2 border-foreground bg-secondary py-12 md:py-16 px-4 flex flex-col items-center justify-center text-center gap-6 mt-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest font-heading">Still have questions?</h2>
        <p className="text-sm font-bold opacity-70 uppercase tracking-widest max-w-md">Our team is here to help you.</p>
      </div>
      <Link href="/support" className="bg-primary text-primary-foreground border-2 border-foreground px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 mt-2">
        Contact Us
      </Link>
    </div>
  );
}
