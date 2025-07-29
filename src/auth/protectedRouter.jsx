import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

export function AuthRoute({ children, roles }) {
  const { auth, loading } = useAuth();

  if (loading) return null;

  const token = auth.token;
  const nombre = auth.nombre;
  const id_rol = auth.id_rol;

  const UsuarioAutenticado = token && nombre && id_rol;

  if (!UsuarioAutenticado || !roles.includes(id_rol)) {
    return <Navigate to="/" />;
  }
  return children;
}