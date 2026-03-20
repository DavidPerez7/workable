import React from "react";
import "./AppUI.css";

const AppCard = ({ children, className = "", as: Component = "section", ...props }) => {
  const classes = ["app-card", className].filter(Boolean).join(" ");
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default AppCard;