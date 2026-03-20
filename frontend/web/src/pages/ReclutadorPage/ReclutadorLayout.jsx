import HeaderReclutador from "../../components/HeaderReclutador/HeaderReclutador";
import SidebarReclutador from "../../components/SidebarReclutador/SidebarReclutador";
import AppPageShell from "../../components/shared/AppPageShell";
import "./ReclutadorGlobal.css";

const ReclutadorLayout = ({ children, mainClassName = "" }) => {
  return (
    <AppPageShell
      header={<HeaderReclutador />}
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
