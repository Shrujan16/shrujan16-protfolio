/**
 * Small reusable interactive pieces: magnetic button, tilt card,
 * animated counter, section heading with outlined number + ghost echo.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Sets --mx/--my so the .spotlight glow follows the cursor. */
export function onSpot(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

/** Button/link that gently pulls toward the cursor. */
export function Magnetic({ children, className = "", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <a
      ref={ref}
      {...props}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.3;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        e.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
      }}
      onPointerLeave={(e) => (e.currentTarget.style.transform = "")}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-[transform,box-shadow] duration-200 ease-out ${className}`}
    >
      {children}
    </a>
  );
}

/** Card that tilts in 3D toward the pointer. */
export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      onPointerMove={(e) => {
        onSpot(e);
        const r = e.currentTarget.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -12;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 12;
        e.currentTarget.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      }}
      onPointerLeave={(e) => (e.currentTarget.style.transform = "")}
      className={`glass spotlight rounded-2xl transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </div>
  );
}

/** Counts from 0 to `to` once it scrolls into view. */
export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - start) / 1400, 1);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

/** "01" outlined number + glowing title with a faint ghost echo behind. */
export function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <div className="mb-10 flex items-end gap-5">
      <span aria-hidden className="text-outline font-display text-6xl font-bold leading-none sm:text-8xl">{num}</span>
      <h2 className="relative font-display text-3xl font-bold uppercase tracking-tight text-glow sm:text-5xl">
        <span aria-hidden className="absolute left-1 top-2 select-none text-foreground/10 blur-[1px]">{title}</span>
        <span className="relative">{title}</span>
      </h2>
    </div>
  );
}
