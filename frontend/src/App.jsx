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
        <Route path="/Reclutador" element={<ReclutadorPage />} />
        <Route path="/Administrador" element={<AdminPage />} />
        <Route path="/articulo1" element={<Articulo1 />} />
        <Route path="/articulo2" element={<Articulo2 />} />
        <Route path="/articulo3" element={<Articulo3 />} />
        <Route path="/Reclutador/Reclutamiento" element={<InfoRecPage />} />
        <Route path="/Reclutador/Configuracion" element={<ConfigPage />} />
        <Route path="/Reclutador/EditarPerfil" element={<ProfileEditPage />} />
        <Route path="/Aspirante" element={<AspirantePage />} />
        <Route path="/Aspirante/MiPerfil" element={<MiPerfil />} />
        <Route path="/Reclutador/Publicacion" element={<PublicacionPage />} />
        <Route path="/Reclutador/GestigOferts" element={<GestigOfertsPage />} />

        <Route
          path="/Administrador/CuentasInternas"
          element={<AdminAccountsPage />}
        />
        <Route path="/Administrador/Empresas" element={<CompaniesPage />} />
        <Route path="/Administrador/Reportes" element={<ReportPage />} />
        <Route
          path="/Administrador/Retroalimentacion"
          element={<FeedBackPage />}
        />
        <Route path="/Administrador/Ofertas" element={<OffersPage />} />
        <Route path="/Administrador/Usuarios" element={<UsersManagePage />} />
        <Route path="/Empresas" element={<Empresas />} />
        <Route path="/KFCPage" element={<KFCPage />} />
        <Route
          path="/Reclutador/ReclutadorProfile"
          element={<ReclutadorProfile />}
        />
        <Route path="/Reclutador/EnterprisePage" element={<EnterprisePage />} />
        <Route path="/reclutador/ReclutadorForm" element={<ReclutadorForm />} />
        <Route
          path="/ActualizarPerfil/ActualizarPerfil"
          element={<ActualizarPerfil />}
        />
        <Route
          path="/Reclutador/EditarOfertaLaboral"
          element={<EditarOfertaLaboral />}
        />
        <Route
          path="/Reclutador/VerPostulacionesRecibidas"
          element={<VerPostulacionesRecibidas />}
        />
        <Route
          path="/MiPerfil/MisPostulaciones"
          element={<MisPostulaciones />}
        />
        <Route path="/MiPerfil/HojaDeVida" element={<HojaDeVida />} />
        <Route path="/SignUpPage/NewReclutador" element={<NewReclutador />} />
        <Route path="/Reclutador/RegistrarEmpresa" element={<RegistrarEmpresa />} />
      </Routes>
    </Router>
  );
}
export default App;
