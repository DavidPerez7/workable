import React from "react";

const ReclutadorAlert = ({ children, type = "error", className = "" }) => {
  const classes = className ? `reclutador-alert-RP ${type} ${className}` : `reclutador-alert-RP ${type}`;
  return <div className={classes}>{children}</div>;
};

export default ReclutadorAlert;
