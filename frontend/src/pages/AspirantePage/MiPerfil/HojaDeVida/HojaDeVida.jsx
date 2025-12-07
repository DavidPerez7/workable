import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HojaDeVida.css";
import Header from "../../../../components/Header/Header";
import Menu from "../../../../components/Menu/Menu";

const HojaDeVida = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para agregar nuevos datos
  const [nuevaHabilidad, setNuevaHabilidad] = useState("");
  const [nuevaExp, setNuevaExp] = useState({
    empresa: "",
    cargo: "",
    fecha: "",
    descripcion: "",
  });

  const navigate = useNavigate();

  // ========= SIMULACIÓN =========
  const mockPerfil = {
    nombre: "Nicolás Zapata",
    tituloProfesional: "Desarrollador Frontend Junior",
    descripcion:
      "Apasionado por la tecnología, el diseño y la creación de interfaces modernas enfocadas en la accesibilidad digital.",
    ciudad: "Medellín, Antioquia",
    edad: 22,
    foto: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
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
    }, 600);
  }, []);

  if (loading) {
    return (
      <div className="perfil-loading">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  /* ============================
        HABILIDADES
  ============================ */

  const agregarHabilidad = () => {
    if (nuevaHabilidad.trim() === "") return;

    setPerfil((prev) => ({
      ...prev,
      habilidades: [...prev.habilidades, nuevaHabilidad],
    }));

    setNuevaHabilidad("");
  };

  const borrarHabilidad = (index) => {
    setPerfil((prev) => ({
      ...prev,
      habilidades: prev.habilidades.filter((_, i) => i !== index),
    }));
  };

  /* ============================
        EXPERIENCIA
  ============================ */

  const agregarExperiencia = () => {
    const { empresa, cargo, fecha, descripcion } = nuevaExp;

    if (!empresa || !cargo || !fecha || !descripcion) return;

    setPerfil((prev) => ({
      ...prev,
      experiencia: [...prev.experiencia, nuevaExp],
    }));

    setNuevaExp({ empresa: "", cargo: "", fecha: "", descripcion: "" });
  };

  const borrarExperiencia = (index) => {
    setPerfil((prev) => ({
      ...prev,
      experiencia: prev.experiencia.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <Header isLoggedIn={true} userRole="ASPIRANTE" />
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
            <p className="perfil-ubicacion-PF">
              {perfil.ciudad} • {perfil.edad} años
            </p>
          </div>

          <button
            className="editar-perfil-btn-PF"
            onClick={() => navigate("/ActualizarPerfil/ActualizarPerfil")}
          >
            Editar perfil
          </button>
        </div>

        {/* DESCRIPCION */}
        <div className="perfil-bloque-PF">
          <h3 className="perfil-bloque-titulo-PF">Sobre mí</h3>
          <p>{perfil.descripcion}</p>
        </div>

        {/* HABILIDADES */}
        <div className="perfil-bloque-PF">
          <div className="perfil-bloque-top-PF">
            <h3 className="perfil-bloque-titulo-PF">Habilidades</h3>

            {/* BOTÓN AÑADIR */}
            <button
              className="perfil-add-btn-PF"
              onClick={() => {
                const form = document.getElementById("add-skill-form");
                form.style.display =
                  form.style.display === "none" ? "flex" : "none";
              }}
            >
              + Añadir habilidad
            </button>
          </div>

          {/* FORMULARIO INLINE */}
          <div
            id="add-skill-form"
            className="perfil-form-inline-PF"
            style={{ display: "none" }}
          >
            <input
              type="text"
              placeholder="Nueva habilidad..."
              value={nuevaHabilidad}
              onChange={(e) => setNuevaHabilidad(e.target.value)}
            />
            <button onClick={agregarHabilidad}>Añadir</button>
          </div>

          {/* LISTA DE HABILIDADES */}
          <div className="perfil-habilidades-PF">
            {perfil.habilidades.map((skill, index) => (
              <span key={index} className="perfil-skill-PF">
                {skill}
                <button
                  className="perfil-skill-delete-PF"
                  onClick={() => borrarHabilidad(index)}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* EXPERIENCIA */}
        <div className="perfil-bloque-PF">
          <div className="perfil-bloque-top-PF">
            <h3 className="perfil-bloque-titulo-PF">Experiencia</h3>

            <button
              className="perfil-add-btn-PF"
              onClick={() => {
                const section = document.getElementById("add-exp-form");
                section.style.display =
                  section.style.display === "none" ? "grid" : "none";
              }}
            >
              + Añadir experiencia
            </button>
          </div>

          {/* FORMULARIO NUEVA EXPERIENCIA */}
          <div
            id="add-exp-form"
            className="perfil-form-exp-PF"
            style={{ display: "none" }}
          >
            <input
              type="text"
              placeholder="Empresa"
              value={nuevaExp.empresa}
              onChange={(e) =>
                setNuevaExp({ ...nuevaExp, empresa: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Cargo"
              value={nuevaExp.cargo}
              onChange={(e) =>
                setNuevaExp({ ...nuevaExp, cargo: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Fecha"
              value={nuevaExp.fecha}
              onChange={(e) =>
                setNuevaExp({ ...nuevaExp, fecha: e.target.value })
              }
            />
            <textarea
              placeholder="Descripción"
              value={nuevaExp.descripcion}
              onChange={(e) =>
                setNuevaExp({ ...nuevaExp, descripcion: e.target.value })
              }
            />
            <button onClick={agregarExperiencia}>Añadir experiencia</button>
          </div>

          {/* LISTA DE EXPERIENCIA */}
          {perfil.experiencia.map((exp, index) => (
            <div key={index} className="perfil-experiencia-card-PF">
              <button
                className="perfil-exp-delete-PF"
                onClick={() => borrarExperiencia(index)}
              >
                Eliminar
              </button>

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
          <p>
            <strong>Email:</strong> {perfil.contacto.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {perfil.contacto.telefono}
          </p>
        </div>
      </div>
    </>
  );
};

export default HojaDeVida;
