import { getMenuBarSVG } from './logos.js';

/**
 * Brand motion — the shared shell animation for the Hanzo mark, pure CSS:
 *
 *  1. intro flip   — mark flips in (rotateY 180° → 0, scale .6 → 1, fade)
 *  2. idle breathe — a slow, subtle scale pulse once at rest
 *  3. wordmark     — slides in after the flip, holds, then collapses;
 *                    returns on :hover of the shell
 *
 * All reduced-motion-safe. Framework-free: pair `MOTION_CSS` with
 * `getMotionHTML()` from React, Svelte, Tamagui, or plain HTML — the mark
 * and wordmark inherit `currentColor`, so theming is one `color` away.
 */
export const MOTION_CSS = `.hanzo-motion{display:inline-flex;align-items:center;color:inherit}
.hanzo-motion .hanzo-mark{display:block;line-height:0;width:1.25em;height:1.25em;animation:hanzo-flip .5s cubic-bezier(.16,1,.3,1) .2s backwards,hanzo-breathe 6s ease-in-out 3.2s infinite}
.hanzo-motion .hanzo-mark svg{display:block;width:100%;height:100%}
.hanzo-motion .hanzo-word{overflow:hidden;display:inline-block;margin-left:.5em}
.hanzo-motion .hanzo-word>span{display:inline-block;white-space:nowrap;font-weight:600;transform:translateX(-102%);transition:transform .3s ease-out;animation:hanzo-word 2.8s ease-out}
.hanzo-motion:hover .hanzo-word>span{transform:translateX(0)}
@keyframes hanzo-flip{from{opacity:0;transform:perspective(320px) rotateY(180deg) scale(.6)}to{opacity:1;transform:none}}
@keyframes hanzo-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
@keyframes hanzo-word{0%,40%{transform:translateX(-102%)}55%,82%{transform:translateX(0)}100%{transform:translateX(-102%)}}
@media (prefers-reduced-motion:reduce){.hanzo-motion .hanzo-mark,.hanzo-motion .hanzo-word>span{animation:none!important}.hanzo-motion .hanzo-word>span{transition:none}}`;

/**
 * The motion shell markup — mark + collapsing wordmark. Inline it (with
 * `MOTION_CSS` in a <style>) anywhere HTML renders; not for <img>.
 */
export function getMotionHTML(wordmark = 'Hanzo'): string {
  return (
    `<span class="hanzo-motion">` +
    `<span class="hanzo-mark">${getMenuBarSVG()}</span>` +
    `<span class="hanzo-word"><span>${wordmark}</span></span>` +
    `</span>`
  );
}

/** The shell + its CSS as one self-contained HTML fragment. */
export function getMotionMarkup(wordmark = 'Hanzo'): string {
  return `<style>${MOTION_CSS}</style>${getMotionHTML(wordmark)}`;
}
