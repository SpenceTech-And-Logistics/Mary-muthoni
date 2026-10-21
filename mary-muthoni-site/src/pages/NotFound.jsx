import { Link } from "react-router-dom";
import Seo from "../components/Seo";

function NotFound() {
  return (
    <section className="page-head not-found">
      <Seo title="Page not found" noindex />
      <div className="container">
        <div className="eyebrow">404</div>
        <h1>This page could not be found.</h1>
        <p className="page-intro">It may have moved. Try the projects or the latest news.</p>
        <div className="hero-actions">
          <Link to="/" className="pill pill-teal pill-lg">Go to the home page</Link>
          <Link to="/news" className="pill pill-outline pill-lg">Latest news</Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
