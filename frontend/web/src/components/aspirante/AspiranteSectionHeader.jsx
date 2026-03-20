import React from "react";
import "./AspirantePrimitives.css";

const AspiranteSectionHeader = ({ kicker, title, subtitle, action }) => {
  return (
    <div className="asp-section-header">
      <div>
        {kicker ? <p className="asp-kicker">{kicker}</p> : null}
        <h2>{title}</h2>
        {subtitle ? <p className="asp-section-subtitle">{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
};

export default AspiranteSectionHeader;
