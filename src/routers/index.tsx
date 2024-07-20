import { HashRouter as Router, Route, Routes } from "react-router-dom";
import routes from "./routes";

export default function AppRouter () {

    return(
        <Router>
            <Routes>
                {routes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
            </Routes>
        </Router>
    )
}