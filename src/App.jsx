import { useEffect, useState } from "react";
import profile from "./assets/profile.png";

const skills = ["JavaScript", "React", "React Native", "Flutter", "HTML", "CSS", "Node.js", "Next.js"];

const projects = [
  { n: "01", title: "Aryan Shop", text: "A modern shopping experience with responsive UI and smooth interactions.", tag: "React" },
  { n: "02", title: "Currency Converter", text: "A clean real-time currency conversion interface built for speed and clarity.", tag: "JavaScript" },
  { n: "03", title: "Developer Portfolio", text: "This portfolio — designed around a dark 3D visual system and polished micro-interactions.", tag: "React" }
];

function App() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onMove = (e) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  async function submit(e) {
    async function submit(e) {
      e.preventDefault();

      const formElement = e.currentTarget;
      setSending(true);
      setSent(false);
      setError("");

      const form = new FormData(formElement);
      const payload = Object.fromEntries(form.entries());

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.message || "Unable to send your message.");
        }

        formElement.reset(); // ✅ FIX
        setSent(true);

      } catch (err) {
        setError(err.message || "Something went wrong. Please try again.");
      } finally {
        setSending(false);
      }
    }
  }

  return (
    <div className="site">
      <div className="noise" />
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="grid3d" />

      <header className="nav">
        <a className="brand" href="#top"><span>A</span> ARYAN</a>
        <nav>
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="nav-cta" href="#contact">Let's talk <b>↗</b></a>
      </header>

      <main id="top">
        <section className="hero section">
          <div className="hero-copy">
            <div className="eyebrow"><i /> AVAILABLE FOR CREATIVE PROJECTS</div>
            <h1>BUILDING<br /><em>THE DIGITAL</em><br />FUTURE.</h1>
            <p className="hero-text">I'm <strong>Aryan Singh</strong>, a developer who turns ideas into fast, beautiful and memorable digital experiences.</p>
            <div className="hero-actions">
              <a className="primary" href="#work">Explore my work <span>↘</span></a>
              <a className="ghost" href="#contact">Contact me</a>
            </div>
          </div>

          <div className="portrait-wrap">
            <div className="ring ring-1" /><div className="ring ring-2" />
            <div className="portrait-card">
              <div className="card-top"><span>01 / PROFILE</span><span>DEVELOPER</span></div>
              <img src={profile} alt="Aryan Singh" />
              <div className="portrait-gradient" />
              <div className="portrait-name">ARYAN<br /><span>SINGH</span></div>
              <div className="verified">✓</div>
            </div>
            <div className="float-card"><span>⌁</span><b>CODE</b><small>CREATE · SHIP · REPEAT</small></div>
          </div>
        </section>

        <section id="about" className="section about">
          <div className="section-label">01 — ABOUT</div>
          <div>
            <h2>I make interfaces that feel <span>alive.</span></h2>
            <p className="lead">From a blank screen to a finished product, I care about the tiny details: motion, hierarchy, performance and the feeling a user gets when everything just clicks.</p>
            <div className="stats">
              <div><strong>08+</strong><span>TECHNOLOGIES</span></div>
              <div><strong>∞</strong><span>IDEAS TO BUILD</span></div>
              <div><strong>100%</strong><span>CURIOUS</span></div>
            </div>
          </div>
        </section>

        <section className="section skills">
          <div className="section-label">02 — TOOLKIT</div>
          <div className="skill-cloud">{skills.map((s, i) => <div className="skill" key={s}><span>0{i + 1}</span>{s}</div>)}</div>
        </section>

        <section id="work" className="section work">
          <div className="section-head"><div className="section-label">03 — SELECTED WORK</div><p>Things I've built and experiments I'm proud of.</p></div>
          <div className="projects">
            {projects.map(p => <article className="project" key={p.n}>
              <div className="project-number">{p.n}</div>
              <div className="project-info"><span>{p.tag}</span><h3>{p.title}</h3><p>{p.text}</p></div>
              <div className="project-arrow">↗</div>
            </article>)}
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="contact-copy">
            <div className="section-label">04 — CONTACT</div>
            <h2>LET'S<br /><em>BUILD.</em></h2>
            <p>Have an idea? Send me a message directly from the portfolio.</p>
            <a className="email" href="mailto:coxaryan.singh@gmail.com">coxaryan.singh@gmail.com <span>↗</span></a>
          </div>
          <form className="contact-form" onSubmit={submit}>
            <input name="website" className="honeypot" tabIndex="-1" autoComplete="off" />
            <label>Name<input name="name" required placeholder="Your name" /></label>
            <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
            <label>Message<textarea name="message" required minLength="10" placeholder="Tell me about your idea..." /></label>
            <button disabled={sending}>{sending ? "Sending..." : "Send Message ↗"}</button>
            {sent && <div className="form-status success">Message sent successfully.</div>}
            {error && <div className="form-status error">{error}</div>}
          </form>
        </section>
      </main>

      <footer><span>© {new Date().getFullYear()} ARYAN SINGH</span><span>BUILT WITH REACT · FROM INDIA</span></footer>
    </div>
  );
}

export default App;
