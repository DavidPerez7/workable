import React from "react";

const ReclutadorFormField = ({ label, htmlFor, children, hint, className = "" }) => {
  return (
    <div className={className ? `reclutador-form-field-RP ${className}` : "reclutador-form-field-RP"}>
      {label ? <label htmlFor={htmlFor}>{label}</label> : null}
      {children}
      {hint ? <small className="reclutador-form-hint-RP">{hint}</small> : null}
    </div>
  );
};

export default ReclutadorFormField;
