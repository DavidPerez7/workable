import React from "react";

const ReclutadorButton = ({ children, className = "", variant = "primary", ...props }) => {
  const variantClass = variant === "link"
    ? "reclutador-link-RP"
    : variant === "action"
      ? "reclutador-action-card-RP"
      : "reclutador-button-RP";

  const classes = className ? `${variantClass} ${className}` : variantClass;
  return <button className={classes} {...props}>{children}</button>;
};

export default ReclutadorButton;
