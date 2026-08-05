'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import {
  ArrowRight,
  ShieldCheck,
  Globe2,
  Zap,
  Lock,
  Mail,
  Headphones,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   FOOTER LINK DATA
   ───────────────────────────────────────────── */
const FOOTER_COLUMNS = [
  {
    title: 'Services',
    links: [
      { label: 'Global Payments', href: '/services/payments' },
      { label: 'Buy For Me', href: '/services/buy-for-me' },
      { label: 'Education', href: '/services/education' },
      { label: 'Medical', href: '/services/medical' },
      { label: 'Visa', href: '/services/visa' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/support' },
      { label: 'FAQs', href: '/support/faqs' },
      { label: 'Community', href: '/community' },
      { label: 'Updates', href: '/updates' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Refund Policy', href: '/refund' },
    ],
  },
] as const;

const SOCIALS = [
  { icon: FaFacebook, label: 'Facebook', href: '#' },
  { icon: FaInstagram, label: 'Instagram', href: '#' },
  { icon: FaLinkedin, label: 'LinkedIn', href: '#' },
  { icon: FaYoutube, label: 'YouTube', href: '#' },
] as const;

const TRUST_ITEMS = [
  { icon: Lock, label: 'Secure Payments', color: 'text-emerald-500' },
  { icon: ShieldCheck, label: 'Privacy Protected', color: 'text-blue-500' },
  { icon: Globe2, label: '190+ Countries', color: 'text-primary' },
  { icon: Zap, label: '24/7 Support', color: 'text-amber-500' },
] as const;

/* ═════════════════════════════════════════════
   RESPONSIVE FOOTER
   ═════════════════════════════════════════════ */
export function ResponsiveFooter() {
  return (
    <footer className="w-full flex flex-col relative z-10 mt-8 md:mt-16 select-none">

      {/* ════════════════════════════════════════
          MOBILE FOOTER — Compact app-style
          Only visible on screens < md
          ════════════════════════════════════════ */}
      <div className="md:hidden">
        {/* Accent line */}
        <div className="h-1 bg-primary" />

        <div className="bg-foreground text-background px-4 py-4 pb-24">
          {/* Row 1: Logo + Socials */}
          <div className="flex items-center justify-between mb-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white border border-background/20 overflow-hidden flex items-center justify-center">
                <Image src="/Logo.png" alt="Converto" width={32} height={32} className="w-full h-full object-contain" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Converto</span>
            </Link>
            <div className="flex items-center gap-1.5">
              {SOCIALS.map((s) => (
                <Link key={s.label} href={s.href} title={s.label} className="w-7 h-7 bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                  <s.icon className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>

          {/* Row 2: Quick links — horizontal scroll */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3 pb-3 border-b border-background/10">
            {['Services', 'Support', 'Privacy', 'Terms', 'About'].map((l) => (
              <Link key={l} href={`/${l.toLowerCase()}`} className="text-[9px] font-bold uppercase tracking-wider opacity-50 hover:opacity-100 transition-opacity">
                {l}
              </Link>
            ))}
          </div>

          {/* Row 3: Trust badges inline */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-3 pb-3 border-b border-background/10">
            {TRUST_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <item.icon className={`w-3 h-3 ${item.color}`} />
                <span className="text-[7.5px] font-bold uppercase tracking-wider opacity-70">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Row 4: Copyright */}
          <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-wider opacity-40">
            <span>© {new Date().getFullYear()} Converto • All rights reserved</span>
            <span className="bg-primary/80 text-primary-foreground px-1.5 py-0.5 text-[7px] font-black tracking-wider opacity-80">BETA</span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          DESKTOP FOOTER — Full editorial layout
          Only visible on screens >= md
          ════════════════════════════════════════ */}
      <div className="hidden md:flex flex-col">

        {/* 1. CTA BANNER */}
        <section className="relative bg-foreground text-background overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 14px,
                currentColor 14px,
                currentColor 15px
              )`,
            }}
          />
          <div className="h-2 bg-primary w-full" />
          <div className="max-w-7xl mx-auto px-12 py-10 flex flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col gap-3 text-left max-w-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary flex items-center justify-center border-2 border-background/20 shadow-[3px_3px_0px_rgba(255,255,255,0.15)]">
                  <Headphones className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight font-heading">
                  Need Help?
                </h2>
              </div>
              <p className="text-sm opacity-70 max-w-md leading-relaxed">
                Our support team responds within minutes — available around the clock, every day of the year.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/support"
                className="group flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm font-black uppercase tracking-widest border-2 border-background/20 shadow-[6px_6px_0px_rgba(255,255,255,0.15)] hover:shadow-[2px_2px_0px_rgba(255,255,255,0.15)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
              >
                Get Support
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link
                href="mailto:support@converto.saptech.online"
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
              >
                <Mail className="w-3.5 h-3.5" />
                support@converto.saptech.online
              </Link>
            </div>
          </div>
        </section>

        {/* 2. MAIN BODY */}
        <section className="bg-background border-t-2 border-foreground">
          <div className="max-w-7xl mx-auto px-12 py-12">
            <div className="flex flex-row gap-12">
              {/* Brand Column */}
              <div className="flex flex-col gap-5 max-w-[280px] items-start shrink-0">
                <Link href="/" className="group">
                  <div className="w-20 h-20 bg-white border-2 border-foreground shadow-[5px_5px_0px_var(--color-foreground)] group-hover:shadow-[3px_3px_0px_var(--color-foreground)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all overflow-hidden flex items-center justify-center">
                    <Image src="/Logo.png" alt="Converto Logo" width={80} height={80} className="w-full h-full object-contain" />
                  </div>
                </Link>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground leading-relaxed max-w-[200px]">
                  Your all-in-one global service platform
                </p>
                <div className="flex items-center gap-2.5">
                  {SOCIALS.map((s) => (
                    <Link
                      key={s.label}
                      href={s.href}
                      title={s.label}
                      className="w-9 h-9 bg-card border-2 border-foreground flex items-center justify-center shadow-[3px_3px_0px_var(--color-foreground)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <s.icon className="w-3.5 h-3.5" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Navigation Columns */}
              <div className="flex-1 grid grid-cols-4 gap-x-8 gap-y-10">
                {FOOTER_COLUMNS.map((col) => (
                  <div key={col.title} className="flex flex-col gap-5">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-foreground pb-3 border-b-2 border-primary/30 relative">
                      {col.title}
                      <span className="absolute bottom-0 left-0 w-2 h-2 bg-primary translate-y-1/2" />
                    </h3>
                    <nav className="flex flex-col gap-2.5">
                      {col.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
                        >
                          <span className="w-0 group-hover:w-3 h-px bg-primary transition-all duration-300" />
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. TRUST RIBBON */}
        <section className="border-y-2 border-foreground bg-secondary/60">
          <div className="max-w-7xl mx-auto px-12 py-5 flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
            {TRUST_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 group">
                <div className="w-7 h-7 bg-card border border-foreground/15 flex items-center justify-center group-hover:border-foreground/30 transition-colors">
                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 group-hover:text-foreground transition-colors">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. COPYRIGHT BAR */}
        <section className="bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-12 py-6 flex flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
              <span className="opacity-70">© {new Date().getFullYear()} Converto</span>
              <span className="opacity-30">—</span>
              <span className="opacity-50">All rights reserved</span>
              <span className="opacity-30">—</span>
              <span className="bg-primary/90 text-primary-foreground px-2.5 py-1 text-[9px] font-black tracking-[0.2em] shadow-[2px_2px_0px_rgba(255,255,255,0.1)]">
                BETA v2.1
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest opacity-60">
              <span>Built in India 🇮🇳</span>
              <span className="opacity-40">•</span>
              <span>Serving Worldwide 🌍</span>
            </div>
          </div>
        </section>
      </div>

    </footer>
  );
}
