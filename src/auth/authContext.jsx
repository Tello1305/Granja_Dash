import { createContext, useContext, useEffect, useState } from "react";

const authContext = createContext();

export function ContextoAuth({ children }) {

  const [auth, setAuth] = useState({ token: null, nombre: null, id_rol: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const nombre = localStorage.getItem("nombre");
    const id_rol = localStorage.getItem("id_rol");

    if (token && nombre && id_rol) {
      setAuth({ token, nombre, id_rol: Number(id_rol) });
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("nombre");
      localStorage.removeItem("id_rol");
      setAuth({ token: null, nombre: null, id_rol: null });
    }
    setLoading(false);
  }, []);

  const login = (token, nombre, id_rol) => {
    localStorage.setItem("token", token);
    localStorage.setItem("nombre", nombre);
    localStorage.setItem("id_rol", id_rol);
    setAuth({ token, nombre, id_rol: Number(id_rol) });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre");
    localStorage.removeItem("id_rol");
    setAuth({ token: null, nombre: null, id_rol: null });
  };

  if (loading) return null;

  return (
    <authContext.Provider value={{ auth, setAuth, login, logout }}>
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