import React from "react";
import "./ofertaCard.css";

const OfertaCard = ({ titulo, salario, ubicacion, empresa, modalidad, tipoContrato }) => {
  return (
    <div className="oferta-card">
      <h4>{titulo}</h4>
      <p><strong>Empresa:</strong> {empresa}</p>
      <p><strong>Salario:</strong> ${salario}</p>
      <p><strong>Ubicación:</strong> {ubicacion}</p>
      <p><strong>Modalidad:</strong> {modalidad}</p>
      <p><strong>Contrato:</strong> {tipoContrato}</p>
    </div>
  );
};

export default OfertaCard;
