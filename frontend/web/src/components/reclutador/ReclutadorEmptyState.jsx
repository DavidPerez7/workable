import React from "react";

const ReclutadorEmptyState = ({ children, action }) => {
  return (
    <div className="reclutador-empty-RP">
      <div>{children}</div>
      {action ? <div>{action}</div> : null}
    </div>
  );
};

export default ReclutadorEmptyState;
