import React from "react";
import "./AspirantePrimitives.css";

const AspiranteFormField = ({ label, htmlFor, children, hint, className = "", fullWidth = false }) => {
  const classes = ["asp-form-field", className, fullWidth ? "full-width" : ""].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {label ? <label htmlFor={htmlFor}>{label}</label> : null}
      {children}
      {hint ? <small>{hint}</small> : null}
    </div>
  );
};

export default AspiranteFormField;
