import React from "react";
import "./AppUI.css";

const AppSectionHeader = ({ kicker, title, subtitle, action }) => {
  return (
    <div className="app-section-header">
      <div>
        {kicker ? <p className="app-kicker">{kicker}</p> : null}
        <h2>{title}</h2>
        {subtitle ? <p className="app-section-subtitle">{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
};

export default AppSectionHeader;