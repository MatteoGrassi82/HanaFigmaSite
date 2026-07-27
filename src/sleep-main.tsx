// Standalone entry for the HANA Sleep landing page — deployed as its own
// Vercel project (built via vite.sleep.config.ts → dist-sleep). Renders only
// the HanaSleep umbrella page, wrapped in a Router so its shared components
// (Footer, InlineImageHeader) that use react-router <Link> resolve without the
// full app. `standalone` makes the suite cards link out to the main site's
// sub-pages (which don't exist as routes on this single-page deployment).
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { HanaSleep } from "./app/pages/HanaSleep";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <HanaSleep standalone />
  </BrowserRouter>
);
