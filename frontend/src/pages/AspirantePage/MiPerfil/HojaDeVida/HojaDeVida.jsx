import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HojaDeVida.css";
import Header from "../../../../components/Header/Header";
import Menu from "../../../../components/Menu/Menu";
import { getUsuarioActual } from "../../../../api/usuarioAPI";
import { obtenerHabilidadesAspirante, crearHabilidad, eliminarHabilidad } from "../../../../api/habilidadAPI";
import { obtenerExperienciasAspirante, crearExperiencia, eliminarExperiencia } from "../../../../api/experienciaAPI";
import { obtenerEstudiosAspirante, crearEstudio, eliminarEstudio } from "../../../../api/estudioAPI";

const HojaDeVida = () => {
  const [perfil, setPerfil] = useState(null);
  const [editandoDescripcion, setEditandoDescripcion] = useState(false);
  const [descripcionTemporal, setDescripcionTemporal] = useState("");
  const [habilidades, setHabilidades] = useState([]);
  const [experiencias, setExperiencias] = useState([]);
  const [estudios, setEstudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para agregar nuevos datos
  const [nuevaHabilidad, setNuevaHabilidad] = useState("");
  const [nuevaExp, setNuevaExp] = useState({
    empresa: "",
    cargo: "",
    fechaInicio: "",
    descripcion: "",
  });
  const [nuevoEstudio, setNuevoEstudio] = useState({
    institucion: "",
    titulo: "",
    fechaInicio: "",
    estado: "EN_CURSO",
  });

  const navigate = useNavigate();

  // Cargar datos del perfil y sus relacionados
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const rol = localStorage.getItem("rol");

      // Cargar perfil usando el nuevo endpoint /me
      const usuarioData = await getUsuarioActual(rol);
      setPerfil(usuarioData);
      setDescripcionTemporal(usuarioData.descripcion || "");

      // Cargar habilidades
      const habilidadesData = await obtenerHabilidadesAspirante();
      setHabilidades(habilidadesData || []);

      // Cargar experiencias
      const experienciasData = await obtenerExperienciasAspirante();
      setExperiencias(experienciasData || []);

      // Cargar estudios
      const estudiosData = await obtenerEstudiosAspirante();
      setEstudios(estudiosData || []);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="perfil-loading">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="perfil-loading">
        <p>No se pudo cargar el perfil</p>
      </div>
    );
  }

  /* ============================
        DESCRIPCIÓN
  ============================ */

  const guardarDescripcion = async () => {
    try {
      const token = localStorage.getItem("token");
      const rol = localStorage.getItem("rol");
      
      if (rol === "ASPIRANTE") {
        const response = await fetch("http://localhost:8080/api/aspirante/actualizar", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            descripcion: descripcionTemporal,
          }),
        });
        
        if (!response.ok) {
          throw new Error("Error al guardar descripción");
        }
        
        const perfilActualizado = await response.json();
        setPerfil(perfilActualizado);
        setEditandoDescripcion(false);
      }
    } catch (err) {
      console.error("Error al guardar descripción:", err);
      alert("Error al guardar: " + err.message);
    }
  };

  /* ============================
        HABILIDADES
  ============================ */

  const agregarHabilidad = async () => {
    if (nuevaHabilidad.trim() === "") return;

    try {
      const habilidadData = {
        nombre: nuevaHabilidad,
      };
      const nuevaHab = await crearHabilidad(habilidadData);
      setHabilidades([...habilidades, nuevaHab]);
      setNuevaHabilidad("");
    } catch (err) {
      console.error("Error al agregar habilidad:", err);
      alert("Error al agregar habilidad: " + err.message);
    }
  };

  const borrarHabilidad = async (id) => {
    try {
      await eliminarHabilidad(id);
      setHabilidades(habilidades.filter((h) => h.id !== id));
    } catch (err) {
      console.error("Error al eliminar habilidad:", err);
      alert("Error al eliminar habilidad: " + err.message);
    }
  };

  /* ============================
        EXPERIENCIA
  ============================ */

  const agregarExperiencia = async () => {
    const { empresa, cargo, fechaInicio, descripcion } = nuevaExp;

    if (!empresa || !cargo || !fechaInicio || !descripcion) {
      alert("Por favor rellena todos los campos");
      return;
    }

    try {
      const experienciaData = {
        empresa,
        cargo,
        fechaInicio,
        descripcion,
      };
      const nuevaExpData = await crearExperiencia(experienciaData);
      setExperiencias([...experiencias, nuevaExpData]);
      setNuevaExp({ empresa: "", cargo: "", fechaInicio: "", descripcion: "" });
    } catch (err) {
      console.error("Error al agregar experiencia:", err);
      alert("Error al agregar experiencia: " + err.message);
    }
  };

  const borrarExperiencia = async (id) => {
    try {
      await eliminarExperiencia(id);
      setExperiencias(experiencias.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error al eliminar experiencia:", err);
      alert("Error al eliminar experiencia: " + err.message);
    }
  };

  /* ============================
        EDUCACIÓN (ESTUDIOS)
  ============================ */

  const agregarEstudio = async () => {
    const { institucion, titulo, fechaInicio, estado } = nuevoEstudio;

    if (!institucion || !titulo || !fechaInicio) {
      alert("Por favor rellena todos los campos requeridos");
      return;
    }

    try {
      const estudioData = {
        institucion,
        titulo,
        fechaInicio,
        estado,
      };
      const nuevoEstudioData = await crearEstudio(estudioData);
      setEstudios([...estudios, nuevoEstudioData]);
      setNuevoEstudio({ institucion: "", titulo: "", fechaInicio: "", estado: "EN_CURSO" });
      const form = document.getElementById("add-edu-form");
      if (form) form.style.display = "none";
    } catch (err) {
      console.error("Error al agregar estudio:", err);
      alert("Error al agregar estudio: " + err.message);
    }
  };

  return (
    <>
      <Header isLoggedIn={true} userRole="ASPIRANTE" />
      <Menu />

      <div className="perfil-container-PF">
        {/* HEADER */}
        <div className="perfil-header-PF">
          <img
            src={perfil?.urlFotoPerfil || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"}
            alt="Foto de perfil"
            className="perfil-foto-PF"
          />

          <div className="perfil-header-info-PF">
            <h1 className="perfil-nombre-PF">{perfil?.nombre} {perfil?.apellido}</h1>
            <h2 className="perfil-titulo-PF">{perfil?.descripcion || "Sin descripción"}</h2>
            <p className="perfil-ubicacion-PF">
              {perfil?.municipio?.nombre || "Sin ubicación"}
            </p>
          </div>

          <button
            className="editar-perfil-btn-PF"
            onClick={() => navigate("/ActualizarPerfil")}
          >
            Editar perfil
          </button>
        </div>

        {/* DESCRIPCION */}
        <div className="perfil-bloque-PF">
          <div className="perfil-bloque-top-PF">
            <h3 className="perfil-bloque-titulo-PF">Sobre mí</h3>
          </div>
          
          {editandoDescripcion ? (
            <div className="perfil-desc-edit-PF">
              <textarea
                value={descripcionTemporal}
                onChange={(e) => setDescripcionTemporal(e.target.value)}
                placeholder="Escribe tu descripción aquí..."
                className="perfil-desc-textarea-PF"
              />
              <div className="perfil-desc-buttons-PF">
                <button 
                  className="perfil-desc-save-btn-PF"
                  onClick={guardarDescripcion}
                >
                  Guardar
                </button>
                <button 
                  className="perfil-desc-cancel-btn-PF"
                  onClick={() => {
                    setEditandoDescripcion(false);
                    setDescripcionTemporal(perfil?.descripcion || "");
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="perfil-desc-view-PF">
              <p>{perfil?.descripcion || "Sin información"}</p>
              <button 
                className="perfil-desc-edit-btn-PF"
                onClick={() => setEditandoDescripcion(true)}
              >
                Editar descripción
              </button>
            </div>
          )}
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
            {habilidades.length === 0 ? (
              <p>No tienes habilidades registradas</p>
            ) : (
              habilidades.map((skill) => (
                <span key={skill.id} className="perfil-skill-PF">
                  {skill.nombre}
                  <button
                    className="perfil-skill-delete-PF"
                    onClick={() => borrarHabilidad(skill.id)}
                  >
                    ✕
                  </button>
                </span>
              ))
            )}
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
              placeholder="Fecha inicio (ej: 2024-01-15)"
              value={nuevaExp.fechaInicio}
              onChange={(e) =>
                setNuevaExp({ ...nuevaExp, fechaInicio: e.target.value })
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
          {experiencias.length === 0 ? (
            <p>No tienes experiencias registradas</p>
          ) : (
            experiencias.map((exp) => (
              <div key={exp.id} className="perfil-experiencia-card-PF">
                <button
                  className="perfil-exp-delete-PF"
                  onClick={() => borrarExperiencia(exp.id)}
                >
                  Eliminar
                </button>

                <h4>{exp.cargo}</h4>
                <p className="perfil-exp-empresa-PF">{exp.empresa}</p>
                <p className="perfil-exp-fecha-PF">{exp.fechaInicio}</p>
                <p>{exp.descripcion}</p>
              </div>
            ))
          )}
        </div>

        {/* EDUCACIÓN */}
        <div className="perfil-bloque-PF">
          <div className="perfil-bloque-top-PF">
            <h3 className="perfil-bloque-titulo-PF">Educación</h3>

            <button
              className="perfil-add-btn-PF"
              onClick={() => {
                const section = document.getElementById("add-edu-form");
                section.style.display =
                  section.style.display === "none" ? "grid" : "none";
              }}
            >
              + Añadir educación
            </button>
          </div>

          {/* FORMULARIO NUEVA EDUCACIÓN */}
          <div
            id="add-edu-form"
            className="perfil-form-exp-PF"
            style={{ display: "none" }}
          >
            <input
              type="text"
              placeholder="Institución"
              value={nuevoEstudio.institucion}
              onChange={(e) =>
                setNuevoEstudio({ ...nuevoEstudio, institucion: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Título"
              value={nuevoEstudio.titulo}
              onChange={(e) =>
                setNuevoEstudio({ ...nuevoEstudio, titulo: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Fecha inicio (ej: 2023-01-15)"
              value={nuevoEstudio.fechaInicio}
              onChange={(e) =>
                setNuevoEstudio({ ...nuevoEstudio, fechaInicio: e.target.value })
              }
            />
            <select
              value={nuevoEstudio.estado}
              onChange={(e) =>
                setNuevoEstudio({ ...nuevoEstudio, estado: e.target.value })
              }
            >
              <option value="EN_CURSO">En curso</option>
              <option value="COMPLETADO">Completado</option>
              <option value="PAUSADO">Pausado</option>
            </select>
            <button onClick={() => agregarEstudio()}>Añadir educación</button>
          </div>

          {/* LISTA DE EDUCACIÓN */}
          {estudios.length === 0 ? (
            <p>No tienes estudios registrados</p>
          ) : (
            estudios.map((edu) => (
              <div key={edu.id} className="perfil-educ-card-PF">
                <button
                  className="perfil-exp-delete-PF"
                  onClick={() => eliminarEstudio(edu.id)}
                >
                  Eliminar
                </button>
                <h4>{edu.titulo}</h4>
                <p className="perfil-edu-inst-PF">{edu.institucion}</p>
                <p className="perfil-edu-fecha-PF">{edu.fechaInicio}</p>
                <p className="perfil-edu-estado-PF">Estado: {edu.estado}</p>
              </div>
            ))
          )}
        </div>

        {/* CONTACTO */}
        <div className="perfil-bloque-PF">
          <h3 className="perfil-bloque-titulo-PF">Contacto</h3>
          <p>
            <strong>Email:</strong> {perfil?.correo || "Sin email"}
          </p>
          <p>
            <strong>Teléfono:</strong> {perfil?.telefono || "Sin teléfono"}
          </p>
        </div>
      </div>
    </>
  );
};

export default HojaDeVida;
