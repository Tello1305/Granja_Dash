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
                        <div className="header-brand">
                            <h1 className="brand-title">GRANJA DASH</h1>
                        </div>
                    </div>

                    <div className="header-search">
                        <div className="search-container">
                            <i className="bi bi-search search-icon"></i>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Buscar plantas aquí..."
                            />
                        </div>
                    </div>

                    <div className="header-profile">
                        <div className="profile-info">
                            <div className="profile-text">
                                <span className="profile-name">{auth.nombre}</span>
                                <span className="profile-role">Administrador</span>
                            </div>
                            <div className="profile-avatar">
                                <img
                                    src="https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-black-hen-logo-vector-png-image_6681063.png"
                                    alt="Profile"
                                    className="avatar-img"
                                />
                            </div>
                        </div>
                        <div className="profile-actions">
                            <i className="bi bi-bell notification-icon"></i>
                            <i className="bi bi-chevron-down dropdown-icon"></i>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}