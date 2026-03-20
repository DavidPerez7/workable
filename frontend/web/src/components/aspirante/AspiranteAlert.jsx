import React from "react";
import "./AspirantePrimitives.css";

const AspiranteAlert = ({ children, type = "error", className = "" }) => {
  const classes = className ? `asp-alert ${type} ${className}` : `asp-alert ${type}`;
  return <div className={classes}>{children}</div>;
};

export default AspiranteAlert;
