import React from "react";

const ReclutadorSectionHeader = ({ kicker, title, subtitle, action }) => {
  return (
    <div className="reclutador-card-header-RP">
      <div>
        {kicker ? <p className="reclutador-kicker-RP">{kicker}</p> : null}
        <h2>{title}</h2>
        {subtitle ? <p className="reclutador-empty-RP">{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
};

export default ReclutadorSectionHeader;
