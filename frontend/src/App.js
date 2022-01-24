import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect } from "react";
import "./App.scss";
import NotificationAccess from "./screens/NotificationAccess";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SendNotifications from "./screens/SendNotifications";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  useEffect(() => console.log(process.env), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <main className="container">
                <NotificationAccess />
              </main>
            }
          />
          <Route
            path="/notification"
            element={
              <main className="container">
                <SendNotifications />
              </main>
            }
          />
          <Route path="*" element={<NotificationAccess />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
