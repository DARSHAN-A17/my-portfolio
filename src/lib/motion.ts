import { getLenis } from "../hooks/useLenis";

/**
 * Motion design tokens.
 * One easing vocabulary for the whole site so every section feels related.
 */
export const ease = {
  /** primary reveal — long tail, cinematic */
  out: [0.16, 1, 0.3, 1] as const,
  /** masked / clip-path reveals */
  expo: [0.19, 1, 0.22, 1] as const,
  /** symmetric transitions (curtains, overlays) */
  inOut: [0.76, 0, 0.24, 1] as const,
  /** short UI feedback */
  snap: [0.34, 1.2, 0.64, 1] as const,
};

/** GSAP string equivalents of the above */
export const gsapEase = {
  out: "expo.out",
  soft: "power3.out",
  inOut: "power4.inOut",
  none: "none",
};

export const duration = {
  fast: 0.4,
  base: 0.7,
  slow: 1.1,
  reveal: 1.35,
};

export function prefersReduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Header offset used by every scroll-to action. */
export const HEADER_OFFSET = 76;

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis && !prefersReduced()) {
    lenis.scrollTo(el, { offset: -HEADER_OFFSET, duration: 1.15 });
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({
      top: y,
      behavior: prefersReduced() ? "auto" : "smooth",
    });
  }
}
