/**
 * The whole portfolio page. Read top to bottom:
 * 1. Loader  2. Smooth scroll + GSAP setup  3. Hero  4. Sections  5. Contact
 * Content comes from src/data.ts.
 */
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import portrait from "@/assets/portrait.webp";
import { certifications, education, experience, formspreeId, marquee, profile, projects, skills, stats } from "@/data";
import { Portrait360 } from "./Portrait360";
import { Counter, Magnetic, SectionTitle, TiltCard, onSpot } from "./ui";

const Starfield = lazy(() => import("./Starfield"));

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "Who I Am" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "certs", label: "Certifications" },
  { id: "numbers", label: "Numbers" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

/* ---------- 1. LOADER: counts 0→100 while the portrait preloads ---------- */
function Loader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [hide, setHide] = useState(false);
  useEffect(() => {
    let loaded = false;
    const img = new Image();
    img.onload = img.onerror = () => (loaded = true);
    img.src = portrait;
    let p = 0;
    const id = setInterval(() => {
      // Fill to 85% on time, the rest only once assets are ready.
      p = Math.min(p + (loaded ? 6 : p < 85 ? 3 : 0), 100);
      setPct(p);
      if (p >= 100) {
        clearInterval(id);
        setTimeout(() => { setHide(true); onDone(); }, 250);
      }
    }, 30);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <div
      role="status"
      aria-label={`Loading ${pct}%`}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-[clip-path] duration-1000 ease-[cubic-bezier(.77,0,.18,1)] ${hide ? "[clip-path:inset(0_0_100%_0)]" : "[clip-path:inset(0_0_0_0)]"}`}
    >
      <p className="font-display text-2xl font-bold tracking-[0.3em] uppercase text-glow sm:text-4xl">{profile.name}</p>
      <div className="mt-8 h-px w-56 overflow-hidden bg-border">
        <div className="h-full bg-gold shadow-[var(--glow-gold)]" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-4 font-mono text-sm text-gold tabular-nums">{String(pct).padStart(3, "0")}%</p>
    </div>
  );
}

export function Portfolio() {
  const [ready, setReady] = useState(false);
  const heroProgress = useRef(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [active, setActive] = useState("hero");
  const barRef = useRef<HTMLDivElement>(null);

  /* ---------- 2. Smooth scroll (Lenis) + GSAP ScrollTrigger ---------- */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduce ? null : new Lenis({ lerp: 0.1 });
    lenis?.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis?.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // Hero: pinned while the portrait turns 360° and the words swap.
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "+=180%",
        pin: true,
        scrub: true,
        onUpdate: (s) => {
          heroProgress.current = s.progress;
          setWordIdx(Math.min(profile.kineticWords.length - 1, Math.floor(s.progress * profile.kineticWords.length)));
        },
      });

      // Each glass panel flies in with 3D perspective and tilts away as it leaves.
      if (!reduce) {
        gsap.utils.toArray<HTMLElement>(".panel").forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, y: 150, rotateX: 42, scale: 0.9, transformPerspective: 1100 },
            { opacity: 1, y: 0, rotateX: 0, scale: 1, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top bottom", end: "top 55%", scrub: true } });
          gsap.to(el, {
            opacity: 0, y: -130, rotateX: -30, scale: 0.94, transformPerspective: 1100, ease: "power1.in",
            immediateRender: false,
            scrollTrigger: { trigger: el, start: "bottom 35%", end: "bottom top", scrub: true },
          });
        });
      }

      // Active section → nav dots.
      SECTIONS.forEach(({ id }) =>
        ScrollTrigger.create({ trigger: `#${id}`, start: "top center", end: "bottom center", onToggle: (s) => s.isActive && setActive(id) }));

      // Scroll progress bar.
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => { if (barRef.current) barRef.current.style.transform = `scaleX(${s.progress})`; } });
    });

    return () => { ctx.revert(); gsap.ticker.remove(tick); lenis?.destroy(); };
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Loader onDone={() => setReady(true)} />

      {/* Starfield (lazy, client-only) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-0">
        <ClientOnly fallback={null}>
          <Suspense fallback={null}><Starfield /></Suspense>
        </ClientOnly>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,var(--background)_90%)]" />
      </div>

      {/* Scroll progress bar */}
      <div ref={barRef} aria-hidden className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left scale-x-0 bg-gradient-to-r from-gold to-violet" />

      {/* Top nav */}
      <header className="fixed inset-x-0 top-0 z-40">
        <nav aria-label="Main" className="mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full glass mx-3 sm:mx-auto px-4 py-2 sm:px-6">
          <a href="#hero" onClick={go("hero")} className="font-display text-lg font-bold tracking-tight">
            CSR<span className="text-gold">.</span>
          </a>
          <ul className="hidden gap-6 text-sm text-muted-foreground md:flex">
            {SECTIONS.slice(1, 8).filter((s) => ["about", "skills", "projects", "contact"].includes(s.id)).map((s) => (
              <li key={s.id}><a href={`#${s.id}`} onClick={go(s.id)} className="transition-colors hover:text-gold">{s.label}</a></li>
            ))}
          </ul>
          <a href={profile.resumeUrl} download className="rounded-full border border-gold/40 px-4 py-1.5 text-xs font-medium text-gold transition-colors hover:bg-gold hover:text-primary-foreground">
            Resume ↓
          </a>
        </nav>
      </header>

      {/* Section dots */}
      <nav aria-label="Sections" className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} onClick={go(s.id)} aria-label={s.label} aria-current={active === s.id}
            className={`block h-2.5 w-2.5 rounded-full border border-gold/60 transition-all ${active === s.id ? "scale-125 bg-gold shadow-[var(--glow-gold)]" : "bg-transparent"}`} />
        ))}
      </nav>

      <main className="relative z-10">
        {/* ---------- 3. HERO ---------- */}
        <section id="hero" className="relative flex h-svh items-center justify-center overflow-hidden px-4">
          {/* Giant kinetic words */}
          <h1 className="sr-only">{profile.name} — {profile.kineticWords.join(", ")}</h1>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 text-center">
            {profile.kineticWords.map((w, i) => (
              <p key={w}
                className={`absolute inset-x-0 -translate-y-1/2 font-display text-[13vw] font-bold leading-[0.9] tracking-tighter transition-all duration-700 md:text-[9vw] ${
                  i === wordIdx ? "opacity-100 blur-0 text-glow" : "opacity-0 blur-md"} ${i === wordIdx ? "translate-y-[-50%]" : i < wordIdx ? "translate-y-[-90%]" : "translate-y-[-10%]"}`}>
                <span className={i % 2 ? "gold-gradient-text" : ""}>{w}</span>
              </p>
            ))}
          </div>

          <div className={`relative z-10 transition-all duration-1000 ${ready ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
            <Portrait360 progressRef={heroProgress} />
          </div>

          {/* Bottom bar: badge, tagline, CTA, scroll hint */}
          <div className="absolute inset-x-0 bottom-6 z-20 mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:bottom-10 md:flex-row md:justify-between md:text-left">
            <div className="max-w-md">
              {profile.openToWork && (
                <span className="glass mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs">
                  <span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-gold" /><span className="relative h-2 w-2 rounded-full bg-gold" /></span>
                  Open to work
                </span>
              )}
              <p className="text-sm text-muted-foreground">{profile.tagline}</p>
            </div>
            <div className="flex items-center gap-4">
              <Magnetic href="#projects" onClick={go("projects")} className="bg-gold text-primary-foreground shadow-[var(--glow-gold)]">View projects →</Magnetic>
              <span aria-hidden className="hidden font-mono text-xs text-muted-foreground md:block">scroll ↓</span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl space-y-[18vh] px-4 py-[20vh]">
          {/* ---------- 4. SECTIONS ---------- */}
          <section id="about" className="panel glass spotlight rounded-3xl p-6 sm:p-12" onPointerMove={onSpot}>
            <SectionTitle num="01" title="Who I Am" />
            <div className="space-y-4 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {profile.about.map((p) => <p key={p}>{p}</p>)}
            </div>
            {experience.map((x) => (
              <div key={x.company} className="mt-8 flex items-center gap-3 border-t border-border pt-6">
                <span className="font-mono text-xs uppercase text-gold">Experience</span>
                <span className="font-medium">{x.role} · {x.company}</span>
                {x.detail && <span className="text-muted-foreground">— {x.detail}</span>}
              </div>
            ))}
          </section>

          <section id="skills" className="panel glass spotlight overflow-hidden rounded-3xl p-6 sm:p-12" onPointerMove={onSpot}>
            <SectionTitle num="02" title="Technical Skills" />
            <div className="grid gap-6 sm:grid-cols-2">
              {skills.map((s) => (
                <div key={s.group}>
                  <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-gold">{s.group}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {s.items.map((i) => <li key={i} className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-sm transition-colors hover:border-gold/60">{i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            {/* Tilted tech marquee */}
            <div aria-hidden className="-mx-12 mt-12 -rotate-3 overflow-hidden border-y border-gold/20 bg-gold/5 py-3">
              <div className="marquee-track flex w-max gap-10 whitespace-nowrap font-display text-2xl font-bold uppercase">
                {[...marquee, ...marquee].map((m, i) => <span key={i} className={i % 2 ? "text-outline" : "text-foreground/80"}>{m} ✦</span>)}
              </div>
            </div>
          </section>

          <section id="education" className="panel glass spotlight rounded-3xl p-6 sm:p-12" onPointerMove={onSpot}>
            <SectionTitle num="03" title="Education" />
            {education.map((e) => (
              <div key={e.degree} className="border-l-2 border-gold pl-6">
                <h3 className="font-display text-2xl font-semibold">{e.degree}</h3>
                <p className="mt-1 text-muted-foreground">{e.school}</p>
                <p className="mt-3 font-mono text-sm text-gold">{e.detail}</p>
              </div>
            ))}
          </section>

          <section id="certs" className="panel glass rounded-3xl p-6 sm:p-12">
            <SectionTitle num="04" title="Certifications" />
            <ul className="grid gap-3 sm:grid-cols-2">
              {certifications.map((c) => (
                <li key={c.title} onPointerMove={onSpot} className="spotlight rounded-xl border border-border bg-secondary/30 p-4 transition-colors hover:border-gold/50">
                  <p className="font-medium leading-snug">{c.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{c.issuer} · <span className="text-gold">{c.date}</span></p>
                </li>
              ))}
            </ul>
          </section>

          <section id="numbers" className="panel glass rounded-3xl p-6 sm:p-12">
            <SectionTitle num="05" title="By the Numbers" />
            <dl className="grid gap-6 sm:grid-cols-3">
              {stats.map((s) => (
                <div key={s.label} className="text-center sm:text-left">
                  <dd className="gold-gradient-text font-display text-6xl font-bold sm:text-7xl"><Counter to={s.value} suffix={s.suffix} /></dd>
                  <dt className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">{s.label}</dt>
                </div>
              ))}
            </dl>
          </section>

          <section id="projects" className="panel">
            <div className="glass rounded-3xl p-6 sm:p-12">
              <SectionTitle num="06" title="Featured Projects" />
              <div className="grid gap-5 md:grid-cols-2">
                {projects.map((p, i) => (
                  <TiltCard key={p.title} className={`p-6 ${i === 0 ? "md:col-span-2" : ""}`}>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-2xl font-semibold">{p.title}</h3>
                      <span className="shrink-0 rounded-full border border-violet/40 px-2.5 py-0.5 font-mono text-xs text-violet">{p.status}</span>
                    </div>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{p.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.tags.map((t) => <span key={t} className="font-mono text-xs text-gold">#{t}</span>)}
                    </div>
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm text-gold underline-offset-4 hover:underline">View project →</a>}
                  </TiltCard>
                ))}
              </div>
            </div>
          </section>

          {/* ---------- 5. CONTACT ---------- */}
          <section id="contact" className="panel glass rounded-3xl p-6 sm:p-12">
            <SectionTitle num="07" title="Contact" />
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <p className="text-lg text-muted-foreground">Have an internship, project or idea? I'd love to hear about it.</p>
                <a href={`mailto:${profile.email}`} className="mt-6 block font-display text-2xl font-semibold text-gold break-all hover:underline">{profile.email}</a>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Magnetic href={profile.resumeUrl} download className="bg-gold text-primary-foreground shadow-[var(--glow-gold)]">Download Resume ↓</Magnetic>
                  {profile.linkedin && <Magnetic href={profile.linkedin} target="_blank" rel="noreferrer" className="border border-border">LinkedIn</Magnetic>}
                  {profile.github && <Magnetic href={profile.github} target="_blank" rel="noreferrer" className="border border-border">GitHub</Magnetic>}
                </div>
              </div>
              <ContactForm />
            </div>
          </section>
        </div>

        <footer className="pb-10 text-center font-mono text-xs text-muted-foreground">© {new Date().getFullYear()} {profile.name}</footer>
      </main>
    </>
  );
}

/** Formspree when an ID is set in data.ts; otherwise opens the visitor's email app. */
function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const field = "w-full rounded-xl border border-input bg-secondary/40 px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-gold focus:outline-none";
  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        if (!formspreeId) {
          const body = `${fd.get("message")}\n\n— ${fd.get("name")} (${fd.get("email")})`;
          window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent("Portfolio enquiry")}&body=${encodeURIComponent(body)}`;
          return;
        }
        setState("sending");
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, { method: "POST", body: fd, headers: { Accept: "application/json" } }).catch(() => null);
        setState(res?.ok ? "sent" : "error");
      }}
    >
      <label className="sr-only" htmlFor="name">Name</label>
      <input id="name" name="name" required maxLength={100} placeholder="Your name" className={field} />
      <label className="sr-only" htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required maxLength={200} placeholder="Your email" className={field} />
      <label className="sr-only" htmlFor="message">Message</label>
      <textarea id="message" name="message" required maxLength={2000} rows={4} placeholder="Your message" className={field} />
      <button type="submit" disabled={state === "sending"} className="w-full rounded-xl bg-gold py-3 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-[var(--glow-gold)] disabled:opacity-60">
        {state === "sending" ? "Sending…" : state === "sent" ? "Sent — thank you!" : "Send message"}
      </button>
      {state === "error" && <p className="text-sm text-destructive">Couldn't send. Please email me directly.</p>}
    </form>
  );
}
