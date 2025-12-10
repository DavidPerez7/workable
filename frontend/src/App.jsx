import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/MainPage/HomePage";
import SalaryPage from "./pages/SalaryPage/SalaryPage";
import ProfessionalPage from "./pages/ProfessionalPage/ProfessionalPage";
import LoginPage from "./components/IniciarSesion/IniciarSesion";
import SignUpPage from "./components/Registro/registro";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ReclutadorPage from "./pages/ReclutadorPage/ReclutadorPage";
import Articulo1 from "./pages/ProfessionalPage/Articulos/Articulo1/Articulo1";
import Articulo2 from "./pages/ProfessionalPage/Articulos/Articulo2/Articulo2";
import Articulo3 from "./pages/ProfessionalPage/Articulos/Articulo3/Articulo3";
import ConfigPage from "./pages/ReclutadorPage/ConfigPage/ConfigPage";
import ProfileEditPage from "./pages/ReclutadorPage/ProfileEditPage/ProfileEditPage";
import PublicacionPage from "./pages/ReclutadorPage/PublicacionPage/PublicacionPage";
import AspirantePage from "./pages/AspirantePage/AspirantePage";
import InfoRecPage from "./pages/ReclutadorPage/InfoReclutadorPage/InfoRecPage";
import MiPerfil from "./pages/AspirantePage/MiPerfil/MiPerfil";
import GestigOfertsPage from "./pages/ReclutadorPage/GestigOfertsPage/GestigOferts";
import AdminPage from "./pages/AdminPage/AdminPage";
import AdminAccountsPage from "./pages/AdminPage/AdminAccountPage/AdminAccountPage";
import CompaniesPage from "./pages/AdminPage/CompaniesPage/CompaniesPage";
import FeedBackPage from "./pages/AdminPage/FeedBackPage/FeedBackPage";
import OffersPage from "./pages/AdminPage/OffersPage/OffersPage";
import ReportPage from "./pages/AdminPage/ReportPage/ReportPage";
import UsersManagePage from "./pages/AdminPage/UsersManagePage/UsersManagePage";
import Empresas from "./pages/MainPage/Empresas/Empresas";
import KFCPage from "./pages/MainPage/Empresas/KFC/KFCPage";
import ReclutadorProfile from "./pages/ReclutadorPage/ReclutadorProfilePage/ReclutadorProfile";
import EnterprisePage from "./pages/ReclutadorPage/EnterprisePage/EnterprisePage";
import ReclutadorForm from "./components/Registro/reclutadorForm/reclutadorForm";
import ActualizarPerfil from "./pages/AspirantePage/MiPerfil/ActualizarPerfil/ActualizarPerfil";
import EditarOfertaLaboral from "./pages/ReclutadorPage/PublicacionPage/EditarOfertaLaboral/EditarOfertaLaboral";
import VerPostulacionesRecibidas from "./components/VerPostulacionesRecibidas/VerPostulacionesRecibidas";
import MisPostulaciones from "./pages/AspirantePage/MiPerfil/MisPostulaciones/MisPostulaciones";
import HojaDeVida from "./pages/AspirantePage/MiPerfil/HojaDeVida/HojaDeVida";
import NewReclutador from "./components/Empresa/NewReclutador";
import RegistrarEmpresa from "./pages/ReclutadorPage/RegistarEmpresa/RegistrarEmpresa";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/salary" element={<SalaryPage />} />
        <Route path="/professional" element={<ProfessionalPage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Signup" element={<SignUpPage />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        
        {/* Rutas protegidas de Reclutador */}
        <Route path="/Reclutador" element={<ProtectedRoute requiredRole="RECLUTADOR"><ReclutadorPage /></ProtectedRoute>} />
        <Route path="/Reclutador/Reclutamiento" element={<ProtectedRoute requiredRole="RECLUTADOR"><InfoRecPage /></ProtectedRoute>} />
        <Route path="/Reclutador/Configuracion" element={<ProtectedRoute requiredRole="RECLUTADOR"><ConfigPage /></ProtectedRoute>} />
        <Route path="/Reclutador/EditarPerfil" element={<ProtectedRoute requiredRole="RECLUTADOR"><ProfileEditPage /></ProtectedRoute>} />
        <Route path="/Reclutador/Publicacion" element={<ProtectedRoute requiredRole="RECLUTADOR"><PublicacionPage /></ProtectedRoute>} />
        <Route path="/Reclutador/GestigOferts" element={<ProtectedRoute requiredRole="RECLUTADOR"><GestigOfertsPage /></ProtectedRoute>} />
        <Route path="/Reclutador/ReclutadorProfile" element={<ProtectedRoute requiredRole="RECLUTADOR"><ReclutadorProfile /></ProtectedRoute>} />
        <Route path="/Reclutador/EnterprisePage" element={<ProtectedRoute requiredRole="RECLUTADOR"><EnterprisePage /></ProtectedRoute>} />
        <Route path="/Reclutador/EditarOfertaLaboral" element={<ProtectedRoute requiredRole="RECLUTADOR"><EditarOfertaLaboral /></ProtectedRoute>} />
        <Route path="/Reclutador/VerPostulacionesRecibidas" element={<ProtectedRoute requiredRole="RECLUTADOR"><VerPostulacionesRecibidas /></ProtectedRoute>} />
        <Route path="/Reclutador/RegistrarEmpresa" element={<ProtectedRoute requiredRole="RECLUTADOR"><RegistrarEmpresa /></ProtectedRoute>} />
        
        {/* Rutas protegidas de Aspirante */}
        <Route path="/Aspirante" element={<ProtectedRoute requiredRole="ASPIRANTE"><AspirantePage /></ProtectedRoute>} />
        <Route path="/Aspirante/MiPerfil" element={<ProtectedRoute requiredRole="ASPIRANTE"><MiPerfil /></ProtectedRoute>} />
        <Route path="/ActualizarPerfil/ActualizarPerfil" element={<ProtectedRoute requiredRole="ASPIRANTE"><ActualizarPerfil /></ProtectedRoute>} />
        <Route path="/MiPerfil/MisPostulaciones" element={<ProtectedRoute requiredRole="ASPIRANTE"><MisPostulaciones /></ProtectedRoute>} />
        <Route path="/MiPerfil/HojaDeVida" element={<ProtectedRoute requiredRole="ASPIRANTE"><HojaDeVida /></ProtectedRoute>} />
        
        {/* Rutas protegidas de Administrador */}
        <Route path="/Administrador" element={<ProtectedRoute requiredRole="ADMIN"><AdminPage /></ProtectedRoute>} />
        <Route path="/Administrador/CuentasInternas" element={<ProtectedRoute requiredRole="ADMIN"><AdminAccountsPage /></ProtectedRoute>} />
        <Route path="/Administrador/Empresas" element={<ProtectedRoute requiredRole="ADMIN"><CompaniesPage /></ProtectedRoute>} />
        <Route path="/Administrador/Reportes" element={<ProtectedRoute requiredRole="ADMIN"><ReportPage /></ProtectedRoute>} />
        <Route path="/Administrador/Retroalimentacion" element={<ProtectedRoute requiredRole="ADMIN"><FeedBackPage /></ProtectedRoute>} />
        <Route path="/Administrador/Ofertas" element={<ProtectedRoute requiredRole="ADMIN"><OffersPage /></ProtectedRoute>} />
        <Route path="/Administrador/Usuarios" element={<ProtectedRoute requiredRole="ADMIN"><UsersManagePage /></ProtectedRoute>} />
        
        <Route path="/Administrador" element={<AdminPage />} />
        <Route path="/articulo1" element={<Articulo1 />} />
        <Route path="/articulo2" element={<Articulo2 />} />
        <Route path="/articulo3" element={<Articulo3 />} />
        <Route path="/Empresas" element={<Empresas />} />
        <Route path="/KFCPage" element={<KFCPage />} />
        <Route path="/reclutador/ReclutadorForm" element={<ReclutadorForm />} />
        <Route path="/SignUpPage/NewReclutador" element={<NewReclutador />} />
      </Routes>
    </Router>
  );
}
export default App;
