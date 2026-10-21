import { createElement, useState } from "react";
import site from "../../site.config.js";
import Seo from "../components/Seo";
import { PageHead } from "../components/Blocks";
import { SOCIALS } from "../components/socials";
import { useContent } from "../lib/contentContext";
import { isConfigured } from "../lib/firebase";
import { sendMessage } from "../lib/store";

const TOPICS = ["Media enquiry", "Speaking invitation", "Partnership", "General question"];
const FORMSPREE = import.meta.env.VITE_FORMSPREE_ID || site.formspreeId;

function Contact() {
  const { settings, displayName } = useContent();
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const c = settings.contact;

  async function onSubmit(e) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    if (form.get("website")) return; // honeypot: bots fill this in
    const data = {
      name: String(form.get("name")).trim().slice(0, 120),
      email: String(form.get("email")).trim().slice(0, 160),
      organisation: String(form.get("organisation") || "").trim().slice(0, 120),
      topic: String(form.get("topic")),
      message: String(form.get("message")).trim().slice(0, 3000),
    };
    setState("sending");
    try {
      if (isConfigured) await sendMessage(data);
      if (FORMSPREE) {
        await fetch(`https://formspree.io/f/${FORMSPREE}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
      }
      if (!isConfigured && !FORMSPREE) await new Promise((r) => setTimeout(r, 500)); // preview mode
      formEl.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  const socials = SOCIALS.filter(([k]) => settings.socials[k]);

  return (
    <>
      <Seo title="Contact" path="/contact" description={`Media, partnership and speaking enquiries for ${displayName}.`} />
      <PageHead eyebrow="CONTACT" title="Contact the office.">
        <p className="page-intro">{c.mediaNote}</p>
      </PageHead>

      <section>
        <div className="container contact-grid pt-md">
          <form className="form" onSubmit={onSubmit}>
            <div className="form-row">
              <label>Full name<input name="name" required maxLength={120} autoComplete="name" /></label>
              <label>Email<input name="email" type="email" required maxLength={160} autoComplete="email" /></label>
            </div>
            <div className="form-row">
              <label>Organisation (optional)<input name="organisation" maxLength={120} autoComplete="organization" /></label>
              <label>Subject
                <select name="topic">{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
              </label>
            </div>
            <label>Message<textarea name="message" rows={7} required minLength={5} maxLength={3000} /></label>
            <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="form-foot">
              <button className="pill pill-teal pill-lg" type="submit" disabled={state === "sending"}>
                {state === "sending" ? "Sending..." : "Send message"}
              </button>
              <p className="muted small" role="status" aria-live="polite">
                {state === "sent" && "Thank you. Your message has reached the office."}
                {state === "error" && "Sorry, that did not send. Please try again in a moment."}
                {state === "idle" && "Your details are used only to reply to you."}
              </p>
            </div>
          </form>

          <aside className="contact-side">
            <div className="contact-card">
              <div className="label">OFFICE</div>
              {c.address && <p>{c.address}</p>}
              {c.email && <p><a href={`mailto:${c.email}`}>{c.email}</a></p>}
              {c.phone && <p><a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`}>{c.phone}</a></p>}
              {c.hours && <p className="muted small">{c.hours}</p>}
            </div>
            {socials.length > 0 && (
              <div className="contact-card">
                <div className="label">FOLLOW</div>
                <div className="socials dark">
                  {socials.map(([k, label, icon]) => (
                    <a key={k} href={settings.socials[k]} target="_blank" rel="noopener noreferrer" aria-label={label}>{createElement(icon)}</a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
      <div className="spacer" />
    </>
  );
}

export default Contact;
