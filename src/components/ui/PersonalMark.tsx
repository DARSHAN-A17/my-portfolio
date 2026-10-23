/**
 * PersonalMark — minimal technical monogram for DARSHAN A.
 *
 * Geometric D + A sharing one vertical stem, inside a thin technical frame
 * with a single accent energy tick. Uses only the site palette
 * (ivory #F1EDE8, gold #D9A85C) so it works on desktop, mobile, GitHub,
 * LinkedIn, resume and future startup contexts.
 *
 * Hover performs ONE subtle effect: an energy sweep across the mark plus a
 * soft accent reveal. No continuous animation.
 */

export default function PersonalMark({ size = 34 }: { size?: number }) {
  return (
    <span className="personal-mark" style={{ width: size, height: size }} aria-hidden>
      <svg viewBox="0 0 40 40" width={size} height={size} fill="none" aria-hidden>
        {/* technical frame — thin, one cut corner */}
        <path
          d="M6 4 H30 L36 10 V34 H6 Z"
          stroke="#A8A39A"
          strokeWidth="1.4"
        />
        {/* shared stem */}
        <line x1="14" y1="11" x2="14" y2="29" stroke="#F1EDE8" strokeWidth="2.2" strokeLinecap="square" />
        {/* D bowl */}
        <path
          d="M14 11 H20.5 C26 11 26 29 20.5 29 H14"
          stroke="#F1EDE8"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* A — diagonal + crossbar that doubles as the energy tick */}
        <path
          d="M22 29 L28 11 L34 29"
          stroke="#F1EDE8"
          strokeWidth="2.2"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
        <line
          className="pm-tick"
          x1="24.2"
          y1="23.4"
          x2="31.8"
          y2="23.4"
          stroke="#D9A85C"
          strokeWidth="2.2"
          strokeLinecap="square"
        />
        {/* energy sweep (hover only) */}
        <rect className="pm-sweep" x="-14" y="2" width="10" height="36" fill="url(#pmSweep)" />
        <defs>
          <linearGradient id="pmSweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#D9A85C" stopOpacity="0" />
            <stop offset="0.5" stopColor="#D9A85C" stopOpacity="0.55" />
            <stop offset="1" stopColor="#D9A85C" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <style>{`
        .personal-mark { position: relative; display: inline-flex; flex: none; border-radius: 6px; }
        .personal-mark svg { display: block; overflow: hidden; border-radius: 6px; }
        .personal-mark .pm-sweep { opacity: 0; }
        .personal-mark .pm-tick { transition: filter 0.35s ease; }
        a:hover .personal-mark .pm-tick, button:hover .personal-mark .pm-tick {
          filter: drop-shadow(0 0 5px rgba(217,168,92,0.9));
        }
        @media (prefers-reduced-motion: no-preference) {
          a:hover .personal-mark .pm-sweep, button:hover .personal-mark .pm-sweep {
            opacity: 1;
            animation: pmSweep 0.7s ease-out 1;
          }
        }
        @keyframes pmSweep { from { transform: translateX(0); } to { transform: translateX(68px); } }
      `}</style>
    </span>
  );
}








