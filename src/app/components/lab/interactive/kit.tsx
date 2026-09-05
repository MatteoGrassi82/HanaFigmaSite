import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../../../lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * kit.tsx — the shared primitives for the interactive blocks.
 *
 * THE RULES THESE PRIMITIVES ENCODE
 *   1. One input, one number. A component that needs three fields and a Submit
 *      button has failed, so there is no form, no submit and no reset here.
 *   2. The output is type, not a chart. <BigStat> is the whole output layer.
 *   3. It updates live. <Dial> calls onChange on every input event.
 *   4. The arithmetic is visible. <Arithmetic> is not optional decoration; it is
 *      the thing that stops a number being a black box.
 *   5. Honest default. Every component renders a true sentence before anyone
 *      touches it, which is also what the crawler sees (see PRERENDER below).
 *   6. Sliders are miserable on touch, so <Dial> always renders three preset
 *      tap-targets next to the track. They are not a mobile-only fallback and
 *      they never hide at any width.
 *   7. Reduced motion is respected, and nothing reflows as digits change:
 *      tabular figures plus a pinned character width on every live number.
 *
 * PRERENDER
 * The build snapshots every route in headless Chrome, so the DEFAULT STATE is
 * what Google indexes. Nothing here waits on an effect to render its content:
 * useUrlState returns its initial value on the first render and only looks at
 * the URL after mount, so the snapshot is always the honest default rather than
 * whatever a shared link happened to contain.
 *
 * TOKENS
 * Colour, radius, shadow and the type scale come from src/styles/tokens.css.
 * There is no hex in this file, so the .cobalt scope reskins all of it.
 * ─────────────────────────────────────────────────────────────────────────── */

/* ── Panel ─────────────────────────────────────────────────────────────────
 * The frame every interactive block shares: one card, one eyebrow, one
 * heading, one footnote slot. Sections keep their own padding and rhythm; the
 * panel only owns the card.
 */
export interface PanelProps {
  eyebrow?: string;
  title?: React.ReactNode;
  titleSize?: "h3" | "h2";
  sub?: React.ReactNode;
  footnote?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Panel({
  eyebrow,
  title,
  titleSize = "h3",
  sub,
  footnote,
  children,
  className,
  bodyClassName,
}: PanelProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-card border border-rule bg-paper-bright shadow-card p-6 sm:p-8 md:p-10",
        className
      )}
    >
      {(eyebrow || title || sub) && (
        <div className="mb-7 md:mb-9">
          {eyebrow && (
            <p className="text-eyebrow font-bold uppercase text-brand m-0">{eyebrow}</p>
          )}
          {title && (
            <h3
              className={cn(
                "font-serif font-normal leading-[1.12] text-navy m-0 max-w-[26ch]",
                eyebrow && "mt-3",
                titleSize === "h2" ? "text-[30px] sm:text-[38px] md:text-h2" : "text-[24px] md:text-h3"
              )}
            >
              {title}
            </h3>
          )}
          {sub && (
            <p className="text-[15.5px] leading-[1.65] text-ink-soft max-w-[58ch] mt-3 mb-0">{sub}</p>
          )}
        </div>
      )}

      <div className={bodyClassName}>{children}</div>

      {footnote && (
        <div className="mt-8 pt-6 border-t border-rule-soft">
          <p className="text-[13px] leading-[1.65] text-ink-soft m-0 max-w-[68ch]">{footnote}</p>
        </div>
      )}
    </motion.div>
  );
}

/* ── BigStat ───────────────────────────────────────────────────────────────
 * The output. One figure, set large in the serif, with the unit riding above
 * the baseline the way the numbers on /remote-v2 already do.
 *
 * `width` is the important prop: it pins the figure to a character count, so
 * 9 becoming 10 becoming 100 never moves anything on the page. Pass the widest
 * value the component can produce, not the current one.
 */
export interface BigStatProps {
  value: string | number;
  unit?: string;
  label: string;
  sub?: React.ReactNode;
  /** Character width to reserve for the figure. Pass the widest possible value. */
  width?: number;
  /** Reserve N lines of space under the label so changing copy cannot reflow. */
  subLines?: number;
  tone?: "navy" | "brand";
  size?: "lg" | "md";
  className?: string;
}

export function BigStat({
  value,
  unit,
  label,
  sub,
  width,
  subLines,
  tone = "navy",
  size = "lg",
  className,
}: BigStatProps) {
  const reduce = useReducedMotion();
  return (
    <div className={cn(className)}>
      <p
        className={cn(
          "font-serif font-normal leading-none tabular-nums m-0",
          tone === "brand" ? "text-brand" : "text-navy",
          size === "lg"
            ? "text-[52px] sm:text-[60px] md:text-display"
            : "text-[34px] sm:text-[40px] md:text-h2"
        )}
      >
        <motion.span
          key={String(value)}
          initial={reduce ? false : { opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="inline-block"
          style={width ? { minWidth: `${width}ch` } : undefined}
        >
          {value}
        </motion.span>
        {unit && (
          <span
            className={cn(
              "font-sans font-semibold align-super ml-1 text-[0.32em]",
              tone === "brand" ? "text-navy" : "text-brand"
            )}
          >
            {unit}
          </span>
        )}
      </p>

      <p className="text-[15px] font-semibold text-ink mt-4 mb-0">{label}</p>

      {(sub || subLines) && (
        <p
          className="text-[14px] leading-[1.6] text-ink-soft mt-2 mb-0 max-w-[36ch]"
          style={subLines ? { minHeight: `${subLines * 1.6}em` } : undefined}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/* ── Arithmetic ────────────────────────────────────────────────────────────
 * The small line under the stat that shows the working: "1,200 patients ×
 * 62% Medicare × 20 min". Values carry the weight, the units stay quiet, and
 * everything is tabular so the line does not jitter while a dial moves.
 */
export interface ArithmeticPart {
  value: string;
  label?: string;
}

export interface ArithmeticProps {
  parts: ArithmeticPart[];
  /** The operator drawn between parts. A glyph, not prose. */
  op?: string;
  result?: ArithmeticPart;
  className?: string;
}

export function Arithmetic({ parts, op = "×", result, className }: ArithmeticProps) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[13px] leading-[1.5] m-0",
        className
      )}
    >
      {parts.map((part, i) => (
        <React.Fragment key={`${part.value}-${i}`}>
          {i > 0 && (
            <span aria-hidden className="text-ink-mute">
              {op}
            </span>
          )}
          <span className="text-ink-soft">
            <span className="font-semibold text-ink tabular-nums">{part.value}</span>
            {part.label ? ` ${part.label}` : null}
          </span>
        </React.Fragment>
      ))}
      {result && (
        <>
          <span aria-hidden className="text-ink-mute">
            =
          </span>
          <span className="text-ink-soft">
            <span className="font-semibold text-brand tabular-nums">{result.value}</span>
            {result.label ? ` ${result.label}` : null}
          </span>
        </>
      )}
    </p>
  );
}

/* ── Note ──────────────────────────────────────────────────────────────────
 * The caveat, the source, the attribution. Small, but never light gray: this
 * is prose, so it sits on text-ink-soft and not on text-ink-mute.
 */
export function Note({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-[12.5px] leading-[1.65] text-ink-soft m-0 max-w-[66ch]", className)}>
      {children}
    </p>
  );
}

/* ── Dial ──────────────────────────────────────────────────────────────────
 * A range input dressed in the tokens, with three preset tap-targets beside it.
 *
 * The presets are the mobile treatment and they are always visible. Dragging a
 * 10px track with a thumb is miserable on a phone, so every value that matters
 * is one 44px tap away. Omit `presets` and the dial derives three from the
 * range, so a component never has to think about it.
 *
 * The <style> block ships with the component on purpose. Range thumbs can only
 * be styled through vendor pseudo-elements, which no inline style can reach,
 * and the block is inert markup so it is present in the prerendered snapshot.
 */
const DIAL_CSS = `
.hana-dial{-webkit-appearance:none;appearance:none;display:block;width:100%;height:26px;background:transparent;cursor:pointer;}
.hana-dial:focus{outline:none;}
.hana-dial::-webkit-slider-runnable-track{height:10px;border-radius:var(--radius-pill);background:linear-gradient(to right,var(--color-brand) 0 var(--dial-fill),var(--color-rule) var(--dial-fill) 100%);}
.hana-dial::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;height:26px;width:26px;margin-top:-8px;border-radius:var(--radius-pill);background:var(--color-paper-bright);border:2px solid var(--color-brand);box-shadow:var(--shadow-card);}
.hana-dial::-moz-range-track{height:10px;border-radius:var(--radius-pill);background:linear-gradient(to right,var(--color-brand) 0 var(--dial-fill),var(--color-rule) var(--dial-fill) 100%);}
.hana-dial::-moz-range-thumb{box-sizing:border-box;height:24px;width:24px;border-radius:var(--radius-pill);background:var(--color-paper-bright);border:2px solid var(--color-brand);box-shadow:var(--shadow-card);}
.hana-dial:focus-visible::-webkit-slider-thumb{outline:2px solid var(--color-brand);outline-offset:3px;}
.hana-dial:focus-visible::-moz-range-thumb{outline:2px solid var(--color-brand);outline-offset:3px;}
`;

export interface DialPreset {
  value: number;
  label: string;
  /** The second line on the tap-target. Say what the value means, not what it does. */
  note?: string;
}

export interface DialProps {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
  step?: number;
  /** How the value reads in the label row and on derived presets. */
  format?: (value: number) => string;
  /** What a screen reader hears instead of the bare number. */
  valueText?: (value: number) => string;
  presets?: DialPreset[];
  /** id of the element that states the consequence, so the control describes it. */
  describedBy?: string;
  className?: string;
}

export function Dial({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format,
  valueText,
  presets,
  describedBy,
  className,
}: DialProps) {
  const id = useId();
  const fmt = format ?? ((v: number) => String(v));
  const span = max - min || 1;
  const pct = ((clamp(value, min, max) - min) / span) * 100;

  const taps: DialPreset[] =
    presets ??
    [min, min + Math.round(span / 2 / step) * step, max].map((v) => ({
      value: clamp(v, min, max),
      label: fmt(clamp(v, min, max)),
    }));

  return (
    <div className={cn(className)}>
      <style>{DIAL_CSS}</style>

      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[13.5px] font-semibold text-ink">
          {label}
        </label>
        <span className="text-[13.5px] font-semibold text-brand tabular-nums">{fmt(value)}</span>
      </div>

      <input
        id={id}
        type="range"
        className="hana-dial mt-4"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={valueText ? valueText(value) : undefined}
        aria-describedby={describedBy}
        style={{ "--dial-fill": `${pct}%` } as React.CSSProperties}
      />

      <div className="flex items-center justify-between gap-4 mt-2">
        <span className="text-[12px] text-ink-mute tabular-nums">{fmt(min)}</span>
        <span className="text-[12px] text-ink-mute tabular-nums">{fmt(max)}</span>
      </div>

      {/* The presets. Always visible, 44px tall, one tap to every value worth
          landing on. On touch this is the control; the track is the garnish. */}
      <div className="grid grid-cols-3 gap-2 mt-5">
        {taps.map((p) => {
          const on = p.value === value;
          return (
            <button
              key={`${p.value}-${p.label}`}
              type="button"
              onClick={() => onChange(p.value)}
              aria-pressed={on}
              className={cn(
                "min-h-[52px] px-3 py-2 rounded-tile border text-left cursor-pointer transition-colors",
                on
                  ? "border-brand bg-brand-tint"
                  : "border-rule bg-paper hover:border-brand-soft"
              )}
            >
              <span
                className={cn(
                  "block text-[14px] font-semibold tabular-nums",
                  on ? "text-brand" : "text-navy"
                )}
              >
                {p.label}
              </span>
              {p.note && (
                <span className="block text-[11.5px] leading-[1.35] text-ink-soft mt-0.5">
                  {p.note}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── helpers ───────────────────────────────────────────────────────────── */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** 7200 → "7,200". US grouping, because every figure on this site is US. */
export function formatInt(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

/* ── useUrlState ───────────────────────────────────────────────────────────
 * A result you can send someone, without costing the crawler its content.
 *
 * First render always returns `initial`. That is the whole trick: the headless
 * Chrome snapshot, and every visitor's first paint, show the honest default
 * rather than a value read out of the address bar. Only after mount does the
 * hook adopt a param, and only replaceState is ever called, so the back button
 * still leaves the page rather than walking through every dial position.
 *
 * Pass a `parse` that rejects what your component cannot render. A search param
 * is a stranger's input, and a page that indexes its default state should never
 * be talked into displaying a number it does not believe.
 */
export interface UrlStateCodec<T> {
  parse: (raw: string) => T | null;
  format: (value: T) => string;
}

export function useUrlState<T extends string | number>(
  key: string,
  initial: T,
  codec?: Partial<UrlStateCodec<T>>
): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(initial);

  const initialRef = useRef(initial);
  const codecRef = useRef(codec);
  codecRef.current = codec;

  const parse = useCallback((raw: string): T | null => {
    const custom = codecRef.current?.parse;
    if (custom) return custom(raw);
    if (typeof initialRef.current === "number") {
      const n = Number(raw);
      return Number.isFinite(n) ? ((n as unknown) as T) : null;
    }
    return (raw as unknown) as T;
  }, []);

  const format = useCallback((next: T): string => {
    const custom = codecRef.current?.format;
    return custom ? custom(next) : String(next);
  }, []);

  // Adopt the param after mount only. Never during the first render.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let raw: string | null = null;
    try {
      raw = new URLSearchParams(window.location.search).get(key);
    } catch {
      return;
    }
    if (raw === null) return;
    const parsed = parse(raw);
    if (parsed !== null) setValue(parsed);
  }, [key, parse]);

  // Writing happens in the setter, not an effect, so mounting never touches the
  // URL and a default value clears the param instead of pinning it.
  const set = useCallback(
    (next: T) => {
      setValue(next);
      if (typeof window === "undefined") return;
      try {
        const url = new URL(window.location.href);
        if (next === initialRef.current) url.searchParams.delete(key);
        else url.searchParams.set(key, format(next));
        window.history.replaceState(window.history.state, "", url);
      } catch {
        // History blocked or sandboxed. The control still works; the link is
        // just not shareable, which is the right thing to lose.
      }
    },
    [key, format]
  );

  return [value, set];
}
