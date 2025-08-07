import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode'; // 1. Importa la librería

const authContext = createContext();

export function ContextoAuth({ children }) {
  const [auth, setAuth] = useState({ token: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setAuth({ 
            token, 
            rol: decodedToken.roles, 
            usuario: decodedToken.usuario,
            id_rol: decodedToken.id_rol,
          });
        } catch (error) {
          localStorage.removeItem("token");
          setAuth({ token: null });
        }
      }
      setLoading(false);
    }, []);

  


  
  const login = (token) => {
    localStorage.setItem("token", token);
    const decodedToken = jwtDecode(token);
    setAuth({ 
      token, 
      rol: decodedToken.roles, 
      usuario: decodedToken.usuario,
      id_rol: decodedToken.id_rol 
    });

  };

  
  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null });
  };

  if (loading) return null;

  return (
    <authContext.Provider value={{ auth, login, logout }}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un ContextoAuth");
  }
  return context;
};