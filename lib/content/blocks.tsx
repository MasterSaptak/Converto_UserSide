'use client';

// =====================================================
// CONVERTO — Content block renderer
// =====================================================
// Every block renders as ordinary React children. There is no
// dangerouslySetInnerHTML in this file and there must never be one — the whole
// reason content is stored as structured blocks rather than HTML is that admin
// prose then cannot become markup in a customer's browser.
//
// @tailwindcss/typography is not installed in this app and is not needed:
// structured blocks carry their own styling.

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRight, Info, CheckCircle2, AlertTriangle, XCircle, ChevronDown } from 'lucide-react';
import type { ContentBlock, ContentCalloutTone } from '@/types/content';

const CALLOUT_STYLES: Record<ContentCalloutTone, { wrap: string; icon: typeof Info }> = {
  info: { wrap: 'bg-blue-50 border-blue-400 text-blue-950', icon: Info },
  success: { wrap: 'bg-emerald-50 border-emerald-500 text-emerald-950', icon: CheckCircle2 },
  warning: { wrap: 'bg-amber-50 border-amber-500 text-amber-950', icon: AlertTriangle },
  danger: { wrap: 'bg-rose-50 border-rose-500 text-rose-950', icon: XCircle },
};

const ASPECT_CLASSES = {
  wide: 'aspect-[16/9]',
  square: 'aspect-square',
  tall: 'aspect-[4/5]',
} as const;

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks?.length) return null;
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading':
      return block.level === 2 ? (
        <h2 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-wide leading-tight">
          {block.text}
        </h2>
      ) : (
        <h3 className="text-base md:text-lg font-heading font-bold uppercase tracking-wide leading-tight">
          {block.text}
        </h3>
      );

    case 'paragraph':
      return (
        <p className={cn('text-sm md:text-base leading-relaxed', block.emphasis ? 'font-bold' : 'font-medium opacity-80')}>
          {block.text}
        </p>
      );

    case 'image':
      return (
        <figure className="flex flex-col gap-2">
          <div className={cn('w-full overflow-hidden border-2 border-foreground', ASPECT_CLASSES[block.aspect ?? 'wide'])}>
            {/* A plain <img>, not next/image: next.config sets images.unoptimized
                but declares no remotePatterns, and the default loader still
                validates remote hosts against that list. The fixed-aspect wrapper
                reserves the space so the page does not jump as it loads. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.url}
              alt={block.alt}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="text-[11px] font-bold uppercase tracking-widest opacity-50">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'list': {
      const items = block.items.map((item, i) => (
        <li key={i} className="text-sm md:text-base font-medium opacity-80 leading-relaxed">
          {item}
        </li>
      ));
      return block.style === 'number' ? (
        <ol className="list-decimal pl-5 flex flex-col gap-2">{items}</ol>
      ) : (
        <ul className="list-disc pl-5 flex flex-col gap-2">{items}</ul>
      );
    }

    case 'cta': {
      // Internal links go through next/link so navigation stays client-side;
      // external ones get noopener/noreferrer.
      const external = block.href.startsWith('http');
      const className =
        block.style === 'link'
          ? 'inline-flex items-center gap-2 font-bold uppercase text-xs tracking-widest underline underline-offset-4'
          : cn(
              'group inline-flex items-center gap-2 border-2 border-foreground px-6 py-3 font-bold uppercase text-xs tracking-widest transition-all self-start',
              block.style === 'primary'
                ? 'bg-foreground text-background shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-none hover:translate-y-1 hover:translate-x-1'
                : 'hover:bg-foreground hover:text-background shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-none hover:translate-y-1 hover:translate-x-1'
            );

      const inner = (
        <>
          {block.label}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </>
      );

      return external ? (
        <a href={block.href} target="_blank" rel="noopener noreferrer" className={className}>
          {inner}
        </a>
      ) : (
        <Link href={block.href} className={className}>
          {inner}
        </Link>
      );
    }

    case 'divider':
      return <hr className="border-t-2 border-foreground/20" />;

    case 'callout': {
      const { wrap, icon: Icon } = CALLOUT_STYLES[block.tone];
      return (
        <div className={cn('border-2 p-4 flex gap-3', wrap)}>
          <Icon className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 min-w-0">
            {block.title && (
              <span className="font-heading font-bold uppercase tracking-wide text-sm">{block.title}</span>
            )}
            <p className="text-sm font-medium leading-relaxed">{block.text}</p>
          </div>
        </div>
      );
    }

    case 'stat':
      return (
        <div className="border-2 border-foreground bg-card p-4 flex flex-col gap-1 self-start min-w-[8rem]">
          <span className="text-2xl md:text-3xl font-heading font-bold leading-none">{block.value}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{block.label}</span>
          {block.hint && <span className="text-[11px] font-medium opacity-50">{block.hint}</span>}
        </div>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 border-foreground pl-4 flex flex-col gap-2">
          <p className="text-base md:text-lg font-medium italic leading-relaxed">“{block.text}”</p>
          {block.attribution && (
            <cite className="text-[11px] font-bold uppercase tracking-widest opacity-50 not-italic">
              — {block.attribution}
            </cite>
          )}
        </blockquote>
      );

    // ── v24 ────────────────────────────────────────────────────────────────
    case 'video': {
      // An iframe, never injected markup: the URL is validated to YouTube/Vimeo
      // on the server, and `sandbox` means even a compromised embed cannot reach
      // this page's DOM, cookies or storage.
      const embed = toEmbedUrl(block.url);
      if (!embed) return null;
      return (
        <figure className="flex flex-col gap-2">
          <div className="w-full aspect-video border-2 border-foreground overflow-hidden bg-foreground/5">
            <iframe
              src={embed}
              title={block.caption || 'Video'}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
              sandbox="allow-scripts allow-same-origin allow-presentation"
              referrerPolicy="strict-origin-when-cross-origin"
              className="w-full h-full"
            />
          </div>
          {block.caption && (
            <figcaption className="text-[11px] font-bold uppercase tracking-widest opacity-50">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'gallery':
      if (!block.images?.length) return null;
      return (
        <div className={cn(
          'grid gap-3',
          block.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'
        )}>
          {block.images.map((img, i) => (
            <div key={i} className="aspect-square border-2 border-foreground overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} loading="lazy" decoding="async"
                   className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      );

    case 'accordion':
      return (
        <div className="flex flex-col gap-2">
          {block.items.map((it, i) => (
            // <details> rather than a state hook: it is keyboard accessible and
            // findable by in-page search for free.
            <details key={i} className="border-2 border-foreground bg-card group/acc">
              <summary className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer font-heading font-bold uppercase tracking-wide text-sm list-none">
                {it.title}
                <ChevronDown className="w-4 h-4 shrink-0 transition-transform group-open/acc:rotate-180" />
              </summary>
              <p className="px-4 pb-3 text-sm font-medium opacity-80 leading-relaxed">{it.body}</p>
            </details>
          ))}
        </div>
      );

    case 'faq':
      return (
        <div className="flex flex-col gap-3">
          {block.items.map((it, i) => (
            <div key={i} className="border-l-4 border-foreground pl-4 flex flex-col gap-1">
              <h3 className="font-heading font-bold uppercase tracking-wide text-sm">{it.question}</h3>
              <p className="text-sm font-medium opacity-80 leading-relaxed">{it.answer}</p>
            </div>
          ))}
        </div>
      );

    case 'table':
      return (
        <figure className="flex flex-col gap-2">
          {/* Scrolls inside its own box so a wide table never makes the whole
              page scroll sideways on a phone. */}
          <div className="w-full overflow-x-auto border-2 border-foreground">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-foreground text-background">
                  {block.headers.map((h, i) => (
                    <th key={i} className="text-left font-heading font-bold uppercase tracking-wide px-3 py-2 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-t-2 border-foreground/20">
                    {row.map((cell, c) => (
                      <td key={c} className="px-3 py-2 font-medium opacity-80">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <figcaption className="text-[11px] font-bold uppercase tracking-widest opacity-50">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'buttons':
      return (
        <div className="flex flex-wrap gap-3">
          {block.items.map((b, i) => {
            const external = b.href.startsWith('http');
            const cls = cn(
              'group inline-flex items-center gap-2 border-2 border-foreground px-5 py-3 font-bold uppercase text-xs tracking-widest transition-all',
              b.style === 'primary'
                ? 'bg-foreground text-background shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-none hover:translate-y-1 hover:translate-x-1'
                : b.style === 'ghost'
                  ? 'hover:bg-foreground hover:text-background shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-none hover:translate-y-1 hover:translate-x-1'
                  : 'border-transparent underline underline-offset-4 px-0 py-0'
            );
            return external ? (
              <a key={i} href={b.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {b.label}<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            ) : (
              <Link key={i} href={b.href} className={cls}>
                {b.label}<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            );
          })}
        </div>
      );

    default:
      // An unknown block type means ServerSide shipped something newer than this
      // build. Render nothing rather than crashing the whole page.
      return null;
  }
}

/**
 * Normalises a YouTube/Vimeo watch URL into its embed form.
 *
 * Returns null for anything unrecognised rather than passing the URL through —
 * the server already restricts these hosts, and this is the second gate so a row
 * written before that validation existed still cannot embed an arbitrary origin.
 */
function toEmbedUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
    }
    if (host === 'youtube.com') {
      if (u.pathname.startsWith('/embed/')) {
        return `https://www.youtube-nocookie.com${u.pathname}`;
      }
      const id = u.searchParams.get('v');
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
    }
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${encodeURIComponent(id)}` : null;
    }
    if (host === 'player.vimeo.com') return u.toString();

    return null;
  } catch {
    return null;
  }
}
