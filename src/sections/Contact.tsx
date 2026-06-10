import { useMotionValue, useSpring, motion } from "framer-motion";
import { contact } from "../content";
import { isTouch } from "../scene/perf";

function MagneticButton({ children, href }: { children: React.ReactNode; href: string }) {
  const x = useSpring(useMotionValue(0), { stiffness: 160, damping: 16 });
  const y = useSpring(useMotionValue(0), { stiffness: 160, damping: 16 });
  return (
    <motion.a
      className="btn solid sc-item"
      href={href}
      style={{ x, y, display: "inline-block", fontSize: "0.92rem", padding: "1.15rem 2.2rem" }}
      onPointerMove={(e) => {
        if (isTouch) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.a>
  );
}

export function Contact() {
  return (
    <>
      <p className="sc-kicker">Kathmandu → anywhere</p>
      <h2 className="sc-title">{contact.title}</h2>
      <span className="availability sc-item">{contact.availability}</span>
      <p className="sc-body sc-fade">{contact.body}</p>
      <div className="contact-actions">
        <MagneticButton href={`mailto:${contact.email}`}>{contact.email}</MagneticButton>
        <a className="btn sc-item" href={contact.resumeUrl} target="_blank" rel="noreferrer">
          Download resume
        </a>
      </div>
      <div className="socials">
        {contact.socials.map((s) => (
          <a className="sc-item" key={s.label} href={s.url} target="_blank" rel="noreferrer">
            {s.label} ↗
          </a>
        ))}
      </div>
      <p className="footer-note sc-fade">{contact.footer}</p>
    </>
  );
}
