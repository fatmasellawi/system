import React, { useMemo } from "react";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { DataProvider } from "./context/DataContext"; // 👈 Assure-toi que ce fichier existe
import { themeSettings } from "./theme";
import "./i18n";

// Pages & composants
import Layout from './scenes/layout';
import Dashboard from './scenes/dashboard';
import Patrol from "./scenes/patrol";
import Visitor from "./scenes/Visitor";
import LoginRegister from "./scenes/authentification";
import StockManagementPage from "./pages/StockManagementPage";
import EquipmentList from "./pages/StockManagementPage";
import NotificationsPage from "./pages/NotificationsPage";
import Overview from "./components/Overview";
import WorkPermit from "./pages/WorkPermit";
import PatrolList from "./pages/PatrolList";
import BreakdownDashboard from "./scenes/breakdown"; // 👈 Celui qui utilise useData

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <UserProvider>
          <DataProvider> {/* ✅ Ajout du DataProvider ici */}
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Routes>
                {/* Auth */}
                <Route path="/login" element={<LoginRegister />} />
                <Route path="/activate/:activationCode" element={<LoginRegister />} />

                {/* Routes privées */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="patrol" element={<Patrol />} />
                  <Route path="visitor" element={<Visitor />} />
                  <Route path="EquipmentList" element={<EquipmentList />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="stock" element={<StockManagementPage />} />
                  <Route path="Overview" element={<Overview />} />
                  <Route path="PatrolList" element={<PatrolList />} />
                  <Route path="WorkPermit" element={<WorkPermit />} />
                  <Route path="breakdown" element={<BreakdownDashboard />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<LoginRegister />} />
              </Routes>
            </ThemeProvider>
          </DataProvider>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
