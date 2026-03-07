import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages for general users
import HomePage from "./pages/MainPage/HomePage";
import SalaryPage from "./pages/SalaryPage/SalaryPage";
import ProfessionalPage from "./pages/ProfessionalPage/ProfessionalPage";
import LoginPage from "./components/IniciarSesion/IniciarSesion";
import SignUpPage from "./components/Registro/registro";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Empresas from "./pages/MainPage/Empresas/Empresas";
import KFCPage from "./pages/MainPage/Empresas/KFC/KFCPage";
import Articulo1 from "./pages/ProfessionalPage/Articulos/Articulo1/Articulo1";
import Articulo2 from "./pages/ProfessionalPage/Articulos/Articulo2/Articulo2";
import Articulo3 from "./pages/ProfessionalPage/Articulos/Articulo3/Articulo3";

// Pages for recruiters
import ReclutadorPage from "./pages/ReclutadorPage/ReclutadorPage";
import InfoRecPage from "./pages/ReclutadorPage/InfoReclutadorPage/InfoRecPage";
import ConfigPage from "./pages/ReclutadorPage/ConfigPage/ConfigPage";
import ProfileEditPage from "./pages/ReclutadorPage/ProfileEditPage/ProfileEditPage";
import PublicacionPage from "./pages/ReclutadorPage/PublicacionPage/PublicacionPage";
import GestigOfertsPage from "./pages/ReclutadorPage/GestigOfertsPage/GestigOferts";
import ReclutadorProfile from "./pages/ReclutadorPage/ReclutadorProfilePage/ReclutadorProfile";
import EnterprisePage from "./pages/ReclutadorPage/EnterprisePage/EnterprisePage";
import EmpresaCreatePage from "./pages/ReclutadorPage/EnterprisePage/EmpresaCreatePage";
import EmpresaEditPage from "./pages/ReclutadorPage/EnterprisePage/EmpresaEditPage";
import EditarOfertaLaboral from "./pages/ReclutadorPage/PublicacionPage/EditarOfertaLaboral/EditarOfertaLaboral";
import OfertaCompletaPage from "./pages/ReclutadorPage/OfertaCompletaPage/OfertaCompletaPage";
import VerPostulacionesRecibidas from "./components/VerPostulacionesRecibidas/VerPostulacionesRecibidas";
import RegistrarEmpresa from "./pages/ReclutadorPage/RegistarEmpresa/RegistrarEmpresa";

// Pages for aspirants
import AspirantePage from "./pages/AspirantePage/AspirantePage";
import MiPerfil from "./pages/AspirantePage/MiPerfil/MiPerfil";
import MisPostulaciones from "./pages/AspirantePage/MiPerfil/MisPostulaciones/MisPostulaciones";
import HojaDeVida from "./pages/AspirantePage/MiPerfil/HojaDeVida/HojaDeVida";

// Pages for administrators
import AdminPage from "./pages/AdminPage/AdminPage";
import AdminEmpresas from "./pages/AdminPage/AdminEmpresas/AdminEmpresas";
import OffersPage from "./pages/AdminPage/AdminOfertas/AdminOfertas";
import UsersManagePage from "./pages/AdminPage/AdminUsuarios/AdminUsuarios";

// Shared components
import ReclutadorForm from "./components/Registro/reclutadorForm/reclutadorForm";
import NewReclutador from "./components/Empresa/NewReclutador";
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
        <Route path="/Reclutador/EnterprisePage/Create" element={<ProtectedRoute requiredRole="RECLUTADOR"><EmpresaCreatePage /></ProtectedRoute>} />
        <Route path="/Reclutador/EnterprisePage/Edit" element={<ProtectedRoute requiredRole="RECLUTADOR"><EmpresaEditPage /></ProtectedRoute>} />
        <Route path="/Reclutador/EditarOfertaLaboral" element={<ProtectedRoute requiredRole="RECLUTADOR"><EditarOfertaLaboral /></ProtectedRoute>} />
        <Route path="/Reclutador/OfertaCompleta/:ofertaId" element={<ProtectedRoute requiredRole="RECLUTADOR"><OfertaCompletaPage /></ProtectedRoute>} />
        <Route path="/Reclutador/VerPostulacionesRecibidas" element={<ProtectedRoute requiredRole="RECLUTADOR"><VerPostulacionesRecibidas /></ProtectedRoute>} />
        <Route path="/Reclutador/RegistrarEmpresa" element={<ProtectedRoute requiredRole="RECLUTADOR"><RegistrarEmpresa /></ProtectedRoute>} />
        
        {/* Rutas protegidas de Aspirante */}
        <Route path="/Aspirante" element={<ProtectedRoute requiredRole="ASPIRANTE"><AspirantePage /></ProtectedRoute>} />
        <Route path="/Aspirante/MiPerfil" element={<ProtectedRoute requiredRole="ASPIRANTE"><MiPerfil /></ProtectedRoute>} />
        <Route path="/Aspirante/MiPerfil/MisPostulaciones" element={<ProtectedRoute requiredRole="ASPIRANTE"><MisPostulaciones /></ProtectedRoute>} />
        <Route path="/Aspirante/MiPerfil/HojaDeVida" element={<ProtectedRoute requiredRole="ASPIRANTE"><HojaDeVida /></ProtectedRoute>} />
        
        {/* Rutas protegidas de Administrador */}
        <Route path="/Administrador/*" element={<ProtectedRoute requiredRole="ADMIN"><AdminPage /></ProtectedRoute>} />
        <Route path="/Administrador/Empresas" element={<ProtectedRoute requiredRole="ADMIN"><AdminEmpresas/></ProtectedRoute>} />
        <Route path="/Administrador/Ofertas" element={<ProtectedRoute requiredRole="ADMIN"><OffersPage /></ProtectedRoute>} />
        <Route path="/Administrador/Usuarios" element={<ProtectedRoute requiredRole="ADMIN"><UsersManagePage /></ProtectedRoute>} />
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
