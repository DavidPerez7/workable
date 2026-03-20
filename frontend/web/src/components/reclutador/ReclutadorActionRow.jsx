import React from "react";

const ReclutadorActionRow = ({ children, className = "" }) => {
  const classes = className ? `reclutador-action-row-RP ${className}` : "reclutador-action-row-RP";
  return <div className={classes}>{children}</div>;
};

export default ReclutadorActionRow;
