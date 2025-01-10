import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import CampaignPage from "./components/campaign/CampaignPage";
import ErrorLogs from "./components/admin/ErrorLogs";
import PublisherDashboard from "./components/publisher/PublisherDashboard";
import routes from "tempo-routes";
import { CampaignProvider } from "./contexts/CampaignContext";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <CampaignProvider>
          <>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/campaign/:id" element={<CampaignPage />} />
              <Route path="/admin/error-logs" element={<ErrorLogs />} />
              <Route
                path="/publisher/dashboard"
                element={<PublisherDashboard />}
              />
            </Routes>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          </>
        </CampaignProvider>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
