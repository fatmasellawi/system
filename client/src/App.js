import {CssBaseline} from "@mui/material";
import {createTheme} from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from './scenes/layout'; // Fixed
import Dashboard from './scenes/dashboard'; // Fixed
import { ThemeProvider } from '@mui/material/styles';
import { themeSettings } from "./theme";

  function App() {
    const mode = useSelector((state) => state.global.mode);
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  
    return (
      <div className="app">
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                {/* Add more nested routes here */}
              </Route>
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </div>
    );
  }
  export default App;  