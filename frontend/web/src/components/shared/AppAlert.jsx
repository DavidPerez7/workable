import React from "react";
import "./AppUI.css";

const AppAlert = ({ children, type = "error", className = "" }) => {
  const classes = ["app-alert", type, className].filter(Boolean).join(" ");
  return <div className={classes}>{children}</div>;
};

export default AppAlert;