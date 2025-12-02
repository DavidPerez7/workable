import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VerPerfil.css";
import HeaderAspirant from "../../../../components/HeaderAspirant/HeaderAspirant";
import Menu from "../../../../components/Menu/Menu"

const VerPerfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ========= SIMULACIÓN =========
  const mockPerfil = {
    nombre: "Nicolás Zapata",
    tituloProfesional: "Desarrollador Frontend Junior",
    descripcion:
      "Apasionado por la tecnología, el diseño y la creación de interfaces modernas enfocadas en la accesibilidad digital.",
    ciudad: "Medellín, Antioquia",
    edad: 22,
    foto:
      "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
    habilidades: [
      "JavaScript",
      "React",
      "Node.js",
      "HTML5",
      "CSS3",
      "Git / GitHub",
      "SQL",
    ],
    experiencia: [
      {
        empresa: "Codexia Tech Labs",
        cargo: "Desarrollador Frontend (Prácticas)",
        fecha: "2024",
        descripcion: "Implementación de interfaces y consumo de APIs REST.",
      },
    ],
    educacion: [
      {
        institucion: "SENA",
        titulo: "Análisis y Desarrollo de Software",
        fecha: "2023 - En curso",
      },
    ],
    contacto: {
      email: "nicolasdev@correo.com",
      telefono: "+57 300 000 0000",
    },
    verificado: true,
  };

  useEffect(() => {
    setTimeout(() => {
      setPerfil(mockPerfil);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="perfil-loading">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <>
    <HeaderAspirant />
    <Menu />
    <div className="perfil-container-PF">

      {/* HEADER */}
      <div className="perfil-header-PF">
        <img
          src={perfil.foto}
          alt="Foto de perfil"
          className="perfil-foto-PF"
        />

        <div className="perfil-header-info-PF">
          <h1 className="perfil-nombre-PF">{perfil.nombre}</h1>
          <h2 className="perfil-titulo-PF">{perfil.tituloProfesional}</h2>
          <p className="perfil-ubicacion-PF">{perfil.ciudad} • {perfil.edad} años</p>

          {perfil.verificado && (
            <span className="perfil-verificado-PF">✔ Perfil verificado</span>
          )}
        </div>

        {/* ======= BOTÓN NUEVO ======= */}
        <button
          className="editar-perfil-btn-PF"
          onClick={() => navigate("/ActualizarPerfil/ActualizarPerfil")}
        >
          Editar perfil
        </button>

      </div>

      {/* DESCRIPCIÓN */}
      <div className="perfil-bloque-PF">
        <h3 className="perfil-bloque-titulo-PF">Sobre mí</h3>
        <p className="perfil-descripcion-PF">{perfil.descripcion}</p>
      </div>

      {/* HABILIDADES */}
      <div className="perfil-bloque-PF">
        <h3 className="perfil-bloque-titulo-PF">Habilidades</h3>
        <div className="perfil-habilidades-PF">
          {perfil.habilidades.map((skill, index) => (
            <span key={index} className="perfil-skill-PF">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* EXPERIENCIA */}
      <div className="perfil-bloque-PF">
        <h3 className="perfil-bloque-titulo-PF">Experiencia</h3>
        {perfil.experiencia.map((exp, index) => (
          <div key={index} className="perfil-experiencia-card-PF">
            <h4>{exp.cargo}</h4>
            <p className="perfil-exp-empresa-PF">{exp.empresa}</p>
            <p className="perfil-exp-fecha-PF">{exp.fecha}</p>
            <p>{exp.descripcion}</p>
          </div>
        ))}
      </div>

      {/* EDUCACIÓN */}
      <div className="perfil-bloque-PF">
        <h3 className="perfil-bloque-titulo-PF">Educación</h3>
        {perfil.educacion.map((edu, index) => (
          <div key={index} className="perfil-educ-card-PF">
            <h4>{edu.titulo}</h4>
            <p className="perfil-edu-inst-PF">{edu.institucion}</p>
            <p className="perfil-edu-fecha-PF">{edu.fecha}</p>
          </div>
        ))}
      </div>

      {/* CONTACTO */}
      <div className="perfil-bloque-PF">
        <h3 className="perfil-bloque-titulo-PF">Contacto</h3>
        <p><strong>Email:</strong> {perfil.contacto.email}</p>
        <p><strong>Teléfono:</strong> {perfil.contacto.telefono}</p>
      </div>

    </div>
    </>
  );
};

export default VerPerfil;
