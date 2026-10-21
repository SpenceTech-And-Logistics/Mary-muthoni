import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ContentProvider from "./lib/ContentProvider";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Positions from "./pages/Positions";
import Awards from "./pages/Awards";
import News from "./pages/News";
import Article from "./pages/Article";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// The admin area is a separate chunk: visitors never download it.
const Admin = lazy(() => import("./pages/admin/Admin"));

function App() {
  return (
    <ContentProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="positions" element={<Positions />} />
          <Route path="awards" element={<Awards />} />
          <Route path="news" element={<News />} />
          <Route path="news/:slug" element={<Article />} />
          <Route path="events" element={<Events />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="admin/*" element={<Suspense fallback={<p className="admin-loading">Loading...</p>}><Admin /></Suspense>} />
      </Routes>
    </ContentProvider>
  );
}

export default App;
