import { BrowserRouter, Link } from 'react-router-dom'
import { RouterSystem } from './routers/router.jsx'
import "./assets/css/login.css"
import "./assets/css/style.css"
import "./assets/css/main.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/css/variables.css";
import { ContextoAuth } from "./auth/authContext";
import { NotificationProvider } from "./contexts/NotificationContext";

export function App() {
    return (
        <>
            <BrowserRouter>
                <ContextoAuth>
                    <NotificationProvider>
                        <RouterSystem />
                    </NotificationProvider>
                </ContextoAuth>
            </BrowserRouter>
        </>
    )
}
