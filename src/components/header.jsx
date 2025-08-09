import "../assets/css/header.css"
import { useAuth } from "../auth/authContext";
import { NotificationCenter } from "./NotificationCenter";
export function Header({ onToggleSidebar }) {
    const { auth } = useAuth();
    return (
        <>
            <header className="modern-header">
                <div className="header-content">
                    <div className="header-left">
                        <button
                            className="sidebar-toggle"
                            onClick={onToggleSidebar}
                            title="Abrir/Cerrar menú"
                        >
                            <i className="bi bi-list"></i>
                        </button>
                        <h1 style={{ color: "black" }}>Granja Dash</h1>
                    </div>

                    <div className="header-profile">
                        <NotificationCenter />
                        <div className="profile-info">
                            <div className="profile-text">
                                <span className="profile-name">{auth.usuario}</span>
                                <span className="profile-role ">{auth.rol}</span>
                            </div>
                            <div className="profile-avatar">
                                <img
                                    src="https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-black-hen-logo-vector-png-image_6681063.png"
                                    alt="Profile"
                                    className="avatar-img"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </header>
        </>
    )
}