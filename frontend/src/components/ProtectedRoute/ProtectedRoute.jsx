import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene, redirigir a la página principal
  if (requiredRole && rol !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, renderizar el componente
  return children;
};

export default ProtectedRoute;
