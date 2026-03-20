import React from "react";
import "./AppUI.css";

const variantClassMap = {
  primary: "app-button",
  secondary: "app-button-secondary",
  danger: "app-button-danger",
  icon: "app-icon-button",
  link: "app-link-button",
  action: "app-action-card",
};

const AppButton = ({ children, className = "", variant = "primary", as: Component = "button", ...props }) => {
  const variantClass = variantClassMap[variant] || variantClassMap.primary;
  const classes = [variantClass, className].filter(Boolean).join(" ");
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default AppButton;