/**
 * PORTRAIT 360 — the swappable hero component.
 *
 * Current (placeholder) version: your photo on a thin 3D card that turns a
 * full 360° on the Y axis as you scroll, with mouse-tilt parallax and orbit rings.
 * The back face is "code-themed".
 *
 * TO SWAP for a real turntable later: keep the same props (`progress` 0→1)
 * and draw frame `Math.floor(progress * (frames - 1))` of an image sequence on
 * a <canvas>, or set `video.currentTime = progress * video.duration` on an MP4.
 */
import { useEffect, useRef } from "react";
import portrait from "@/assets/portrait.webp";

export function Portrait360({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const tilt = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onMove = (e: PointerEvent) => {
      tilt.current.x = (e.clientY / innerHeight - 0.5) * -10;
      tilt.current.y = (e.clientX / innerWidth - 0.5) * 14;
    };
    addEventListener("pointermove", onMove);
    let raf = 0;
    const loop = () => {
      const turn = reduce ? 0 : progressRef.current * 360;
      if (cardRef.current) {
        cardRef.current.style.transform = `rotateX(${tilt.current.x}deg) rotateY(${turn + tilt.current.y}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
    };
  }, [progressRef]);

  return (
    <div className="relative mx-auto aspect-[4/5] w-[min(72vw,380px)]" style={{ perspective: "1100px" }}>
      {/* Orbiting rings */}
      <div aria-hidden className="absolute -inset-[18%] animate-[spin_22s_linear_infinite] rounded-full border border-gold/30 [transform:rotateX(70deg)]" />
      <div aria-hidden className="absolute -inset-[30%] animate-[spin_34s_linear_infinite_reverse] rounded-full border border-dashed border-violet/30 [transform:rotateX(64deg)_rotateY(14deg)]" />
      {/* Soft glow behind */}
      <div aria-hidden className="absolute inset-[10%] rounded-full bg-gold/25 blur-[80px]" />

      <div ref={cardRef} className="relative h-full w-full [transform-style:preserve-3d] will-change-transform">
        {/* FRONT */}
        <div className="glass absolute inset-0 overflow-hidden rounded-[2rem] [backface-visibility:hidden]">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,color-mix(in_oklab,var(--gold)_22%,transparent),transparent_65%)]" />
          <img
            src={portrait}
            alt="Portrait of C Shrujan Reddy"
            width={900}
            height={889}
            fetchPriority="high"
            className="absolute bottom-0 left-1/2 w-[105%] max-w-none -translate-x-1/2 [filter:drop-shadow(0_0_22px_color-mix(in_oklab,var(--gold)_45%,transparent))_contrast(1.05)]"
          />
          {/* rim light */}
          <div aria-hidden className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_60px_-10px_var(--violet)]" />
        </div>
        {/* BACK (code-themed) */}
        <div className="glass absolute inset-0 rounded-[2rem] p-6 font-mono text-xs leading-relaxed text-muted-foreground [backface-visibility:hidden] [transform:rotateY(180deg)] sm:text-sm">
          <p><span className="text-violet">class</span> <span className="text-gold">Shrujan</span>:</p>
          <p className="pl-4"><span className="text-violet">def</span> <span className="text-foreground">__init__</span>(self):</p>
          <p className="pl-8">self.stack = [<span className="text-gold">"Python"</span>,</p>
          <p className="pl-14"><span className="text-gold">"MERN"</span>, <span className="text-gold">"ML"</span>]</p>
          <p className="pl-8">self.city = <span className="text-gold">"Bengaluru"</span></p>
          <p className="pl-8">self.status = <span className="text-gold">"open_to_work"</span></p>
          <p className="mt-4 pl-4"><span className="text-violet">def</span> <span className="text-foreground">build</span>(self, idea):</p>
          <p className="pl-8"><span className="text-violet">return</span> ship(idea)</p>
          <p className="mt-6 text-gold/70"># keep scrolling ↓</p>
        </div>
      </div>
    </div>
  );
}
