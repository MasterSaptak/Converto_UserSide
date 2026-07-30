'use client';

// The full page for one content item.
//
// The route is /updates/[slug] rather than /advertisements/[slug] for three
// reasons: the model is unified, so this path also has to host a security notice
// or a maintenance message; the notification action_url is generated in SQL
// ('/updates/' || slug) and needs one stable prefix; and the slug is user-visible
// marketing copy, which an opaque id is not.

import { use, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { staggerContainer, fadeUp } from '@/lib/animations';
import { useContentItem } from '@/hooks/useContent';
import { useImpression } from '@/hooks/useContentTracking';
import { ContentBlocks } from '@/lib/content/blocks';
import { resolveTheme } from '@/lib/content/theme';
import { resolveIcon } from '@/lib/content/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function UpdatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { item, loading, error } = useContentItem(slug);

  const trackRef = useImpression(item?.id ?? null, 'detail');

  useEffect(() => {
    if (item?.title) document.title = `${item.title} · Converto`;
  }, [item?.title]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col gap-6 pb-10">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // A hidden item and a deleted item are indistinguishable from here on purpose:
  // RLS returns no row either way, and telling a customer "this exists but is not
  // for you" would leak the existence of targeted content.
  if (error || !item) {
    return (
      <div className="flex-1 flex flex-col gap-6 pb-10">
        <Link href="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>
        <div className="border-2 border-foreground bg-card p-8 text-center">
          <p className="font-heading font-bold uppercase tracking-wide">This update is not available</p>
          <p className="text-xs opacity-60 mt-2 font-medium">
            It may have expired, or the link may be incorrect.
          </p>
          <Link
            href="/updates"
            className="inline-flex items-center gap-2 border-2 border-foreground px-5 py-2.5 mt-5 font-bold uppercase text-xs tracking-widest shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all"
          >
            See all updates
          </Link>
        </div>
      </div>
    );
  }

  const theme = resolveTheme(item.theme);
  const Icon = resolveIcon(item.icon_key);
  // Artwork is per-surface since v24 and this page is not a surface, so it
  // borrows the first image the item has anywhere. Better a carousel crop at the
  // top of the page than no hero at all.
  const hero = item.placements?.find((p) => p.image_url) ?? null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex-1 flex flex-col gap-6 pb-10"
      ref={trackRef}
    >
      <motion.div variants={fadeUp}>
        <Link href="/updates" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100">
          <ArrowLeft className="w-4 h-4" /> All updates
        </Link>
      </motion.div>

      {/* Hero */}
      <motion.header variants={fadeUp} className="border-2 border-foreground bg-card overflow-hidden">
        {hero && (
          <div className="w-full aspect-[16/9] md:aspect-[21/9] border-b-2 border-foreground overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.image_url!}
              alt={hero.image_alt ?? ''}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-8 flex items-start gap-4 md:gap-6">
          <div className={cn('p-3 md:p-4 border-2 border-foreground shrink-0 shadow-[4px_4px_0px_var(--color-foreground)]', theme.block)}>
            <Icon className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="flex flex-col gap-2 min-w-0">
            {item.tag && (
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{item.tag}</span>
            )}
            <h1 className="text-2xl md:text-4xl font-heading font-bold uppercase tracking-wide leading-none">
              {item.title}
            </h1>
            {item.subtitle && (
              <p className="text-sm md:text-base font-medium opacity-70">{item.subtitle}</p>
            )}
          </div>
        </div>
      </motion.header>

      {item.details_description || item.details_requirements || item.details_process || item.details_costs ? (
        <div className="flex flex-col gap-6">
          {item.details_description && (
            <motion.section variants={fadeUp} className="border-2 border-foreground bg-card p-6 md:p-8 shadow-[4px_4px_0px_var(--color-foreground)]">
              <h2 className="text-xl font-heading font-bold uppercase tracking-wide mb-4">Description</h2>
              <div className="text-sm md:text-base font-medium opacity-80 leading-relaxed whitespace-pre-wrap">
                {item.details_description}
              </div>
            </motion.section>
          )}

          {item.details_requirements && (
            <motion.section variants={fadeUp} className="border-2 border-foreground bg-card p-6 md:p-8 shadow-[4px_4px_0px_var(--color-foreground)]">
              <h2 className="text-xl font-heading font-bold uppercase tracking-wide mb-4">Requirements</h2>
              <div className="text-sm md:text-base font-medium opacity-80 leading-relaxed whitespace-pre-wrap">
                {item.details_requirements}
              </div>
            </motion.section>
          )}

          {item.details_process && (
            <motion.section variants={fadeUp} className="border-2 border-foreground bg-card p-6 md:p-8 shadow-[4px_4px_0px_var(--color-foreground)]">
              <h2 className="text-xl font-heading font-bold uppercase tracking-wide mb-4">Application Process</h2>
              <div className="text-sm md:text-base font-medium opacity-80 leading-relaxed whitespace-pre-wrap">
                {item.details_process}
              </div>
            </motion.section>
          )}

          {item.details_costs && (
            <motion.section variants={fadeUp} className="border-2 border-foreground bg-card p-6 md:p-8 shadow-[4px_4px_0px_var(--color-foreground)]">
              <h2 className="text-xl font-heading font-bold uppercase tracking-wide mb-4">Pricing & Costs</h2>
              <div className="text-sm md:text-base font-medium opacity-80 leading-relaxed whitespace-pre-wrap">
                {item.details_costs}
              </div>
            </motion.section>
          )}

          {item.cta_label && item.cta_href && (
            <motion.div variants={fadeUp} className="flex justify-center mt-4 mb-4">
              <a 
                href={item.cta_href} 
                className="group inline-flex items-center gap-3 border-2 border-foreground bg-foreground text-background px-8 py-4 font-bold uppercase text-sm md:text-base tracking-widest shadow-[6px_6px_0px_var(--color-foreground)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all"
              >
                {item.cta_label}
              </a>
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="mt-2 border-2 border-foreground bg-muted p-6 text-center">
            <h3 className="font-heading font-bold uppercase tracking-wide">Need Help?</h3>
            <p className="text-sm opacity-70 mb-4 mt-2 font-medium">Our support team is available 24/7 to assist you.</p>
            <Link href="/support" className="inline-flex items-center gap-2 border-2 border-foreground bg-background px-5 py-2.5 font-bold uppercase text-xs tracking-widest shadow-[3px_3px_0px_var(--color-foreground)] hover:shadow-none hover:translate-y-[3px] hover:translate-x-[3px] transition-all">
              Contact Support
            </Link>
          </motion.div>
        </div>
      ) : (
        <motion.article variants={fadeUp} className="border-2 border-foreground bg-card p-6 md:p-8">
          {item.body?.length ? (
            <ContentBlocks blocks={item.body} />
          ) : (
            <p className="text-sm md:text-base font-medium opacity-80 leading-relaxed">
              {item.excerpt}
            </p>
          )}
        </motion.article>
      )}
    </motion.div>
  );
}
