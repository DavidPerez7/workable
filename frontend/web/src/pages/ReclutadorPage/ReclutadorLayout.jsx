import React from "react";
import HeaderReclutador from "../../components/HeaderReclutador/HeaderReclutador";
import SidebarReclutador from "../../components/SidebarReclutador/SidebarReclutador";
import "./ReclutadorGlobal.css";

const ReclutadorLayout = ({ children, mainClassName = "" }) => {
  return (
    <>
      <HeaderReclutador />
      <div className="reclutador-shell-RP">
        <SidebarReclutador />
        <div className={mainClassName ? `reclutador-main-RP ${mainClassName}` : "reclutador-main-RP"}>
          {children}
        </div>
      </div>
    </>
  );
};

export default ReclutadorLayout;
