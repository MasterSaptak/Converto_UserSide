import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { Lock, Shield, Globe, Zap } from 'lucide-react';

export function ResponsiveFooter() {
  return (
    <footer className="w-full border-t-2 border-foreground bg-background pt-10 pb-24 md:pb-8 px-4 md:px-12 flex flex-col relative z-10">
      <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-8 mb-4">
        {/* Brand & Socials */}
        <div className="flex flex-col gap-6 lg:max-w-xs">
          <div className="flex flex-col">
            <Link href="/" title="Converto Homepage">
              <div className="w-32 h-32 border-2 border-foreground bg-white overflow-hidden flex items-center justify-center mb-3 group cursor-pointer p-2">
                <Image src="/Logo.png" alt="Converto Logo" width={128} height={128} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" />
              </div>
            </Link>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70 leading-relaxed">
              Your All-in-One Global Service Platform
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border-2 border-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-[3px_3px_0px_var(--color-foreground)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]" title="Facebook">
              <FaFacebook className="w-4 h-4" />
            </div>
            <div className="w-9 h-9 border-2 border-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-[3px_3px_0px_var(--color-foreground)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]" title="Instagram">
              <FaInstagram className="w-4 h-4" />
            </div>
            <div className="w-9 h-9 border-2 border-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-[3px_3px_0px_var(--color-foreground)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]" title="LinkedIn">
              <FaLinkedin className="w-4 h-4" />
            </div>
            <div className="w-9 h-9 border-2 border-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-[3px_3px_0px_var(--color-foreground)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]" title="YouTube">
              <FaYoutube className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 flex-1 lg:max-w-3xl lg:justify-end">
          {/* Services */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold uppercase tracking-widest text-xs border-b-2 border-foreground/10 pb-2">Services</h3>
            <nav className="flex flex-col gap-2.5 text-[10px] font-bold uppercase tracking-wider opacity-80">
              <Link href="/services/payments" title="Global Payment Services" className="hover:text-primary transition-colors hover:translate-x-1 w-fit">Global Payments</Link>
              <Link href="/services/buy-for-me" title="Buy For Me Shopping Service" className="hover:text-primary transition-colors hover:translate-x-1 w-fit">Buy For Me</Link>
              <Link href="/services/education" title="Study Abroad & Education Services" className="hover:text-primary transition-colors hover:translate-x-1 w-fit">Education</Link>
              <Link href="/services/medical" title="Medical Travel & Healthcare Services" className="hover:text-primary transition-colors hover:translate-x-1 w-fit">Medical</Link>
              <Link href="/services/visa" title="Global Visa Processing Services" className="hover:text-primary transition-colors hover:translate-x-1 w-fit">Visa</Link>
            </nav>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold uppercase tracking-widest text-xs border-b-2 border-foreground/10 pb-2">Company</h3>
            <nav className="flex flex-col gap-2.5 text-[10px] font-bold uppercase tracking-wider opacity-80">
              <Link href="/about" title="About Converto" className="hover:text-primary transition-colors hover:translate-x-1 w-fit">About Us</Link>
              <Link href="/contact" title="Contact Our Team" className="hover:text-primary transition-colors hover:translate-x-1 w-fit">Contact</Link>
              <Link href="/careers" title="Careers at Converto" className="hover:text-primary transition-colors hover:translate-x-1 w-fit">Careers</Link>
              <Link href="/blog" title="Read Our Blog" className="hover:text-primary transition-colors hover:translate-x-1 w-fit">Blog</Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold uppercase tracking-widest text-xs border-b-2 border-foreground/10 pb-2">Legal</h3>
            <nav className="flex flex-col gap-2.5 text-[10px] font-bold uppercase tracking-wider opacity-80">
              <Link href="/privacy" title="Privacy Policy" className="hover:text-primary transition-colors hover:translate-x-1 w-fit">Privacy Policy</Link>
              <Link href="/terms" title="Terms & Conditions" className="hover:text-primary transition-colors hover:translate-x-1 w-fit">Terms & Conditions</Link>
              <Link href="/refund" title="Refund Policy" className="hover:text-primary transition-colors hover:translate-x-1 w-fit">Refund Policy</Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold uppercase tracking-widest text-xs border-b-2 border-foreground/10 pb-2">Resources</h3>
            <nav className="flex flex-col gap-2.5 text-[10px] font-bold uppercase tracking-wider opacity-80">
              <Link href="/support" title="Help Center and Support" className="hover:text-primary transition-colors hover:translate-x-1 w-fit">Help Center</Link>
              <Link href="/guides" title="Service Usage Guides" className="hover:text-primary transition-colors hover:translate-x-1 w-fit">Service Guides</Link>
              <Link href="/track" title="Track Your Order" className="hover:text-primary transition-colors hover:translate-x-1 w-fit">Track Order</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Trust Strip */}
      <div className="border-t-2 border-foreground/10 py-6 mt-4 flex flex-wrap justify-center md:justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest opacity-80">
        <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Secure Payments</div>
        <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Privacy Protected</div>
        <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Global Services</div>
        <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Fast Support</div>
      </div>

      {/* Bottom Copyright */}
      <div className="pt-6 border-t-2 border-foreground flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase font-bold tracking-widest text-center">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <span className="opacity-80">© {new Date().getFullYear()} Converto. All Rights Reserved.</span>
          <span className="opacity-40 hidden md:inline">•</span>
          <span className="opacity-60 bg-foreground/5 px-2 py-0.5 rounded-full border border-foreground/10">Beta v0.9.4</span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 opacity-80">
          <span>Built in India 🇮🇳</span>
          <span className="opacity-40 hidden md:inline">•</span>
          <span>Serving customers worldwide 🌍</span>
        </div>
      </div>
    </footer>
  );
}
