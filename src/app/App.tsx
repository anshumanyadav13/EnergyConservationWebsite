import { useEffect, useState } from "react";

/* ─── Inject viewport + CDN assets ──────────────────────────────────────── */
function useCDN() {
  useEffect(() => {
    // Ensure correct mobile scaling
    if (!document.querySelector('meta[name="viewport"]')) {
      const vp = document.createElement("meta");
      vp.name = "viewport";
      vp.content = "width=device-width, initial-scale=1, maximum-scale=5";
      document.head.prepend(vp);
    }

    const cdnLinks = [
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css",
    ];
    const added: HTMLLinkElement[] = [];
    cdnLinks.forEach((href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const el = document.createElement("link");
      el.rel = "stylesheet";
      el.href = href;
      document.head.appendChild(el);
      added.push(el);
    });

    const aosScript = "https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js";
    if (!document.querySelector(`script[src="${aosScript}"]`)) {
      const s = document.createElement("script");
      s.src = aosScript;
      s.onload = () => {
        (window as any).AOS?.init({ duration: 750, once: true, easing: "ease-out-cubic", offset: 50 });
      };
      document.body.appendChild(s);
    } else {
      setTimeout(() => (window as any).AOS?.init({ duration: 750, once: true }), 100);
    }
    return () => added.forEach((el) => el.remove());
  }, []);
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const G = "linear-gradient(135deg, #16a34a, #0ea5e9)";
const GR = "linear-gradient(135deg, #16a34a, #15803d)";

function glassCard(dark: boolean, extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    background: dark ? "rgba(13,38,24,0.72)" : "rgba(255,255,255,0.88)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: `1px solid ${dark ? "rgba(74,222,128,0.14)" : "rgba(22,163,74,0.14)"}`,
    borderRadius: 20,
    ...extra,
  };
}

function SectionWrap({
  id,
  dark,
  bg,
  children,
}: {
  id: string;
  dark: boolean;
  bg?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      style={{
        padding: "88px 0",
        background:
          bg ??
          (dark
            ? "linear-gradient(180deg,#071a0f 0%,#0a2018 100%)"
            : "linear-gradient(180deg,#f0fdf4 0%,#ffffff 100%)"),
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>{children}</div>
    </section>
  );
}

function SectionTitle({ icon, title, sub, dark }: { icon: string; title: string; sub?: string; dark: boolean }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 52 }} data-aos="fade-up">
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "rgba(22,163,74,0.12)",
          border: "2px solid rgba(22,163,74,0.22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          color: "#16a34a",
          margin: "0 auto 14px",
        }}
      >
        <i className={icon} />
      </div>
      <h2
        style={{
          fontFamily: "'Poppins',sans-serif",
          fontWeight: 800,
          fontSize: "clamp(1.6rem,3.5vw,2.4rem)",
          background: G,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 0 8px",
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            fontFamily: "'Nunito',sans-serif",
            color: dark ? "#86efac" : "#4b7a5e",
            fontSize: "1rem",
            maxWidth: 540,
            margin: "0 auto",
          }}
        >
          {sub}
        </p>
      )}
      <div style={{ width: 56, height: 4, background: G, borderRadius: 4, margin: "12px auto 0" }} />
    </div>
  );
}

/* ─── Scroll-to-top ──────────────────────────────────────────────────────── */
function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 9999,
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: G,
        border: "none",
        color: "#fff",
        fontSize: 18,
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(22,163,74,0.4)",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(14px)",
        transition: "opacity .3s,transform .3s",
        pointerEvents: show ? "auto" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <i className="fa fa-chevron-up" />
    </button>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
function Navbar({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    const r = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("scroll", h);
    window.addEventListener("resize", r);
    return () => { window.removeEventListener("scroll", h); window.removeEventListener("resize", r); };
  }, []);

  const links = ["about", "objectives", "tips", "renewable", "survey", "gallery", "team", "contact"];
  const labels: Record<string, string> = {
    about: "About", objectives: "Objectives", tips: "Tips", renewable: "Renewable",
    survey: "Survey", gallery: "Gallery", team: "Team", contact: "Contact",
  };

  const bg = dark
    ? scrolled ? "rgba(7,26,15,.97)" : "rgba(7,26,15,.78)"
    : scrolled ? "rgba(255,255,255,.97)" : "rgba(255,255,255,.82)";

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: bg, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,.1)" : "none",
        borderBottom: `1px solid ${dark ? "rgba(74,222,128,.1)" : "rgba(22,163,74,.1)"}`,
        transition: "background .35s,box-shadow .35s",
        fontFamily: "'Poppins',sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1280, margin: "0 auto", padding: "0 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 60, gap: 8,
        }}
      >
        {/* Brand */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0,
            display: "flex", alignItems: "center", gap: 7,
            fontFamily: "'Poppins',sans-serif", fontWeight: 800,
            fontSize: isMobile ? "0.95rem" : "1.1rem",
            background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          } as any}
        >
          <i className="fa-solid fa-leaf" style={{ color: "#16a34a", WebkitTextFillColor: "#16a34a", fontSize: isMobile ? 17 : 20 } as any} />
          EcoProject
        </button>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "nowrap", flex: 1, justifyContent: "center" }}>
            {links.map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(l)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: dark ? "#d1fae5" : "#0f2d1a",
                  fontSize: "0.8rem", fontWeight: 600, padding: "6px 9px",
                  borderRadius: 8, fontFamily: "'Poppins',sans-serif",
                  transition: "background .2s,color .2s", whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = dark ? "rgba(74,222,128,.1)" : "rgba(22,163,74,.08)";
                  (e.currentTarget as HTMLElement).style.color = "#16a34a";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = dark ? "#d1fae5" : "#0f2d1a";
                }}
              >
                {labels[l]}
              </button>
            ))}
          </div>
        )}

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setDark(!dark)}
            style={{
              background: dark ? "rgba(74,222,128,.12)" : "rgba(22,163,74,.1)",
              border: "none", borderRadius: 20,
              padding: isMobile ? "6px 10px" : "6px 14px",
              cursor: "pointer", color: dark ? "#4ade80" : "#16a34a",
              fontSize: 13, fontWeight: 700, fontFamily: "'Poppins',sans-serif",
              display: "flex", alignItems: "center", gap: 5,
            }}
          >
            <i className={`fa ${dark ? "fa-sun" : "fa-moon"}`} />
            {!isMobile && <span style={{ fontSize: "0.75rem" }}>{dark ? "Light" : "Dark"}</span>}
          </button>

          {/* Hamburger — only on mobile */}
          {isMobile && (
            <button
              onClick={() => setOpen(!open)}
              style={{
                background: dark ? "rgba(74,222,128,.1)" : "rgba(22,163,74,.08)",
                border: `1.5px solid ${dark ? "rgba(74,222,128,.25)" : "rgba(22,163,74,.25)"}`,
                borderRadius: 8, cursor: "pointer",
                color: dark ? "#4ade80" : "#16a34a",
                fontSize: 18, width: 38, height: 38,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              aria-label="Toggle menu"
            >
              <i className={`fa ${open ? "fa-xmark" : "fa-bars"}`} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? 500 : 0,
          transition: "max-height .35s ease",
          background: dark ? "rgba(7,26,15,.99)" : "rgba(255,255,255,.99)",
          borderTop: open ? `1px solid ${dark ? "rgba(74,222,128,.1)" : "rgba(22,163,74,.1)"}` : "none",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "8px 20px 16px", display: "flex", flexDirection: "column", gap: 2 }}>
          {links.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              style={{
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
                color: dark ? "#d1fae5" : "#0f2d1a", padding: "10px 0",
                fontWeight: 600, fontSize: "0.9rem", fontFamily: "'Poppins',sans-serif",
                borderBottom: `1px solid ${dark ? "rgba(74,222,128,.08)" : "rgba(22,163,74,.08)"}`,
              }}
            >
              {labels[l]}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
function Hero({ dark }: { dark: boolean }) {
const isMobile = window.innerWidth <= 768;
  return (
    <section
  id="hero"
  style={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    position: "relative",
    overflowX: "hidden",
    paddingTop: 80,
    boxSizing: "border-box",
    background: dark
      ? "linear-gradient(135deg,#071a0f 0%,#0d2618 45%,#082f49 100%)"
      : "linear-gradient(135deg,#f0fdf4 0%,#dcfce7 45%,#dbeafe 100%)",
  }}
>
      {/* Decorative blobs */}
      <div style={{ position: "absolute", width: 520, height: 520, borderRadius: "50%", right: -100, top: -80,
        background: dark ? "radial-gradient(circle,rgba(22,163,74,.07) 0%,transparent 70%)" : "radial-gradient(circle,rgba(22,163,74,.11) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", left: -60, bottom: 40,
        background: dark ? "radial-gradient(circle,rgba(14,165,233,.05) 0%,transparent 70%)" : "radial-gradient(circle,rgba(14,165,233,.09) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div
  style={{
    position: "relative",
    maxWidth: 1200,
    width: "100%",
    margin: "0 auto",
    padding: "0 24px",
    boxSizing: "border-box",
    overflow: "hidden",
  }}
>
        <div
  style={{
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: isMobile ? 30 : 48,
    alignItems: "center",
    width: "100%",
  }}
>
          {/* Left */}
          <div data-aos="fade-right">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: dark ? "rgba(22,163,74,.15)" : "rgba(22,163,74,.08)",
              border: "1px solid rgba(22,163,74,.25)", borderRadius: 40, padding: "5px 15px", marginBottom: 20,
              fontSize: "0.78rem", color: "#16a34a", fontWeight: 700, fontFamily: "'Space Mono',monospace", letterSpacing: ".5px" }}>
              <i className="fa-solid fa-seedling" />
              COLLEGE FIELD PROJECT 2026
            </div>

            <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900,
              fontSize: isMobile ? "2.4rem" : "clamp(2.8rem,5vw,3.5rem)", lineHeight: 1.12,
              color: dark ? "#d1fae5" : "#0f2d1a", marginBottom: 20 }}>
              Save Energy{" "}
              <span style={{ background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Today</span>
              {" "}for a Better{" "}
              <span style={{ background: "linear-gradient(90deg,#0ea5e9,#16a34a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Tomorrow</span>
            </h1>

            <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: "1.08rem", color: dark ? "#86efac" : "#2d6a4f",
              lineHeight: 1.78, marginBottom: 32, maxWidth: 520 }}>
              Energy conservation is the responsible use of energy to reduce waste, lower costs,
              and protect our planet. Every small action counts — from switching off a light to
              choosing renewable sources. Join us in making a difference.
            </p>

            <div
  style={{
    display: "flex",
    flexDirection: "row",
    gap: 14,
    width: "100%",
    boxSizing: "border-box",
  }}
>
              <button
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                style={{
  background: GR,
  color: "#fff",
  padding: isMobile ? "12px 8px" : "13px 30px",
  borderRadius: 50,
  border: "none",
  fontWeight: 700,
  fontSize: isMobile ? "0.82rem" : "0.92rem",
  fontFamily: "'Poppins',sans-serif",
  cursor: "pointer",
  boxShadow: "0 4px 20px rgba(22,163,74,.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  flex: 1,
  minWidth: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  transition: "transform .2s,box-shadow .2s"
}}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(22,163,74,.45)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(22,163,74,.35)"; }}
              >
                <i className="fa-solid fa-circle-info" /> Learn More
              </button>
             
<a href="https://forms.gle/bXbC4eZ3VMcRmF5b7" target="_blank" rel="noopener noreferrer"
                style={{
  background: "transparent",
  color: dark ? "#4ade80" : "#16a34a",
  padding: isMobile ? "12px 8px" : "12px 28px",
  borderRadius: 50,
  flex: 1,
  minWidth: 0,
  justifyContent: "center",
  border: "2px solid #16a34a",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: isMobile ? "0.82rem" : "0.92rem",
  fontFamily: "'Poppins',sans-serif",
  display: "flex",
  alignItems: "center",
  gap: 6,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  transition: "background .2s,color .2s,transform .2s"
}}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#16a34a"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = dark ? "#4ade80" : "#16a34a"; }}
              >
                <i className="fa-solid fa-clipboard-list" /> Take Survey
              </a>
            </div>
          </div>

          {/* Right card */}
          <div data-aos="fade-left" style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", maxWidth: isMobile ? "100%" : 420,
width: "100%" }}>
              <div style={{
                borderRadius: 22, overflow: "hidden",
                boxShadow: "0 20px 56px rgba(22,163,74,.22),0 6px 20px rgba(14,165,233,.12)",
                border: `2px solid ${dark ? "rgba(74,222,128,.18)" : "rgba(22,163,74,.14)"}`,
              }}>
                <img src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=400&fit=crop&auto=format"
                  alt="Solar panels and wind turbines in green landscape"
                  style={{ width: "100%", display: "block" }} />
                <div style={{ padding: "18px 22px", background: dark ? "rgba(13,38,24,.8)" : "rgba(255,255,255,.95)",
                  display: "flex", justifyContent: "space-around" }}>
                  {[{ icon: "fa-bolt", label: "Energy Saved", val: "40%+" },
                    { icon: "fa-tree", label: "Trees Planted", val: "500+" },
                    { icon: "fa-users", label: "Participants", val: "200+" }].map((s) => (
                    <div key={s.label} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "1.4rem",
                        background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.val}</div>
                      <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "0.7rem", color: dark ? "#86efac" : "#4b7a5e", fontWeight: 600 }}>
                        <i className={`fa-solid ${s.icon}`} style={{ marginRight: 3 }} />{s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Badge */}
              <div style={{ position: "absolute", top: isMobile ? 10 : -14,
right: isMobile ? 10 : -14, background: G, borderRadius: 14,
                padding: "10px 14px", color: "#fff", fontSize: "0.75rem", fontWeight: 700,
                fontFamily: "'Poppins',sans-serif", boxShadow: "0 4px 16px rgba(22,163,74,.4)", textAlign: "center",
                animation: "floatY 3s ease-in-out infinite" }}>
                <i className="fa-solid fa-earth-asia" style={{ fontSize: 18, display: "block", marginBottom: 2 }} />
                Go Green!
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 40, color: dark ? "#86efac" : "#4b7a5e",
          animation: "bounceD 2s ease-in-out infinite", fontSize: "1.2rem" }}>
          <i className="fa-solid fa-angles-down" />
        </div>
      </div>
    </section>
  );
}

/* ─── About ──────────────────────────────────────────────────────────────── */
function About({ dark }: { dark: boolean }) {
  const cards = [
    { icon: "fa-solid fa-lightbulb", color: "#16a34a", title: "What Is Energy Conservation?",
      text: "Energy conservation means using less energy by adjusting habits and behaviours — distinct from efficiency, which uses better technology to do more with less." },
    { icon: "fa-solid fa-earth-asia", color: "#0ea5e9", title: "Global Energy Challenges",
      text: "Fossil fuels still supply ~80% of global energy, driving climate change and environmental damage. World energy demand climbs 1.5% every year." },
    { icon: "fa-solid fa-person-walking", color: "#16a34a", title: "Individual Responsibility",
      text: "Each person's daily choices — transport, appliances, lighting — directly impact total energy use. Collective small actions by millions create massive measurable change." },
  ];

  return (
    <SectionWrap id="about" dark={dark}>
      <SectionTitle icon="fa-solid fa-circle-info" title="About Energy Conservation"
        sub="Understanding the urgent need to save our planet's most vital resources." dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, alignItems: "start" }}>
        <div data-aos="fade-right" style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 12px 40px rgba(22,163,74,.14)", minHeight: 300 }}>
          <img src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=700&h=500&fit=crop&auto=format"
            alt="Green sustainable energy landscape" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 300 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }} data-aos="fade-left">
          {cards.map((c, i) => (
            <div key={i} style={{ ...glassCard(dark, { padding: "22px 20px" }), transition: "transform .25s,box-shadow .25s", cursor: "default" }}
              data-aos="fade-up" data-aos-delay={i * 80}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 32px rgba(22,163,74,.15)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ minWidth: 44, height: 44, borderRadius: 12, background: c.color + "18",
                  border: `1px solid ${c.color}30`, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, color: c.color }}>
                  <i className={c.icon} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.93rem",
                    color: dark ? "#d1fae5" : "#0f2d1a", marginBottom: 5 }}>{c.title}</div>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "0.86rem",
                    color: dark ? "#86efac" : "#4b7a5e", lineHeight: 1.65 }}>{c.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}

/* ─── Objectives ─────────────────────────────────────────────────────────── */
function Objectives({ dark }: { dark: boolean }) {
  const items = [
    { icon: "fa-solid fa-plug-circle-xmark", color: "#16a34a", title: "Reduce Electricity Wastage",
      desc: "Identify and eliminate unnecessary power consumption in homes, schools, and public spaces." },
    { icon: "fa-solid fa-bullhorn", color: "#0ea5e9", title: "Create Awareness",
      desc: "Educate communities through campaigns, surveys, and activities about the importance of saving energy." },
    { icon: "fa-solid fa-recycle", color: "#16a34a", title: "Encourage Sustainable Habits",
      desc: "Promote daily habits like turning off lights, using public transport, and reducing water use." },
    { icon: "fa-solid fa-mountain-sun", color: "#0ea5e9", title: "Protect Natural Resources",
      desc: "Conserving energy reduces demand for fossil fuels, preserving rivers, forests, and biodiversity." },
    { icon: "fa-solid fa-smog", color: "#16a34a", title: "Reduce Pollution",
      desc: "Less energy use means fewer greenhouse gas emissions and cleaner air for future generations." },
  ];

  return (
    <SectionWrap id="objectives" dark={dark}
      bg={dark ? "linear-gradient(180deg,#0a2018 0%,#071a0f 100%)" : "linear-gradient(180deg,#ffffff 0%,#f0fdf4 100%)"}>
      <SectionTitle icon="fa-solid fa-bullseye" title="Our Objectives"
        sub="Five clear goals guiding our energy conservation field project." dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
        {items.map((obj, i) => (
          <div key={i} data-aos="zoom-in" data-aos-delay={i * 70}
            style={{ ...glassCard(dark, { padding: "28px 22px", textAlign: "center", position: "relative", overflow: "hidden",
              transition: "transform .3s,box-shadow .3s,border-color .3s", cursor: "default" }) }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-5px)"; el.style.boxShadow = `0 14px 42px ${obj.color}28`; el.style.borderColor = obj.color + "50"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = ""; el.style.borderColor = dark ? "rgba(74,222,128,.14)" : "rgba(22,163,74,.14)"; }}>
            <div style={{ position: "absolute", top: 12, right: 14, fontFamily: "'Space Mono',monospace",
              fontSize: "0.65rem", color: dark ? "rgba(74,222,128,.3)" : "rgba(22,163,74,.25)", fontWeight: 700 }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px",
              background: `${obj.color}18`, border: `2px solid ${obj.color}35`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: obj.color }}>
              <i className={obj.icon} />
            </div>
            <h5 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.92rem",
              color: dark ? "#d1fae5" : "#0f2d1a", marginBottom: 8 }}>{obj.title}</h5>
            <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: "0.84rem",
              color: dark ? "#86efac" : "#4b7a5e", lineHeight: 1.65, margin: 0 }}>{obj.desc}</p>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}

/* ─── Tips ───────────────────────────────────────────────────────────────── */
function Tips({ dark }: { dark: boolean }) {
  const tips = [
    { icon: "fa-solid fa-lightbulb", color: "#eab308", title: "Use LED Bulbs", desc: "LEDs use up to 80% less energy than incandescent bulbs and last 25× longer." },
    { icon: "fa-solid fa-toggle-off", color: "#16a34a", title: "Switch Off Unused Lights", desc: "Turn off lights, fans, and electronics when leaving a room — it's that simple." },
    { icon: "fa-solid fa-plug", color: "#ef4444", title: "Unplug Chargers", desc: "Chargers left plugged in still draw power. Unplug them to eliminate phantom load." },
    { icon: "fa-solid fa-sun", color: "#f97316", title: "Use Natural Daylight", desc: "Open curtains during the day to reduce dependence on artificial lighting." },
    { icon: "fa-solid fa-temperature-low", color: "#0ea5e9", title: "Energy-Efficient Appliances", desc: "Choose 5-star rated appliances — they significantly reduce monthly electricity bills." },
    { icon: "fa-solid fa-droplet", color: "#38bdf8", title: "Save Water", desc: "Heating water is energy-intensive. Fix leaks, use efficient showers, collect rainwater." },
    { icon: "fa-solid fa-bus", color: "#8b5cf6", title: "Use Public Transport", desc: "Buses and trains carry many passengers, drastically cutting per-person carbon emissions." },
    { icon: "fa-solid fa-tree", color: "#16a34a", title: "Plant Trees", desc: "Trees absorb CO₂, provide shade reducing cooling needs, and improve air quality." },
  ];

  return (
    <SectionWrap id="tips" dark={dark}
      bg={dark ? "linear-gradient(180deg,#071a0f 0%,#0a2018 100%)" : "linear-gradient(180deg,#f0fdf4 0%,#ecfdf5 100%)"}>
      <SectionTitle icon="fa-solid fa-star" title="Energy Saving Tips"
        sub="Practical steps every individual can take starting today." dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
        {tips.map((t, i) => (
          <div key={i} data-aos="fade-up" data-aos-delay={i * 55}
            style={{ ...glassCard(dark, { padding: "22px 18px", transition: "transform .25s,box-shadow .25s,border-color .25s", cursor: "default" }) }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-5px) scale(1.01)"; el.style.boxShadow = `0 12px 32px ${t.color}28`; el.style.borderColor = t.color + "55"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = ""; el.style.borderColor = dark ? "rgba(74,222,128,.14)" : "rgba(22,163,74,.14)"; }}>
            <div style={{ width: 48, height: 48, borderRadius: 13, background: t.color + "18",
              border: `1px solid ${t.color}35`, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, color: t.color, marginBottom: 12 }}>
              <i className={t.icon} />
            </div>
            <h6 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.87rem",
              color: dark ? "#d1fae5" : "#0f2d1a", marginBottom: 7 }}>{t.title}</h6>
            <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: "0.82rem",
              color: dark ? "#86efac" : "#4b7a5e", lineHeight: 1.62, margin: 0 }}>{t.desc}</p>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}

/* ─── Renewable Energy ───────────────────────────────────────────────────── */
function Renewable({ dark }: { dark: boolean }) {
  const sources = [
    { icon: "fa-solid fa-sun", color: "#f59e0b", title: "Solar Energy",
      desc: "Harnessing sunlight via photovoltaic cells. Clean, abundant, and increasingly affordable for homes and industries.",
      stat: "173,000 TW", statLabel: "Solar potential",
      img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&h=300&fit=crop&auto=format" },
    { icon: "fa-solid fa-wind", color: "#0ea5e9", title: "Wind Energy",
      desc: "Wind turbines convert kinetic energy into electricity. Offshore wind farms are among the fastest-growing energy sources.",
      stat: "2,100 TW", statLabel: "Wind potential",
      img: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=500&h=300&fit=crop&auto=format" },
    { icon: "fa-solid fa-droplet", color: "#3b82f6", title: "Hydroelectric",
      desc: "Flowing water drives turbines to generate electricity. It is the world's largest existing source of renewable energy.",
      stat: "4.3 TW", statLabel: "Installed capacity",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop&auto=format" },
    { icon: "fa-solid fa-seedling", color: "#16a34a", title: "Biomass Energy",
      desc: "Organic material — wood, crop waste, animal dung — converted into heat, electricity, or biogas through combustion.",
      stat: "2.8 TW", statLabel: "Global capacity",
      img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&h=300&fit=crop&auto=format" },
  ];

  return (
    <SectionWrap id="renewable" dark={dark}
      bg={dark ? "linear-gradient(180deg,#0a2018 0%,#071a0f 100%)" : "linear-gradient(180deg,#ecfdf5 0%,#dbeafe 100%)"}>
      <SectionTitle icon="fa-solid fa-solar-panel" title="Renewable Energy Sources"
        sub="Clean alternatives that power the world without depleting it." dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
        {sources.map((s, i) => (
          <div key={i} data-aos="flip-left" data-aos-delay={i * 90}
            style={{ ...glassCard(dark, { overflow: "hidden", transition: "transform .3s,box-shadow .3s", cursor: "default" }) }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px ${s.color}30`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>
            <div style={{ position: "relative", height: 180, background: "#1a2a1a" }}>
              <img src={s.img} alt={s.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 30%,rgba(7,26,15,.8) 100%)" }} />
              <div style={{ position: "absolute", top: 12, left: 12, width: 42, height: 42, borderRadius: 11,
                background: s.color, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, color: "#fff", boxShadow: `0 3px 10px ${s.color}60` }}>
                <i className={s.icon} />
              </div>
              <div style={{ position: "absolute", bottom: 12, left: 14 }}>
                <div style={{ color: "rgba(255,255,255,.75)", fontFamily: "'Space Mono',monospace", fontSize: "0.65rem" }}>{s.statLabel}</div>
                <div style={{ color: "#fff", fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "1.05rem" }}>{s.stat}</div>
              </div>
            </div>
            <div style={{ padding: "16px 18px" }}>
              <h5 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.93rem",
                color: dark ? "#d1fae5" : "#0f2d1a", marginBottom: 7 }}>{s.title}</h5>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: "0.83rem",
                color: dark ? "#86efac" : "#4b7a5e", lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}

/* ─── Survey ─────────────────────────────────────────────────────────────── */
function Survey({ dark }: { dark: boolean }) {
  const url = "https://forms.gle/bXbC4eZ3VMcRmF5b7";
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&margin=10`;

  return (
    <SectionWrap id="survey" dark={dark}
      bg={dark ? "linear-gradient(135deg,#071a0f 0%,#082f49 100%)" : "linear-gradient(135deg,#dcfce7 0%,#dbeafe 100%)"}>
      <SectionTitle icon="fa-solid fa-clipboard-list" title="Energy Conservation Awareness Survey"
        sub="Help us understand public awareness levels around energy conservation." dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 28, alignItems: "center" }}>
        {/* Info panel */}
        <div data-aos="fade-right" style={{ ...glassCard(dark, { padding: "38px 32px" }),
          boxShadow: dark ? "0 20px 60px rgba(0,0,0,.28)" : "0 20px 60px rgba(22,163,74,.1)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(22,163,74,.12)",
            border: "1px solid rgba(22,163,74,.25)", borderRadius: 40, padding: "4px 14px", marginBottom: 16,
            fontSize: "0.75rem", color: "#16a34a", fontWeight: 700, fontFamily: "'Space Mono',monospace" }}>
            <i className="fa-solid fa-circle" style={{ fontSize: 7 }} />
            LIVE SURVEY
          </div>
          <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "1.4rem",
            color: dark ? "#d1fae5" : "#0f2d1a", marginBottom: 14 }}>Share Your Voice</h3>
          <p style={{ fontFamily: "'Nunito',sans-serif", color: dark ? "#86efac" : "#4b7a5e",
            lineHeight: 1.72, marginBottom: 22, fontSize: "0.93rem" }}>
            This survey is part of our field project to gauge community awareness on energy
            conservation. It takes less than 3 minutes and your responses help us create better
            awareness programs.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 26 }}>
            {[{ icon: "fa-clock", t: "~3 minutes" }, { icon: "fa-lock", t: "Anonymous" }, { icon: "fa-check-circle", t: "10 questions" }].map(b => (
              <span key={b.t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.82rem",
                color: dark ? "#86efac" : "#4b7a5e", fontFamily: "'Nunito',sans-serif", fontWeight: 600 }}>
                <i className={`fa-solid ${b.icon}`} style={{ color: "#16a34a" }} />{b.t}
              </span>
            ))}
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, background: GR, color: "#fff",
              padding: "13px 30px", borderRadius: 50, textDecoration: "none", fontWeight: 700,
              fontSize: "0.92rem", fontFamily: "'Poppins',sans-serif", boxShadow: "0 6px 22px rgba(22,163,74,.38)",
              transition: "transform .2s,box-shadow .2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(22,163,74,.48)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 22px rgba(22,163,74,.38)"; }}>
            <i className="fa-solid fa-external-link-alt" />
            Take the Survey
            <i className="fa-solid fa-arrow-right" />
          </a>
        </div>

        {/* QR panel */}
        <div data-aos="fade-left" style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ ...glassCard(dark, { padding: "30px 26px", textAlign: "center",
            boxShadow: "0 12px 40px rgba(22,163,74,.14)", border: `2px solid ${dark ? "rgba(74,222,128,.18)" : "rgba(22,163,74,.18)"}` }) }}>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.82rem",
              color: dark ? "#86efac" : "#4b7a5e", marginBottom: 16, textTransform: "uppercase", letterSpacing: ".5px" }}>
              <i className="fa-solid fa-qrcode" style={{ marginRight: 6 }} />Scan QR Code
            </p>
            <div style={{ padding: 10, background: "#fff", borderRadius: 14, display: "inline-block",
              boxShadow: "0 4px 18px rgba(0,0,0,.1)", marginBottom: 14 }}>
              <img src={qr} alt="QR code for Energy Conservation Survey"
                style={{ width: 180, height: 180, display: "block", borderRadius: 8 }} />
            </div>
            <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: "0.82rem",
              color: dark ? "#86efac" : "#4b7a5e", margin: 0 }}>
              Point your phone camera at the QR code to open the survey instantly.
            </p>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

/* ─── Gallery ────────────────────────────────────────────────────────────── */
function Gallery({ dark }: { dark: boolean }) {
  const photos = [
    { img: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=700&h=480&fit=crop&auto=format", title: "Awareness Campaign", desc: "Students spreading energy conservation messages", wide: true },
    { img: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&h=380&fit=crop&auto=format", title: "Survey Activity", desc: "Collecting community responses on energy habits", wide: false },
    { img: "https://picsum.photos/500/380",
  title: "Tree Plantation Drive",
  desc: "Planting trees for a greener tomorrow",
  wide: false },
    { img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=700&h=480&fit=crop&auto=format", title: "Solar Panel Study", desc: "Learning about photovoltaic energy systems", wide: true },
    { img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=380&fit=crop&auto=format", title: "Group Activity", desc: "Team brainstorming on conservation strategies", wide: false },
    { img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=500&h=380&fit=crop&auto=format", title: "Renewable Visit", desc: "Field visit to a wind and solar energy site", wide: false },
  ];

  return (
    <SectionWrap id="gallery" dark={dark}>
      <SectionTitle icon="fa-solid fa-images" title="Project Gallery"
        sub="Moments from our energy conservation awareness campaign and field activities." dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
        {photos.map((p, i) => (
          <div key={i} data-aos="fade-up" data-aos-delay={i * 60}
            style={{ borderRadius: 16, overflow: "hidden", position: "relative", height: 220, cursor: "pointer",
              boxShadow: dark ? "0 4px 20px rgba(0,0,0,.3)" : "0 4px 16px rgba(22,163,74,.1)",
              gridColumn: p.wide ? "span 2" : "span 1" }}
            onMouseEnter={(e) => {
              (e.currentTarget.querySelector("img") as HTMLElement).style.transform = "scale(1.07)";
              (e.currentTarget.querySelector(".goverlay") as HTMLElement).style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget.querySelector("img") as HTMLElement).style.transform = "scale(1)";
              (e.currentTarget.querySelector(".goverlay") as HTMLElement).style.opacity = "0";
            }}>
            <img src={p.img} alt={p.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .5s ease" }} />
            <div className="goverlay" style={{ position: "absolute", inset: 0,
              background: "linear-gradient(to top,rgba(7,26,15,.88) 0%,rgba(7,26,15,.18) 55%,transparent 100%)",
              opacity: 0, transition: "opacity .3s", display: "flex", flexDirection: "column",
              justifyContent: "flex-end", padding: "16px 18px" }}>
              <div style={{ color: "#fff", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.95rem", marginBottom: 3 }}>{p.title}</div>
              <div style={{ color: "rgba(255,255,255,.75)", fontFamily: "'Nunito',sans-serif", fontSize: "0.8rem" }}>{p.desc}</div>
            </div>
            <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(22,163,74,.85)",
              backdropFilter: "blur(6px)", borderRadius: 20, padding: "3px 10px",
              color: "#fff", fontSize: "0.68rem", fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>
              {p.title}
            </div>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}

/* ─── Team ───────────────────────────────────────────────────────────────── */
function Team({ dark }: { dark: boolean }) {
  const members = [
    { name: "Anshuman Yadav", roll: "6304", role: "Website Development & Survey Analysis",
      skills: ["Web Dev", "Data Analysis", "Survey Design"], color: "#16a34a", initials: "AY" },
    { name: "Om Yadav", roll: "6310", role: "Awareness Activity & Data Collection",
      skills: ["Outreach", "Data Collection", "Campaign"], color: "#0ea5e9", initials: "OY" },
  ];

  return (
    <SectionWrap id="team" dark={dark}
      bg={dark ? "linear-gradient(180deg,#0a2018 0%,#071a0f 100%)" : "linear-gradient(180deg,#ffffff 0%,#f0fdf4 100%)"}>
      <SectionTitle icon="fa-solid fa-users" title="Our Team"
        sub="The dedicated students behind this energy conservation field project." dark={dark} />
      <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
        {members.map((m, i) => (
          <div key={i} data-aos="zoom-in" data-aos-delay={i * 140}
            style={{ ...glassCard(dark, { padding: "36px 30px", textAlign: "center", maxWidth: 320, width: "100%",
              position: "relative", overflow: "hidden", transition: "transform .3s,box-shadow .3s", cursor: "default" }) }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 56px ${m.color}28`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>
            <div style={{ position: "absolute", top: -35, right: -35, width: 130, height: 130, borderRadius: "50%",
              background: m.color + "0e", pointerEvents: "none" }} />
            <div style={{ width: 88, height: 88, borderRadius: "50%",
              background: `linear-gradient(135deg,${m.color},${m.color}99)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", fontSize: "1.7rem", fontWeight: 800, color: "#fff",
              fontFamily: "'Poppins',sans-serif", boxShadow: `0 8px 24px ${m.color}40`,
              border: `3px solid ${m.color}50` }}>
              {m.initials}
            </div>
            <h4 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "1.08rem",
              color: dark ? "#d1fae5" : "#0f2d1a", marginBottom: 6 }}>{m.name}</h4>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: m.color, fontWeight: 700,
              background: m.color + "14", display: "inline-block", padding: "3px 12px", borderRadius: 20,
              border: `1px solid ${m.color}28`, marginBottom: 12 }}>Roll No. {m.roll}</div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "0.86rem",
              color: dark ? "#86efac" : "#4b7a5e", marginBottom: 18, lineHeight: 1.55 }}>
              <i className="fa-solid fa-briefcase" style={{ marginRight: 6, color: m.color }} />{m.role}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 7 }}>
              {m.skills.map((s) => (
                <span key={s} style={{ fontSize: "0.7rem", padding: "4px 12px", borderRadius: 20,
                  background: m.color + "18", color: m.color, fontWeight: 700,
                  fontFamily: "'Nunito',sans-serif", border: `1px solid ${m.color}28` }}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 36 }} data-aos="fade-up">
        <div style={{ display: "inline-block", ...glassCard(dark, { padding: "12px 26px" }),
          fontFamily: "'Nunito',sans-serif", fontSize: "0.87rem",
          color: dark ? "#86efac" : "#4b7a5e" }}>
          <i className="fa-solid fa-graduation-cap" style={{ color: "#16a34a", marginRight: 8 }} />
          <strong>Department of Information Technology, RJ College</strong> — Field Project 2026–27
        </div>
      </div>
    </SectionWrap>
  );
}

/* ─── Contact ────────────────────────────────────────────────────────────── */
function Contact({ dark }: { dark: boolean }) {
  const rows = [
    { icon: "fa-solid fa-building-columns", label: "Institution", val: "Ramniranjan Jhunjhunwala College of Arts, Science & Commerce" },
    { icon: "fa-solid fa-location-dot", label: "Location", val: "Ghatkopar West, Mumbai – 400 086, Maharashtra, India" },
    { icon: "fa-solid fa-phone", label: "Phone", val: "+91 22 2511 0002" },
    { icon: "fa-solid fa-envelope", label: "Email", val: "info@rjcollege.edu.in" },
    { icon: "fa-solid fa-globe", label: "Website", val: "www.rjcollege.edu.in" },
  ];

  return (
    <SectionWrap id="contact" dark={dark}
      bg={dark ? "linear-gradient(135deg,#071a0f 0%,#082f49 100%)" : "linear-gradient(135deg,#dcfce7 0%,#dbeafe 100%)"}>
      <SectionTitle icon="fa-solid fa-address-card" title="Contact Us"
        sub="Reach out to us at our institution." dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, alignItems: "start" }}>
        <div data-aos="fade-right" style={{ ...glassCard(dark, { padding: "36px 30px" }),
          boxShadow: dark ? "0 20px 60px rgba(0,0,0,.22)" : "0 20px 60px rgba(22,163,74,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: G,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#fff", flexShrink: 0 }}>
              <i className="fa-solid fa-building-columns" />
            </div>
            <div>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "1.1rem",
                color: dark ? "#d1fae5" : "#0f2d1a" }}>Ramniranjan Jhunjhunwala College</div>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "0.8rem", color: dark ? "#86efac" : "#4b7a5e" }}>Autonomous | NAAC Accredited</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rows.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "11px 13px", borderRadius: 12,
                background: dark ? "rgba(22,163,74,.06)" : "rgba(22,163,74,.04)",
                border: `1px solid ${dark ? "rgba(74,222,128,.08)" : "rgba(22,163,74,.08)"}` }}>
                <div style={{ minWidth: 34, height: 34, borderRadius: 9, background: "rgba(22,163,74,.12)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#16a34a", fontSize: 13 }}>
                  <i className={r.icon} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem",
                    color: dark ? "rgba(74,222,128,.55)" : "rgba(22,163,74,.55)", fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 2 }}>{r.label}</div>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "0.86rem",
                    color: dark ? "#d1fae5" : "#0f2d1a", fontWeight: 600 }}>{r.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div data-aos="fade-left" style={{ borderRadius: 20, overflow: "hidden",
          boxShadow: "0 12px 40px rgba(22,163,74,.18)",
          border: `2px solid ${dark ? "rgba(74,222,128,.14)" : "rgba(22,163,74,.18)"}`, height: 380 }}>
          <iframe
            src="https://maps.google.com/maps?q=Ramniranjan+Jhunjhunwala+College+Mumbai&output=embed&z=15"
            width="100%" height="100%" style={{ border: 0, display: "block" }}
            allowFullScreen loading="lazy" title="College Location Map" />
        </div>
      </div>
    </SectionWrap>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */
function Footer({ dark }: { dark: boolean }) {
  const links = ["about", "objectives", "tips", "renewable", "survey", "gallery", "team"];
  const labels: Record<string, string> = { about:"About", objectives:"Objectives", tips:"Tips", renewable:"Renewable", survey:"Survey", gallery:"Gallery", team:"Team" };

  return (
    <footer style={{ background: dark ? "#040e08" : "#0f2d1a", color: "#d1fae5", padding: "48px 0 24px", fontFamily: "'Nunito',sans-serif" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 32, marginBottom: 36 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <i className="fa-solid fa-leaf" style={{ color: "#4ade80", fontSize: 20 }} />
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "1.08rem",
                background: "linear-gradient(90deg,#4ade80,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>EcoProject</span>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#86efac", lineHeight: 1.72, margin: 0 }}>
              A college field project on Energy Conservation — raising awareness, collecting data,
              and inspiring sustainable habits for a better future.
            </p>
          </div>
          <div>
            <h6 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: "#4ade80",
              marginBottom: 14, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: ".5px" }}>Quick Links</h6>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {links.map((l) => (
                <button key={l} onClick={() => document.getElementById(l)?.scrollIntoView({ behavior: "smooth" })}
                  style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0,
                    color: "#86efac", fontSize: "0.84rem", fontFamily: "'Nunito',sans-serif",
                    display: "flex", alignItems: "center", gap: 6, transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#4ade80")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#86efac")}>
                  <i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} />{labels[l]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h6 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: "#4ade80",
              marginBottom: 14, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: ".5px" }}>Eco Fact</h6>
            <div style={{ background: "rgba(22,163,74,.1)", border: "1px solid rgba(74,222,128,.18)",
              borderRadius: 13, padding: "14px 16px" }}>
              <i className="fa-solid fa-quote-left" style={{ color: "#4ade80", marginBottom: 6, display: "block" }} />
              <p style={{ fontSize: "0.83rem", color: "#d1fae5", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                "If every American home replaced just one bulb with an LED, it would save enough energy to light 3 million homes for a year."
              </p>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(74,222,128,.12)", paddingTop: 20,
          display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <p style={{ fontSize: "0.8rem", color: "#86efac", margin: 0 }}>
            <i className="fa-solid fa-leaf" style={{ marginRight: 6, color: "#4ade80" }} />
            Energy Conservation Field Project © 2026 — Ramniranjan Jhunjhunwala College
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {["fa-brands fa-instagram", "fa-brands fa-twitter", "fa-solid fa-envelope"].map((ic) => (
              <div key={ic} style={{ width: 33, height: 33, borderRadius: "50%",
                background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#4ade80", fontSize: 13, cursor: "pointer", transition: "background .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(74,222,128,.2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(74,222,128,.1)")}>
                <i className={ic} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Global CSS ─────────────────────────────────────────────────────────── */
const CSS = `
  @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes bounceD { 0%,100%{transform:translateY(0);opacity:.65} 50%{transform:translateY(8px);opacity:1} }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(22,163,74,.35); border-radius: 8px; }
`;

/* ─── App ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [dark, setDark] = useState(false);
  useCDN();

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => s.remove();
  }, []);

  useEffect(() => {
    document.documentElement.style.background = dark ? "#071a0f" : "#f0fdf4";
    document.body.style.background = dark ? "#071a0f" : "#f0fdf4";
  }, [dark]);

  return (
    <div style={{
      fontFamily: "'Nunito',sans-serif",
      minHeight: "100vh",
      background: dark ? "#071a0f" : "#f0fdf4",
      color: dark ? "#d1fae5" : "#0f2d1a",
      transition: "background .4s,color .4s",
    }}>
      <Navbar dark={dark} setDark={setDark} />
      <Hero dark={dark} />
      <About dark={dark} />
      <Objectives dark={dark} />
      <Tips dark={dark} />
      <Renewable dark={dark} />
      <Survey dark={dark} />
      <Gallery dark={dark} />
      <Team dark={dark} />
      <Contact dark={dark} />
      <Footer dark={dark} />
      <ScrollTop />
    </div>
  );
}
