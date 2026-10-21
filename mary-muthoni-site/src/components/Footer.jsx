import { createElement } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../lib/contentContext";
import { NAV } from "./nav";
import { SOCIALS } from "./socials";

function Footer() {
  const { settings, fullName } = useContent();
  const c = settings.contact;
  const links = SOCIALS.filter(([key]) => settings.socials[key]);
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-name">{fullName}</div>
          <p className="footer-role">{settings.role}, {settings.agency}</p>
          {links.length > 0 && (
            <div className="socials">
              {links.map(([key, label, icon]) => (
                <a key={key} href={settings.socials[key]} target="_blank" rel="noopener noreferrer" aria-label={label}>{createElement(icon)}</a>
              ))}
            </div>
          )}
        </div>
        <nav className="footer-links" aria-label="Footer">
          {NAV.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="footer-contact">
          {[c.address, c.email, c.phone].filter(Boolean).map((line) => <div key={line}>{line}</div>)}
        </div>
      </div>
      <div className="container footer-legal">
        <span>&copy; {new Date().getFullYear()} {settings.name}. Published and maintained by the office.</span>
        <span>Built by SpenceTecH &amp; Logistics Ltd</span>
      </div>
    </footer>
  );
}

export default Footer;
