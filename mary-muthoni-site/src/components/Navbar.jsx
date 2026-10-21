import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useContent } from "../lib/contentContext";
import { NAV } from "./nav";


function Navbar() {
  const { settings, fullName } = useContent();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="topstrip">
        <div className="container">
          Official profile of {fullName} <span className="dot">&middot;</span> {settings.role}, {settings.ministry} <span className="dot hide-sm">&middot;</span> <span className="hide-sm">Maintained by the office</span>
        </div>
      </div>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="wordmark" onClick={() => setOpen(false)}><span className="mark" aria-hidden="true" />{settings.name}</Link>
          <button className="nav-toggle" aria-expanded={open} aria-controls="site-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
            <span /><span /><span />
          </button>
          <nav id="site-nav" className={`nav ${open ? "is-open" : ""}`} aria-label="Main" onClick={() => setOpen(false)}>
            {NAV.map(([to, label]) => <NavLink key={to} to={to} className="nav-link">{label}</NavLink>)}
            <NavLink to="/contact" className="pill pill-ink">Contact</NavLink>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Navbar;
