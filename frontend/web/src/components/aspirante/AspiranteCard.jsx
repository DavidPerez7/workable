import React from "react";
import "./AspirantePrimitives.css";

const AspiranteCard = ({ children, className = "", as: Component = "section" }) => {
  const classes = className ? `asp-card ${className}` : "asp-card";
  return <Component className={classes}>{children}</Component>;
};

export default AspiranteCard;
