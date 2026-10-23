import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "../../animations/core";
import { Mail, GitBranch, Globe, ArrowUpRight, Send, Check, MapPin } from "lucide-react";
import { profile } from "../../data/profile";
import { socialLinks } from "../../data/socialLinks";

const iconMap: Record<string, any> = { Github: GitBranch, Linkedin: Globe, Mail };

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (glowRef.current) {
        gsap.to(glowRef.current, { y: -22, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1.5 } });
        gsap.to(glowRef.current, { opacity: 0.85, scale: 1.06, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (form.message.trim().length < 10) e.message = "Message should be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    
    setSubmitProgress(10);
    await new Promise(r => setTimeout(r, 300));
    setSubmitProgress(40);
    await new Promise(r => setTimeout(r, 300));
    setSubmitProgress(70);
    await new Promise(r => setTimeout(r, 300));
    setSubmitProgress(100);
    
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSubmitProgress(0);
      setForm({ name: "", email: "", message: "" });
    }, 2600);
  };

  return (
    <section ref={ref} id="contact" className="relative bg-[#141613] border-t border-[rgba(241,237,232,0.06)] overflow-hidden">
      <div ref={glowRef} className="absolute -top-28 left-[12%] w-[720px] h-[460px] rounded-full blur-[130px] pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(217,168,92,0.09), transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-[520px] h-[520px] rounded-full blur-[140px] pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(241,237,232,0.14), transparent 70%)" }} />
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-12 lg:py-16 contact-calm relative">
        <div className="mb-10">
          <div className="text-[11px] tracking-[0.32em] font-mono text-[#D9A85C]">07 — CONTACT</div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-[clamp(28px,4.4vw,54px)] font-black tracking-[-0.05em] leading-[0.85] text-[#F1EDE8]"
          >
            LET&apos;S BUILD
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(28px,4.4vw,54px)] font-light tracking-[-0.05em] leading-[0.85] text-white/70 -mt-1"
          >
            SOMETHING REAL
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 h-px w-full max-w-[300px] bg-gradient-to-r from-white/10 to-transparent"
          />
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10">
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-[30px] sm:text-[40px] leading-[0.9] tracking-[-0.04em] font-light text-white"
            >
              Have an idea? <br />
              <span className="font-semibold">Let&apos;s make it happen.</span>
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 text-[14px] leading-[1.7] text-white/55 max-w-[560px]"
            >
              I&apos;m open to backend collaborations, freelance builds, and product-minded teams that value clean engineering. 
              Whether it&apos;s an API that needs to scale, an ML model that needs to run on-device, or a pipeline that needs to just work — 
              drop a message. I reply within 24 hours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 space-y-4"
            >
              <a 
                href={`mailto:${profile.email}`} 
                className="group flex items-center gap-3 rounded-2xl border border-[#F1EDE8]/10 bg-white text-black px-5 py-4 hover:bg-white/90 transition-all duration-300"
              >
                <span className="w-10 h-10 rounded-xl bg-black text-white grid place-items-center group-hover:scale-110 transition-transform duration-300">
                  <Mail size={16} />
                </span>
                <div>
                  <div className="text-[11px] tracking-[0.14em] font-mono text-black/50">EMAIL</div>
                  <div className="text-[13px] font-mono font-semibold">{profile.email}</div>
                </div>
                <ArrowUpRight size={16} className="ml-auto group-hover:translate-x-1 transition-transform duration-300" />
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-[#F1EDE8]/10 bg-[#F1EDE8]/[0.03] p-4 hover:bg-white/[0.05] transition-colors">
                  <div className="text-[11px] tracking-[0.14em] font-mono text-[#A8A39A] flex items-center gap-2">
                    <MapPin size={12} /> LOCATION
                  </div>
                  <div className="text-[13px] font-medium text-white mt-1">{profile.location}</div>
                </div>
                <div className="rounded-2xl border border-[#F1EDE8]/10 bg-[#F1EDE8]/[0.03] p-4 hover:bg-white/[0.05] transition-colors">
                  <div className="text-[11px] tracking-[0.14em] font-mono text-[#A8A39A]">RESPONSE</div>
                  <div className="text-[13px] font-medium text-white mt-1">{'<'} 24 hours</div>
                </div>
                <div className="rounded-2xl border border-[#F1EDE8]/10 bg-[#F1EDE8]/[0.03] p-4 hover:bg-white/[0.05] transition-colors">
                  <div className="text-[11px] tracking-[0.14em] font-mono text-[#A8A39A]">STATUS</div>
                  <div className="text-[13px] font-medium text-emerald-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Available
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {socialLinks.map((s) => {
                  const Icon = iconMap[s.icon] ?? GitBranch;
                  return (
                    <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#F1EDE8]/10 bg-[#F1EDE8]/[0.04] text-white/70 hover:text-[#F1EDE8] hover:border-white/20 hover:bg-[#F1EDE8]/10 transition-all duration-300 text-[11px] tracking-[0.14em] font-mono">
                      <Icon size={14} className="group-hover:scale-110 transition-transform" /> {s.name.toUpperCase()}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          <motion.form
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[24px] border border-[#F1EDE8]/10 bg-[#F1EDE8]/[0.03] backdrop-blur p-6 sm:p-7 space-y-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D9A85C]/[0.05] via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D9A85C] to-transparent opacity-50" />
            
            <div className="relative flex items-center justify-between">
              <span className="text-[11px] tracking-[0.18em] font-mono text-[#A8A39A]">SEND A MESSAGE</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-[#F1EDE8]/10 text-[#A8A39A]">Validated UI — no backend yet</span>
            </div>

            <div>
              <label className="text-[11px] tracking-[0.14em] font-mono text-[#A8A39A]">NAME</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="mt-1.5 w-full rounded-xl border border-[#F1EDE8]/10 bg-black/30 px-4 py-3 text-[13px] text-white placeholder:text-[#A8A39A]/60 focus:outline-none focus:border-white/20 focus:border-[#D9A85C]/50 transition-colors"
              />
              {errors.name && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[11px] text-red-400 font-mono mt-1 block">{errors.name}</motion.span>}
            </div>

            <div>
              <label className="text-[11px] tracking-[0.14em] font-mono text-[#A8A39A]">EMAIL</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                type="email"
                className="mt-1.5 w-full rounded-xl border border-[#F1EDE8]/10 bg-black/30 px-4 py-3 text-[13px] text-white placeholder:text-[#A8A39A]/60 focus:outline-none focus:border-white/20 focus:border-[#D9A85C]/50 transition-colors"
              />
              {errors.email && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[11px] text-red-400 font-mono mt-1 block">{errors.email}</motion.span>}
            </div>

            <div>
              <label className="text-[11px] tracking-[0.14em] font-mono text-[#A8A39A]">MESSAGE</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about your project, stack, and timeline..."
                rows={5}
                className="mt-1.5 w-full rounded-xl border border-[#F1EDE8]/10 bg-black/30 px-4 py-3 text-[13px] text-white placeholder:text-[#A8A39A]/60 focus:outline-none focus:border-white/20 focus:border-[#D9A85C]/50 transition-colors resize-none"
              />
              {errors.message && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[11px] text-red-400 font-mono mt-1 block">{errors.message}</motion.span>}
            </div>

            <button
              type="submit"
              disabled={sent}
              className="relative w-full inline-flex items-center justify-center gap-2 rounded-full bg-white text-black py-3.5 text-[12px] tracking-[0.16em] font-mono font-bold hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {sent ? (
                  <>
                    <Check size={14} /> MESSAGE SENT
                  </>
                ) : (
                  <>
                    <Send size={14} /> SEND MESSAGE
                  </>
                )}
              </span>
              <motion.div
                initial={{ width: 0 }}
                animate={submitProgress > 0 ? { width: `${submitProgress}%` } : { width: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0 bg-gradient-to-r from-[#D9A85C] to-[#D9A85C] origin-left"
              />
            </button>

            {sent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-[11px] font-mono text-emerald-200"
              >
                Validated — wire to EmailJS / Resend in src/lib/email.ts when ready.
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-[10px] font-mono leading-relaxed text-[#A8A39A]/60"
            >
              Abstraction ready: create <span className="text-[#A8A39A]">src/lib/email.ts</span> with <span className="text-[#A8A39A]">sendContact(data)</span> and swap validation for provider call. No keys exposed.
            </motion.div>
          </motion.form>
        </div>
      </div>

      {/* Closing statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-[1280px] px-6 pb-8 pt-8 border-t border-[rgba(241,237,232,0.06)]"
      >
        <div className="text-center">
          <div className="text-[11px] tracking-[0.3em] font-mono text-white/20 mb-3">DARSHAN A — 2026</div>
          <div className="text-[14px] font-light text-[#A8A39A]">
            Built with precision. Backend mindset, cinematic finish.
          </div>
        </div>
      </motion.div>
    </section>
  );
}










