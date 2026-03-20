import React from "react";
import "./AppUI.css";

const AppPageShell = ({
  header,
  sidebar = null,
  footer = null,
  children,
  shellClassName = "",
  mainClassName = "",
  orientation = "sidebar",
}) => {
  const shellClasses = ["app-shell", orientation === "stacked" ? "app-shell--stacked" : "", shellClassName]
    .filter(Boolean)
    .join(" ");
  const mainClasses = ["app-main", mainClassName].filter(Boolean).join(" ");

  return (
    <>
      {header}
      <div className={shellClasses}>
        {sidebar}
        <main className={mainClasses}>{children}</main>
      </div>
      {footer}
    </>
  );
};

export default AppPageShell;