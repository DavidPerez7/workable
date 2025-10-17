import React from "react";
import "./ofertaCard.css";

const OfertaCard = ({ titulo, descripcion, salario, ubicacion }) => {
  return (
    <div className="oferta-card">
      <h4>{titulo}</h4>
      <p>{descripcion}</p>
      <p><strong>Salario:</strong> ${salario}</p>
      <p><strong>Ubicación:</strong> {ubicacion}</p>
    </div>
  );
};

export default OfertaCard;
