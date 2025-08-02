import "../assets/css/header.css"
import { useAuth } from "../auth/authContext";
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
                            aria-label="Toggle sidebar"
                        >
                            <i className="bi bi-list"></i>
                        </button>
                    </div>

                    <div className="header-profile">
                        <div className="profile-info">
                            <div className="profile-text">
                                <span className="profile-name">{auth.nombre}</span>
                                <span className="profile-role ">Administrador</span>
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