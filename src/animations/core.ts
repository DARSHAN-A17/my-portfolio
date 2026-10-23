import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * Splits an element's text into per-word spans wrapped in overflow-hidden
 * masks so words can be revealed with a clip/translate reveal.
 * Idempotent: re-running on an already-split node is a no-op.
 */
export function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === "true") {
    return Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
  }
  const text = el.textContent ?? "";
  const words = text.split(/(\s+)/);
  el.textContent = "";
  const out: HTMLElement[] = [];

  for (const chunk of words) {
    if (chunk.trim() === "") {
      el.appendChild(document.createTextNode(chunk));
      continue;
    }
    const mask = document.createElement("span");
    mask.style.display = "inline-block";
    mask.style.overflow = "hidden";
    mask.style.verticalAlign = "top";
    // a little vertical breathing room so descenders aren't clipped
    mask.style.paddingBottom = "0.12em";
    mask.style.marginBottom = "-0.12em";

    const inner = document.createElement("span");
    inner.style.display = "inline-block";
    inner.style.willChange = "transform";
    inner.textContent = chunk;
    inner.setAttribute("data-word", "");

    mask.appendChild(inner);
    el.appendChild(mask);
    out.push(inner);
  }
  el.dataset.split = "true";
  return out;
}

/** Reveal words of a heading on scroll — premium editorial (word y + opacity + blur). */
export function revealHeading(
  el: HTMLElement | null,
  opts: { trigger?: Element | null; start?: string; stagger?: number; delay?: number } = {}
) {
  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const words = splitWords(el);
  if (!words.length) return;
  gsap.set(words, { yPercent: 115, opacity: 0, filter: "blur(8px)" });
  gsap.to(words, {
    yPercent: 0,
    opacity: 1,
    filter: "blur(0px)",
    duration: 1.05,
    ease: "expo.out",
    stagger: opts.stagger ?? 0.055,
    delay: opts.delay ?? 0,
    overwrite: "auto",
    scrollTrigger: {
      trigger: opts.trigger ?? el,
      start: opts.start ?? "top 85%",
      once: true,
    },
  });
}

/** Premium word reveal for large editorial lines — stays visible after scroll, cleans up safely. */
export function revealPremiumHeading(
  el: HTMLElement | null,
  opts: { trigger?: Element | null; start?: string; stagger?: number } = {}
) {
  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.style.opacity = "1";
    return;
  }
  const words = splitWords(el);
  if (!words.length) return;
  gsap.set(words, { yPercent: 118, opacity: 0, filter: "blur(10px)" });
  gsap.to(words, {
    yPercent: 0,
    opacity: 1,
    filter: "blur(0px)",
    duration: 0.95,
    ease: "expo.out",
    stagger: opts.stagger ?? 0.06,
    overwrite: "auto",
    scrollTrigger: {
      trigger: opts.trigger ?? el,
      start: opts.start ?? "top 82%",
      once: true,
    },
  });
}

/** Block paragraph reveal — subtle upward + opacity, no per-character churn. */
export function revealParagraph(
  el: HTMLElement | null,
  opts: { trigger?: Element | null; start?: string; delay?: number } = {}
) {
  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.set(el, { opacity: 0, y: 18, filter: "blur(3px)" });
  gsap.to(el, {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    duration: 0.85,
    ease: "power3.out",
    delay: opts.delay ?? 0,
    overwrite: "auto",
    scrollTrigger: {
      trigger: opts.trigger ?? el,
      start: opts.start ?? "top 88%",
      once: true,
    },
  });
}

/** Standard staggered entrance for a group of elements. */
export function revealStack(
  targets: gsap.TweenTarget,
  opts: { trigger?: Element | null; start?: string; y?: number; stagger?: number } = {}
) {
  const list = gsap.utils.toArray<HTMLElement>(targets);
  if (!list.length) return;
  gsap.set(list, { opacity: 0, y: opts.y ?? 26 });
  gsap.to(list, {
    opacity: 1,
    y: 0,
    duration: 0.85,
    ease: "power3.out",
    stagger: opts.stagger ?? 0.08,
    scrollTrigger: {
      trigger: opts.trigger ?? list[0],
      start: opts.start ?? "top 84%",
      once: true,
    },
  });
}

/** Scroll-linked parallax on a layer. */
export function parallax(
  targets: gsap.TweenTarget,
  opts: { trigger?: Element | null; distance?: number } = {}
) {
  const list = gsap.utils.toArray<HTMLElement>(targets);
  if (!list.length) return;
  gsap.to(list, {
    y: opts.distance ?? -60,
    ease: "none",
    scrollTrigger: {
      trigger: opts.trigger ?? list[0],
      start: "top bottom",
      end: "bottom top",
      scrub: 1.2,
    },
  });
}

/** Draws an SVG path as the user scrolls through the trigger. */
export function drawPath(
  path: SVGPathElement | null,
  opts: { trigger?: Element | null; start?: string; end?: string } = {}
) {
  if (!path) return;
  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  gsap.to(path, {
    strokeDashoffset: 0,
    ease: "none",
    scrollTrigger: {
      trigger: opts.trigger ?? path,
      start: opts.start ?? "top 75%",
      end: opts.end ?? "bottom 70%",
      scrub: 1,
    },
  });
}
