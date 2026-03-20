import Header from "../../components/Header/Header";
import SidebarReclutador from "../../components/SidebarReclutador/SidebarReclutador";
import AppPageShell from "../../components/shared/AppPageShell";
import "./ReclutadorGlobal.css";

const ReclutadorLayout = ({ children, mainClassName = "" }) => {
  return (
    <AppPageShell
      header={<Header variant="simple" />}
      sidebar={<SidebarReclutador />}
      mainClassName={mainClassName ? `reclutador-main-RP ${mainClassName}` : "reclutador-main-RP"}
      shellClassName="reclutador-shell-RP"
      orientation="sidebar"
    >
      {children}
    </AppPageShell>
  );
};

export default ReclutadorLayout;
