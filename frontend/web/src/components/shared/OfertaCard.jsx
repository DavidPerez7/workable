import React from "react";
import { Link } from "react-router-dom";
import { MapPin, CalendarDays } from "lucide-react";
import AppCard from "./AppCard";
import "./OfertaCard.css";

const formatDate = (value) => {
  if (!value) return "Sin fecha";
  try {
    return new Date(value).toLocaleDateString("es-CO");
  } catch {
    return "Sin fecha";
  }
};

const formatSalary = (value) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
};

const OfertaCard = ({ oferta, rol = "ASPIRANTE", variant = "default" }) => {
  const linkPath = rol === "RECLUTADOR" ? `/Reclutador/oferta/${oferta.id}` : `/Aspirante/oferta/${oferta.id}`;
  
  return (
    <AppCard className="oferta-card">
      <div className="oferta-card-header">
        <h3>{oferta.titulo || "Sin título"}</h3>
        <span className="oferta-card-modalidad">{oferta.modalidad || "Modalidad"}</span>
      </div>
      
      {variant === "detailed" && (
        <p className="oferta-card-descripcion">
          {oferta.descripcion ? oferta.descripcion.substring(0, 120) + "..." : "Sin descripción"}
        </p>
      )}
      
      <div className="oferta-card-meta">
        <span>
          <MapPin size={14} />
          {oferta.municipio?.nombre || "Sin ubicación"}
        </span>
        <span>
          <CalendarDays size={14} />
          {formatDate(oferta.fechaPublicacion)}
        </span>
      </div>
      
      <div className="oferta-card-salary">
        {formatSalary(oferta.salario)}
      </div>
      
      <Link to={linkPath} className="oferta-card-link">
        Ver oferta completa
      </Link>
    </AppCard>
  );
};

export default OfertaCard;
