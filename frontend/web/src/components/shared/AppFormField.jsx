import React from "react";
import "./AppUI.css";

const AppFormField = ({ label, htmlFor, children, hint, className = "", fullWidth = false }) => {
  const classes = ["app-form-field", className, fullWidth ? "full-width" : ""].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {label ? <label htmlFor={htmlFor}>{label}</label> : null}
      {children}
      {hint ? <small>{hint}</small> : null}
    </div>
  );
};

export default AppFormField;