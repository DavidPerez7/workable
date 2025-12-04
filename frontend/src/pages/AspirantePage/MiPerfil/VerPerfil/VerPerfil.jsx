import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VerPerfil.css";
import HeaderAspirant from "../../../../components/HeaderAspirant/HeaderAspirant";
import Menu from "../../../../components/Menu/Menu";
import { getUsuario, actualizarUsuario } from "../../../../api/usuarioAPI";
import { getExperienciasPorUsuario, crearExperiencia, eliminarExperiencia } from "../../../../api/experienciaAPI";
import { getEstudiosPorUsuario, crearEstudio, eliminarEstudio } from "../../../../api/estudioAPI";

const VerPerfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [experiencias, setExperiencias] = useState([]);
  const [estudios, setEstudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editandoDescripcion, setEditandoDescripcion] = useState(false);

  // Estados para agregar nuevos datos
  const [nuevaExp, setNuevaExp] = useState({
    empresa: "",
    cargo: "",
    fechaInicio: "",
    fechaFin: "",
    descripcion: "",
    estado: "ACTIVO"
  });

  const [nuevoEstudio, setNuevoEstudio] = useState({
    institucion: "",
    titulo: "",
    nivelEducativo: "UNIVERSITARIO",
    fechaInicio: "",
    fechaFin: "",
    modalidad: "PRESENCIAL",
    estadoEstudio: "ACTIVO"
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Cargar datos del perfil
  const cargarPerfil = async () => {
    try {
      const [usuarioData, experienciasData, estudiosData] = await Promise.all([
        getUsuario(userId),
        getExperienciasPorUsuario(userId),
        getEstudiosPorUsuario(userId)
      ]);

      setUsuario(usuarioData);
      setExperiencias(experienciasData);
      setEstudios(estudiosData);
      setDescripcion(usuarioData.descripcion || "Aspirante registrado en Workable buscando oportunidades laborales");
      setLoading(false);
    } catch (err) {
      console.error("Error cargando perfil:", err);
      setError("No se pudo cargar tu hoja de vida");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/Login");
      return;
    }
    cargarPerfil();
  }, [userId]);

  if (loading) {
    return (
      <div className="perfil-loading">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="perfil-loading">
        <p>{error}</p>
        <button onClick={cargarPerfil}>Reintentar</button>
      </div>
    );
  }

  /* ============================
        DESCRIPCIÓN
  ============================ */

  const guardarDescripcion = async () => {
    try {
      // El backend ahora soporta actualización parcial: solo enviamos lo que cambia
      const updateData = {
        descripcion: descripcion
      };

      await actualizarUsuario(userId, updateData);
      setUsuario({ ...usuario, descripcion: descripcion });
      setEditandoDescripcion(false);
      alert("Descripción actualizada correctamente");
    } catch (err) {
      console.error("Error actualizando descripción:", err);
      alert("No se pudo actualizar la descripción");
    }
  };

  const cancelarEdicion = () => {
    setDescripcion(usuario.descripcion || "Aspirante registrado en Workable buscando oportunidades laborales");
    setEditandoDescripcion(false);
  };

  /* ============================
        EXPERIENCIA
  ============================ */

  const agregarExperiencia = async () => {
    const { empresa, cargo, fechaInicio, fechaFin, descripcion } = nuevaExp;

    if (!empresa || !cargo || !fechaInicio || !descripcion) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    // Validar fechas
    if (fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
      alert("La fecha de fin debe ser posterior a la fecha de inicio");
      return;
    }

    try {
      // Incluir el municipio del usuario
      const experienciaConMunicipio = {
        ...nuevaExp,
        municipio: { id: usuario.municipio.id }
      };

      const nuevaExperiencia = await crearExperiencia(experienciaConMunicipio, userId);
      setExperiencias([...experiencias, nuevaExperiencia]);
      setNuevaExp({ 
        empresa: "", 
        cargo: "", 
        fechaInicio: "", 
        fechaFin: "", 
        descripcion: "",
        estado: "ACTIVO"
      });
      document.getElementById("add-exp-form").style.display = "none";
    } catch (err) {
      console.error("Error agregando experiencia:", err);
      alert("No se pudo agregar la experiencia");
    }
  };

  const borrarExperiencia = async (id, index) => {
    if (!window.confirm("¿Estás seguro de eliminar esta experiencia?")) return;

    try {
      await eliminarExperiencia(id, userId);
      setExperiencias(experiencias.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error eliminando experiencia:", err);
      alert("No se pudo eliminar la experiencia");
    }
  };

  /* ============================
        ESTUDIOS
  ============================ */

  const agregarEstudio = async () => {
    const { institucion, titulo, nivelEducativo, fechaInicio, fechaFin } = nuevoEstudio;

    if (!institucion || !titulo || !nivelEducativo || !fechaInicio) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    // Validar fechas
    if (fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
      alert("La fecha de fin debe ser posterior a la fecha de inicio");
      return;
    }

    try {
      // Incluir el municipio del usuario y determinar si está en curso
      const estudioConMunicipio = {
        ...nuevoEstudio,
        municipio: { id: usuario.municipio.id },
        enCurso: !fechaFin || fechaFin === "" // Si no hay fecha fin, está en curso
      };

      const nuevoEstudioCreado = await crearEstudio(estudioConMunicipio, userId);
      setEstudios([...estudios, nuevoEstudioCreado]);
      setNuevoEstudio({
        institucion: "",
        titulo: "",
        nivelEducativo: "UNIVERSITARIO",
        fechaInicio: "",
        fechaFin: "",
        modalidad: "PRESENCIAL",
        estadoEstudio: "ACTIVO"
      });
      document.getElementById("add-edu-form").style.display = "none";
    } catch (err) {
      console.error("Error agregando estudio:", err);
      alert("No se pudo agregar el estudio");
    }
  };

  const borrarEstudio = async (id, index) => {
    if (!window.confirm("¿Estás seguro de eliminar este estudio?")) return;

    try {
      await eliminarEstudio(id, userId);
      setEstudios(estudios.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error eliminando estudio:", err);
      alert("No se pudo eliminar el estudio");
    }
  };

  return (
    <>
      <HeaderAspirant />
      <Menu />

      <div className="perfil-container-PF">
        {/* HEADER */}
        <div className="perfil-header-PF">
          <img
            src={usuario?.urlFotoPerfil || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"}
            alt="Foto de perfil"
            className="perfil-foto-PF"
          />

          <div className="perfil-header-info-PF">
            <h1 className="perfil-nombre-PF">
              {usuario?.nombre} {usuario?.apellido}
            </h1>
            <h2 className="perfil-titulo-PF">Aspirante</h2>
            <p className="perfil-ubicacion-PF">
              {usuario?.municipio?.nombre || "No especificado"}
              {usuario?.fechaNacimiento && ` • ${calcularEdad(usuario.fechaNacimiento)} años`}
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
          <div className="perfil-bloque-top-PF">
            <h3 className="perfil-bloque-titulo-PF">Sobre mí</h3>
            {!editandoDescripcion && (
              <button
                className="perfil-add-btn-PF"
                onClick={() => setEditandoDescripcion(true)}
              >
                ✏️ Editar
              </button>
            )}
          </div>

          {editandoDescripcion ? (
            <div className="perfil-form-inline-PF" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Escribe una breve descripción sobre ti..."
                rows="4"
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  borderRadius: "5px", 
                  border: "1px solid #ddd",
                  fontFamily: "inherit",
                  fontSize: "14px"
                }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={guardarDescripcion} style={{ flex: 1 }}>
                  Guardar
                </button>
                <button onClick={cancelarEdicion} style={{ flex: 1, background: "#6c757d" }}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p>{descripcion}</p>
          )}
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
              placeholder="Empresa *"
              value={nuevaExp.empresa}
              onChange={(e) =>
                setNuevaExp({ ...nuevaExp, empresa: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Cargo *"
              value={nuevaExp.cargo}
              onChange={(e) =>
                setNuevaExp({ ...nuevaExp, cargo: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="Fecha Inicio *"
              value={nuevaExp.fechaInicio}
              onChange={(e) =>
                setNuevaExp({ ...nuevaExp, fechaInicio: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="Fecha Fin (opcional)"
              value={nuevaExp.fechaFin}
              onChange={(e) =>
                setNuevaExp({ ...nuevaExp, fechaFin: e.target.value })
              }
            />
            <textarea
              placeholder="Descripción *"
              value={nuevaExp.descripcion}
              onChange={(e) =>
                setNuevaExp({ ...nuevaExp, descripcion: e.target.value })
              }
            />
            <button onClick={agregarExperiencia}>Añadir experiencia</button>
          </div>

          {/* LISTA DE EXPERIENCIA */}
          {experiencias.length === 0 ? (
            <p>No has agregado experiencia laboral aún</p>
          ) : (
            experiencias.map((exp, index) => (
              <div key={exp.id} className="perfil-experiencia-card-PF">
                <button
                  className="perfil-exp-delete-PF"
                  onClick={() => borrarExperiencia(exp.id, index)}
                >
                  Eliminar
                </button>

                <h4>{exp.cargo}</h4>
                <p className="perfil-exp-empresa-PF">{exp.empresa}</p>
                <p className="perfil-exp-fecha-PF">
                  {new Date(exp.fechaInicio).toLocaleDateString("es-CO")} 
                  {exp.fechaFin ? ` - ${new Date(exp.fechaFin).toLocaleDateString("es-CO")}` : " - Actualidad"}
                </p>
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
              placeholder="Institución *"
              value={nuevoEstudio.institucion}
              onChange={(e) =>
                setNuevoEstudio({ ...nuevoEstudio, institucion: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Título *"
              value={nuevoEstudio.titulo}
              onChange={(e) =>
                setNuevoEstudio({ ...nuevoEstudio, titulo: e.target.value })
              }
            />
            <select
              value={nuevoEstudio.nivelEducativo}
              onChange={(e) =>
                setNuevoEstudio({ ...nuevoEstudio, nivelEducativo: e.target.value })
              }
            >
              <option value="PRIMARIA">Primaria</option>
              <option value="BACHILLERATO">Bachillerato</option>
              <option value="TECNICO">Técnico</option>
              <option value="TECNOLOGO">Tecnólogo</option>
              <option value="UNIVERSITARIO">Universitario</option>
              <option value="ESPECIALIZACION">Especialización</option>
              <option value="MAESTRIA">Maestría</option>
              <option value="DOCTORADO">Doctorado</option>
            </select>
            <input
              type="date"
              placeholder="Fecha Inicio *"
              value={nuevoEstudio.fechaInicio}
              onChange={(e) =>
                setNuevoEstudio({ ...nuevoEstudio, fechaInicio: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="Fecha Fin (opcional)"
              value={nuevoEstudio.fechaFin}
              onChange={(e) =>
                setNuevoEstudio({ ...nuevoEstudio, fechaFin: e.target.value })
              }
            />
            <select
              value={nuevoEstudio.modalidad}
              onChange={(e) =>
                setNuevoEstudio({ ...nuevoEstudio, modalidad: e.target.value })
              }
            >
              <option value="PRESENCIAL">Presencial</option>
              <option value="VIRTUAL">Virtual</option>
              <option value="HIBRIDA">Híbrida</option>
            </select>
            <button onClick={agregarEstudio}>Añadir educación</button>
          </div>

          {/* LISTA DE EDUCACIÓN */}
          {estudios.length === 0 ? (
            <p>No has agregado formación académica aún</p>
          ) : (
            estudios.map((edu, index) => (
              <div key={edu.id} className="perfil-educ-card-PF">
                <button
                  className="perfil-exp-delete-PF"
                  onClick={() => borrarEstudio(edu.id, index)}
                >
                  Eliminar
                </button>

                <h4>{edu.titulo}</h4>
                <p className="perfil-edu-inst-PF">{edu.institucion}</p>
                <p className="perfil-edu-fecha-PF">
                  {edu.nivelEducativo} • {edu.modalidad}
                </p>
                <p className="perfil-edu-fecha-PF">
                  {new Date(edu.fechaInicio).toLocaleDateString("es-CO")}
                  {edu.fechaFin ? ` - ${new Date(edu.fechaFin).toLocaleDateString("es-CO")}` : " - En curso"}
                </p>
              </div>
            ))
          )}
        </div>

        {/* CONTACTO */}
        <div className="perfil-bloque-PF">
          <h3 className="perfil-bloque-titulo-PF">Contacto</h3>
          <p>
            <strong>Email:</strong> {usuario?.correo || "No especificado"}
          </p>
          <p>
            <strong>Teléfono:</strong> {usuario?.telefono || "No especificado"}
          </p>
        </div>
      </div>
    </>
  );
};

// Función auxiliar para calcular edad
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

export default VerPerfil;
