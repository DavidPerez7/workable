import React from "react";

const ReclutadorCard = ({ children, className = "", as: Component = "section" }) => {
  const classes = className ? `reclutador-card-RP ${className}` : "reclutador-card-RP";
  return <Component className={classes}>{children}</Component>;
};

export default ReclutadorCard;
