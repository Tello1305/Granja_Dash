import { BrowserRouter, Link } from 'react-router-dom'
import "./assets/css/login.css"
import {RouterPublic} from './routers/router.public.jsx'
import "./assets/css/style.css"
import "./assets/css/main.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export function App() { 
    return (
        <>
        <BrowserRouter>
        <RouterPublic/>
        </BrowserRouter>
        </>
    )
}
