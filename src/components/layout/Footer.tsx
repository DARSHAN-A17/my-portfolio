import { socialLinks } from "../../data/socialLinks";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-[#0F0F0E]">
      <div className="mx-auto max-w-[1280px] px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="DARSHAN A — portfolio logo"
            draggable={false}
            className="block select-none"
            style={{ width: 40, height: 40, objectFit: "contain" }}
          />
          <div className="text-[11px] font-mono tracking-[0.14em] text-[#A8A39A]">
            © {year} DARSHAN A — Built with precision. <span className="text-[#A8A39A]/60">Backend mindset, cinematic finish.</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono tracking-[0.14em] text-[#A8A39A]">
          {socialLinks.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="hover:text-[#F1EDE8] transition-colors">
              {s.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}








