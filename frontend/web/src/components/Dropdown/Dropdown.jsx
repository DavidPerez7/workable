import { useState } from "react";
import "./Dropdown.css";

export default function Dropdown({ label, options }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="dropdown">
      <button className="dropdown-btn" onClick={() => setOpen(!open)}>
        {label} <svg
          style={{ marginLeft: 6, verticalAlign: 'middle' }}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          >
          <path d="M4 6L8 10L12 6" stroke="#3A4856" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
      </button>

      {open && (
        <div className="dropdown-content">
          <div className="dropdown-header">
            <span>{label}</span>
            <button className="close-btn" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
          <ul>
            {options.map((opt, idx) => (
              <li key={idx}>{opt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
