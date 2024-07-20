import { HashRouter as Router, Route, Routes } from "react-router-dom";
import routes from "./routes";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

export default function AppRouter () {
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    return(
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Router>
                <Routes>
                    {routes.map((route, index) => (
                        <Route key={index} path={route.path} element={route.element} />
                    ))}
                </Routes>
            </Router>
        </ThemeProvider>
    )
}