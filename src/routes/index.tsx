import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mail, Github, Linkedin, ExternalLink, Sparkles, Leaf, BookOpen, Trophy, GraduationCap, Briefcase, Heart, Award } from "lucide-react";
import heroImg from "@/assets/hero-ghibli.jpg";
import sootImg from "@/assets/soot-sprite.png";
import portraitImg from "@/assets/about-portrait.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vyshnavi R — Data Science Student & NLP Researcher" },
      { name: "description", content: "Whimsical portfolio of Vyshnavi R, a final-year Data Science student at SRM specializing in NLP, sentiment analysis, and award-winning research." },
      { property: "og:title", content: "Vyshnavi R — Data Science Portfolio" },
      { property: "og:description", content: "NLP researcher, award-winning paper presenter, and curious learner." },
    ],
  }),
  component: Portfolio,
});

/* --- Soot Sprite Cursor --- */
function SootCursor() {
  const sprite = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let x = 0, y = 0, gx = 0, gy = 0;
    const onMove = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    window.addEventListener("mousemove", onMove);
    let raf: number;
    const tick = () => {
      gx += (x - gx) * 0.18;
      gy += (y - gy) * 0.18;
      if (sprite.current) sprite.current.style.transform = `translate(${x - 18}px, ${y - 18}px)`;
      if (glow.current) glow.current.style.transform = `translate(${gx - 30}px, ${gy - 30}px)`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div ref={glow} className="cursor-glow animate-glow" />
      <div ref={sprite} className="cursor-sprite">
        <img src={sootImg} alt="" className="w-full h-full animate-float" style={{ animationDuration: "2.5s" }} />
      </div>
    </>
  );
}

/* --- Floating petals --- */
function Petals() {
  const petals = Array.from({ length: 18 });
  return (
    <>
      {petals.map((_, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${12 + Math.random() * 14}s`,
            animationDelay: `${-Math.random() * 20}s`,
            transform: `scale(${0.6 + Math.random() * 0.9})`,
          }}
        />
      ))}
    </>
  );
}

/* --- Reveal on scroll --- */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => el.classList.add("in-view"), delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

/* ---------- DATA ---------- */
const projects = [
  {
    name: "LumaAir",
    desc: "Air-quality forecasting platform blending machine learning, real-time weather, and health-focused insights for Delhi.",
    tags: ["Python", "ML", "Forecasting"],
    url: "https://github.com/blackhatcoder-37/LumaAir",
  },
  {
    name: "Neuro-Architect MCP",
    desc: "Autonomous MCP that watches a deployed model, detects data drift, retrains, and hot-swaps production — no humans needed.",
    tags: ["MCP", "MLOps", "Python"],
    url: "https://github.com/blackhatcoder-37/neuro-architect-mcp",
  },
  {
    name: "NeuroChain Defense",
    desc: "Multimodal voice-fraud detector — CNNs on MFCC heatmaps + NLP threat analysis, anchored to a blockchain ledger.",
    tags: ["Deep Learning", "Blockchain", "NLP"],
    url: "https://github.com/blackhatcoder-37/NeuroChain-Defense",
  },
  {
    name: "Sentiment + Blockchain",
    desc: "The internship project that sparked the award-winning paper — sentiment analysis configured atop a blockchain framework.",
    tags: ["NLP", "Research", "VADER"],
    url: "https://github.com/blackhatcoder-37/Sentiment-Analysis-and-Blockchain-configuration",
  },
];

const certificates = [
  { name: "MongoDB Schema Design Patterns & Anti-patterns", issuer: "MongoDB", url: "https://www.credly.com/earner/earned/badge/ccb70fd3-f3a0-4ea6-bf04-6d2281fe33fa" },
  { name: "MongoDB Schema Design Optimization", issuer: "MongoDB", url: "https://www.credly.com/earner/earned/badge/50780cc0-7df8-4f4c-b0d7-dda7275b1ced" },
  { name: "From Relational (SQL) to MongoDB Document Model", issuer: "MongoDB", url: "https://www.credly.com/earner/earned/badge/f794097b-2a92-45ea-a0c8-4ab306636e69" },
  { name: "MongoDB Basics for Students", issuer: "MongoDB", url: "https://www.credly.com/earner/earned/badge/103bb673-9194-4565-a312-3eef0fb784d1" },
  { name: "Complete Intro to MCP", issuer: "Frontend Masters", url: "https://static.frontendmasters.com/ud/c/93b475435d/HVXvpeXurf/mcp.pdf" },
  { name: "Innovating with Google Cloud AI", issuer: "Google", url: "https://www.skills.google/public_profiles/72850682-be7f-46c2-98d6-04eaeaf2840e/badges/20171972" },
];

const interests = [
  { label: "Crocheting", emoji: "🧶" },
  { label: "Reading books", emoji: "📚" },
  { label: "Ghibli art", emoji: "🌿" },
  { label: "Formula 1", emoji: "🏎️" },
  { label: "Badminton", emoji: "🏸" },
];

/* ---------- PORTFOLIO ---------- */
function Portfolio() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkedinUrl = "https://www.linkedin.com/in/vyshnavi-r-695419318";
  const email = "vyshnavirbnambiar@gmail.com";

  return (
    <main className="relative">
      <SootCursor />
      <Petals />

      {/* ---------- HERO ---------- */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "var(--gradient-sky)" }}>
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: `url(${heroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, oklch(0.98 0.018 95 / 0.4) 60%, oklch(0.98 0.018 95) 100%)" }} />

        {/* watercolor blobs */}
        <div className="watercolor-blob" style={{ width: 400, height: 400, top: "10%", left: "-5%", background: "var(--blossom)" }} />
        <div className="watercolor-blob" style={{ width: 500, height: 500, bottom: "-10%", right: "-8%", background: "var(--moss)" }} />

        {/* Floating lanterns */}
        <div className="absolute top-20 right-[15%] animate-float" style={{ animationDelay: "0s" }}>
          <div className="w-10 h-14 rounded-full animate-glow" style={{ background: "linear-gradient(180deg, oklch(0.88 0.15 65), oklch(0.7 0.18 40))", boxShadow: "0 0 30px oklch(0.85 0.15 70 / 0.7)" }} />
        </div>
        <div className="absolute top-40 left-[12%] animate-float" style={{ animationDelay: "1.5s" }}>
          <div className="w-8 h-12 rounded-full animate-glow" style={{ background: "linear-gradient(180deg, oklch(0.88 0.15 65), oklch(0.7 0.18 40))" }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
          <Reveal>
            <p className="font-display text-3xl md:text-4xl text-[oklch(0.5_0.1_25)] mb-2">once upon a curious mind…</p>
          </Reveal>
          <Reveal delay={150}>
            <h1 className="text-6xl md:text-8xl leading-[1.05] mb-6">
              Hello, I'm <span className="text-gradient">Vyshnavi</span>
              <span className="inline-block animate-sway ml-2">🌸</span>
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="text-xl md:text-2xl max-w-2xl text-muted-foreground mb-8 font-serif italic">
              A final-year Data Science student at SRM, gently chasing meaning in language with NLP, sentiment, and a notebook full of half-finished ideas.
            </p>
          </Reveal>
          <Reveal delay={450}>
            <div className="flex flex-wrap gap-4">
              <a href="#projects" className="btn-lantern"><Sparkles className="w-4 h-4" /> Wander through my work</a>
              <a href={`mailto:${email}`} className="btn-leaf"><Leaf className="w-4 h-4" /> Say hello</a>
            </div>
          </Reveal>

          <Reveal delay={600}>
            <div className="mt-10 flex gap-5 items-center text-muted-foreground">
              <a href={linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-[oklch(0.5_0.1_155)] transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="https://github.com/blackhatcoder-37" target="_blank" rel="noreferrer" className="hover:text-[oklch(0.5_0.1_155)] transition-colors"><Github className="w-5 h-5" /></a>
              <a href={`mailto:${email}`} className="hover:text-[oklch(0.5_0.1_155)] transition-colors"><Mail className="w-5 h-5" /></a>
              <span className="text-sm font-display text-2xl">scroll, little wanderer ↓</span>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="divider-wave" />

      {/* ---------- ABOUT ---------- */}
      <section id="about" className="relative py-28 px-6">
        <div className="watercolor-blob" style={{ width: 350, height: 350, top: "20%", right: "-5%", background: "var(--sky)" }} />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-4 rounded-[40px] animate-spin-slow" style={{ background: "conic-gradient(from 0deg, var(--blossom), var(--moss), var(--lantern), var(--blossom))", filter: "blur(30px)", opacity: 0.4 }} />
              <img src={portraitImg} alt="Watercolor portrait of Vyshnavi" loading="lazy" width={1024} height={1024} className="relative rounded-[32px] shadow-[var(--shadow-soft)] w-full" />
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p className="font-display text-3xl text-[oklch(0.5_0.1_25)] mb-3">a little about me</p>
            <h2 className="text-4xl md:text-5xl mb-6">Bridging quiet theory with curious practice.</h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              I'm driven by the small magic of teaching machines to <em>feel</em> language. My internship in sentiment analysis grew, almost by accident, into an award-winning paper at an international AI conference.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I lead, I research, I make tiny crochet creatures between training runs. Always wandering toward harder, kinder data problems.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {["Python", "C++", "SQL", "Git", "GitHub", "Machine Learning", "Deep Learning", "NLP", "Hugging Face", "NumPy", "pandas", "scikit-learn", "PyTorch", "TensorFlow", "Power BI", "Tableau", "Research"].map((s) => (
                <span key={s} className="tag-pill">{s}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- TIMELINE: Education + Experience + Award ---------- */}
      <section className="relative py-28 px-6" style={{ background: "var(--gradient-meadow)" }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="font-display text-3xl text-[oklch(0.4_0.1_25)] text-center">my little river of moments</p>
            <h2 className="text-4xl md:text-5xl text-center mb-16">A Journey, Softly Unfolding</h2>
          </Reveal>

          <div className="space-y-6">
            {[
              { icon: Trophy, title: "Best Paper Award — ICBCAI 2025", date: "September 2025", body: "Received the 'Best Paper Award' at the 2nd International Conference on Emerging Research in Blockchain & AI, for “Blockchain Powered Sentiment Analysis” — researched, written, and presented to an international audience.", accent: "lantern" },
              { icon: Briefcase, title: "Data Science Intern — Codtech", date: "May – June 2025", body: "Built a sentiment analysis project pairing VADER with a RoBERTa Hugging Face pipeline. Sharpened NLP, model implementation, and modern deep-learning workflows in a remote setting.", accent: "moss" },
              { icon: GraduationCap, title: "BCA, Data Science — SRM Ramapuram", date: "June 2024 — Present", body: "Currently in my second year. SGPA 9.2, with around 6 hours a week dedicated to research and reading.", accent: "sky" },
              { icon: Award, title: "Joint Secretary — NEXTGEN CREW, SRM", date: "July 2021 — Present", body: "Coordinate club activities, spearhead key projects, plan events, and supervise team tasks — strengthening engagement and the club's overall impact.", accent: "blossom" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="whimsy-card flex gap-5 items-start">
                  <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `var(--${item.accent})`, color: "oklch(0.25 0.04 30)" }}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-3 mb-2">
                      <h3 className="text-2xl">{item.title}</h3>
                      <span className="font-display text-xl text-[oklch(0.5_0.08_155)]">{item.date}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PROJECTS ---------- */}
      <section id="projects" className="relative py-28 px-6">
        <div className="watercolor-blob" style={{ width: 400, height: 400, top: "10%", left: "-8%", background: "var(--blossom)" }} />
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="font-display text-3xl text-[oklch(0.5_0.1_25)] text-center">things i've grown</p>
            <h2 className="text-4xl md:text-5xl text-center mb-4">Projects from the Garden</h2>
            <p className="text-center text-muted-foreground max-w-xl mx-auto mb-14">Each one a small experiment — half curiosity, half code.</p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((p, i) => (
              <Reveal key={p.name} delay={i * 120}>
                <a href={p.url} target="_blank" rel="noreferrer" className="block whimsy-card group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--gradient-blossom)" }}>
                        <Leaf className="w-5 h-5 text-[oklch(0.3_0.05_25)]" />
                      </div>
                      <h3 className="text-2xl">{p.name}</h3>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-[oklch(0.5_0.1_25)] group-hover:rotate-12 transition-all" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t) => <span key={t} className="tag-pill">{t}</span>)}
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CERTIFICATES ---------- */}
      <section className="relative py-28 px-6" style={{ background: "linear-gradient(180deg, oklch(0.96 0.03 95), oklch(0.94 0.04 110))" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="font-display text-3xl text-[oklch(0.5_0.1_25)] text-center">tiny lanterns of learning</p>
            <h2 className="text-4xl md:text-5xl text-center mb-14">Certificates & Badges</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certificates.map((c, i) => (
              <Reveal key={c.name} delay={i * 80}>
                <a href={c.url} target="_blank" rel="noreferrer" className="block whimsy-card group">
                  <div className="flex items-start gap-3 mb-2">
                    <BookOpen className="w-5 h-5 mt-1 text-[oklch(0.55_0.1_60)]" />
                    <div>
                      <h3 className="text-lg font-serif font-semibold leading-snug">{c.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{c.issuer}</p>
                    </div>
                  </div>
                  <span className="story-link text-sm text-[oklch(0.5_0.1_25)] mt-3 inline-block">View credential →</span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- INTERESTS ---------- */}
      <section className="relative py-28 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Reveal>
            <p className="font-display text-3xl text-[oklch(0.5_0.1_25)]">when i'm away from the screen</p>
            <h2 className="text-4xl md:text-5xl mb-12">Little joys</h2>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-4">
            {interests.map((it, i) => (
              <Reveal key={it.label} delay={i * 100}>
                <div className="whimsy-card flex items-center gap-3 px-6 py-4">
                  <span className="text-3xl animate-float" style={{ animationDelay: `${i * 0.3}s` }}>{it.emoji}</span>
                  <span className="font-serif text-lg">{it.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="font-display text-2xl mt-12 text-muted-foreground flex items-center justify-center gap-2">
              made with <Heart className="w-5 h-5 text-[oklch(0.7_0.15_25)] fill-current animate-float" /> and a little spirited magic
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- CONTACT ---------- */}
      <section id="contact" className="relative py-28 px-6 overflow-hidden" style={{ background: "var(--gradient-sky)" }}>
        <div className="watercolor-blob" style={{ width: 500, height: 500, top: "-20%", left: "30%", background: "var(--blossom)" }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <Reveal>
            <p className="font-display text-3xl text-[oklch(0.5_0.1_25)]">stay a while, send a letter</p>
            <h2 className="text-5xl md:text-6xl mb-6">Let's build something gentle.</h2>
            <p className="text-lg text-muted-foreground mb-10">
              Open to research collaborations, internships, and quiet conversations about NLP, ML, or which Ghibli film is best (it's <em>Spirited Away</em>).
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <a href={`mailto:${email}`} className="btn-lantern"><Mail className="w-4 h-4" /> {email}</a>
              <a href={linkedinUrl} target="_blank" rel="noreferrer" className="btn-leaf"><Linkedin className="w-4 h-4" /> LinkedIn</a>
              <a href="https://github.com/blackhatcoder-37" target="_blank" rel="noreferrer" className="btn-leaf"><Github className="w-4 h-4" /> GitHub</a>
            </div>
            <p className="font-display text-2xl text-muted-foreground">— Vyshnavi R · Chennai, India</p>
          </Reveal>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Vyshnavi R · woven with watercolor & wonder
      </footer>
    </main>
  );
}
