import React from "react";
import "./AspirantePrimitives.css";

const AspiranteButton = ({ children, className = "", variant = "primary", ...props }) => {
  const variantClass =
    variant === "secondary"
      ? "asp-button-secondary"
      : variant === "danger"
        ? "asp-button-danger"
        : variant === "icon"
          ? "asp-icon-button"
          : "asp-button";

  const classes = className ? `${variantClass} ${className}` : variantClass;
  return <button className={classes} {...props}>{children}</button>;
};

export default AspiranteButton;
