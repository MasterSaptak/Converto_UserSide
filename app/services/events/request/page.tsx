import { ServiceRegistry } from '@/modules/service-engine/configs';
import { notFound } from 'next/navigation';

export default function RequestPage() {
  const config = ServiceRegistry.get('events');
  
  if (!config) {
    return notFound();
  }

  return (
    <div className="min-h-[80vh] bg-zinc-50 pt-24 pb-12 flex flex-col items-center">
      <div className="w-full max-w-4xl p-6 md:p-10 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest border-b-2 border-black pb-4 mb-6 text-primary">
          {config.title} Request
        </h1>
        <p className="text-zinc-600 text-sm md:text-base font-bold uppercase tracking-wider mb-8">
          {config.shortDescription}
        </p>
        
        <div className="bg-[#facc15] border-2 border-black p-5 mb-8 transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-black text-sm uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-black block" />
            Under Construction
          </p>
          <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-black/80">
            The dedicated request flow for {config.title} is currently in development. Our engineers are building a tailored experience for this service.
          </p>
        </div>
        
        <button className="w-full md:w-auto px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
          Join Waitlist
        </button>
      </div>
    </div>
  );
}
