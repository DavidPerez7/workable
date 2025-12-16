import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HojaDeVida.css";
import { jsPDF } from "jspdf";
import Header from "../../../../components/Header/Header";
import Menu from "../../../../components/Menu/Menu";
import aspirantesApi from "../../../../api/aspirantesApi";
import { getHojasDeVidaPorAspirante, actualizarHojaDeVida } from "../../../../api/hojaDeVidaAPI";

const HojaDeVida = () => {
  const [perfil, setPerfil] = useState(null);
  const [hojaDeVida, setHojaDeVida] = useState(null);
  const [editandoDescripcion, setEditandoDescripcion] = useState(false);
  const [descripcionTemporal, setDescripcionTemporal] = useState("");
  const [experiencias, setExperiencias] = useState([]);
  const [estudios, setEstudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para edición inline
  const [editandoExpIndex, setEditandoExpIndex] = useState(null);
  const [expEditTemp, setExpEditTemp] = useState(null);
  const [editandoEduIndex, setEditandoEduIndex] = useState(null);
  const [eduEditTemp, setEduEditTemp] = useState(null);
  const [guardandoExp, setGuardandoExp] = useState(false);
  const [guardandoEdu, setGuardandoEdu] = useState(false);

  // Estados para agregar nuevos datos
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
    fechaFin: "",
    nivelEducativo: "UNIVERSITARIO",
    enCurso: true,
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
      const usuarioId = localStorage.getItem("usuarioId");
      if (!usuarioId) {
        throw new Error("No se encontró ID de usuario en sesión");
      }

      // Cargar perfil usando aspirantesApi
      const usuarioData = await aspirantesApi.get(usuarioId);
      setPerfil(usuarioData);
      setDescripcionTemporal(usuarioData.descripcion || "");

      // Cargar HojaDeVida con estudios y experiencias embebidas
      const hojasData = await getHojasDeVidaPorAspirante(usuarioId);
      console.log("🎓 HojaDeVida completa recibida:", hojasData);
      console.log("🔍 Tipo de hojasData:", typeof hojasData, "Es array?", Array.isArray(hojasData));
      
      // Verificar si es un objeto directo o un array
      let hoja = null;
      if (Array.isArray(hojasData) && hojasData.length > 0) {
        hoja = hojasData[0];
      } else if (hojasData && typeof hojasData === 'object' && hojasData.id) {
        // Es un objeto directo, no un array
        hoja = hojasData;
      }
      
      if (hoja) {
        console.log("✅ HojaDeVida encontrada - ID:", hoja.id);
        console.log("📚 Estudios recibidos:", hoja.estudios);
        console.log("📊 Experiencias recibidas:", hoja.experiencias);
        console.log("🔢 Cantidad estudios:", hoja.estudios?.length || 0);
        console.log("🔢 Cantidad experiencias:", hoja.experiencias?.length || 0);
        
        setHojaDeVida(hoja);
        setExperiencias(hoja.experiencias || []);
        setEstudios(hoja.estudios || []);
      } else {
        console.warn("⚠️ No se encontró HojaDeVida para el aspirante");
        setExperiencias([]);
        setEstudios([]);
      }
    } catch (err) {
      console.error("❌ Error al cargar datos:", err);
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
      const usuarioId = localStorage.getItem("usuarioId");
      
      if (!usuarioId) {
        throw new Error("No se encontró ID de usuario en sesión");
      }
      
      const response = await fetch(`http://localhost:8080/api/aspirante/${usuarioId}`, {
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
    } catch (err) {
      console.error("Error al guardar descripción:", err);
      alert("Error al guardar: " + err.message);
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
      if (!hojaDeVida) {
        throw new Error("No se encontró la HojaDeVida");
      }

      // Crear nueva experiencia
      const experienciaData = {
        empresa,
        cargo,
        fechaInicio,
        descripcion,
      };

      // Agregar a la lista de experiencias
      const experienciasActualizadas = [...(hojaDeVida.experiencias || []), experienciaData];
      
      // Actualizar la HojaDeVida completa
      const hojaActualizada = {
        ...hojaDeVida,
        experiencias: experienciasActualizadas,
      };

      await actualizarHojaDeVida(hojaDeVida.id, hojaActualizada);
      setHojaDeVida(hojaActualizada);
      setExperiencias(experienciasActualizadas);
      setNuevaExp({ empresa: "", cargo: "", fechaInicio: "", descripcion: "" });
      
      // Ocultar formulario
      const form = document.getElementById("add-exp-form");
      if (form) form.style.display = "none";
    } catch (err) {
      console.error("Error al agregar experiencia:", err);
      alert("Error al agregar experiencia: " + err.message);
    }
  };

  const borrarExperiencia = async (index) => {
    try {
      if (!hojaDeVida) {
        throw new Error("No se encontró la HojaDeVida");
      }

      // Eliminar por índice
      const experienciasActualizadas = hojaDeVida.experiencias.filter((_, i) => i !== index);
      
      // Actualizar la HojaDeVida completa
      const hojaActualizada = {
        ...hojaDeVida,
        experiencias: experienciasActualizadas,
      };

      await actualizarHojaDeVida(hojaDeVida.id, hojaActualizada);
      setHojaDeVida(hojaActualizada);
      setExperiencias(experienciasActualizadas);
    } catch (err) {
      console.error("Error al eliminar experiencia:", err);
      alert("Error al eliminar experiencia: " + err.message);
    }
  };

  /* ============================
        EDICIÓN INLINE EXPERIENCIAS
  ============================ */

  const iniciarEditExp = (index) => {
    setEditandoExpIndex(index);
    setExpEditTemp({ ...experiencias[index] });
  };

  const cancelarEditExp = () => {
    setEditandoExpIndex(null);
    setExpEditTemp(null);
  };

  const guardarEditExp = async () => {
    if (!expEditTemp || editandoExpIndex === null) return;
    
    try {
      setGuardandoExp(true);
      if (!hojaDeVida) {
        throw new Error("No se encontró la HojaDeVida");
      }

      const experienciasActualizadas = [...hojaDeVida.experiencias];
      experienciasActualizadas[editandoExpIndex] = expEditTemp;

      const hojaActualizada = {
        ...hojaDeVida,
        experiencias: experienciasActualizadas,
      };

      await actualizarHojaDeVida(hojaDeVida.id, hojaActualizada);
      setHojaDeVida(hojaActualizada);
      setExperiencias(experienciasActualizadas);
      setEditandoExpIndex(null);
      setExpEditTemp(null);
    } catch (err) {
      console.error("Error al guardar experiencia:", err);
      alert("Error al guardar: " + err.message);
    } finally {
      setGuardandoExp(false);
    }
  };

  /* ============================
        EDUCACIÓN (ESTUDIOS)
  ============================ */

  const agregarEstudio = async () => {
    const { institucion, titulo, fechaInicio, nivelEducativo, enCurso } = nuevoEstudio;

    if (!institucion || !titulo || !fechaInicio || !nivelEducativo) {
      alert("Por favor rellena todos los campos requeridos");
      return;
    }
    if (!enCurso && !nuevoEstudio.fechaFin) {
      alert("Si el estudio está finalizado, debes ingresar la fecha de fin.");
      return;
    }

    try {
      if (!hojaDeVida) {
        throw new Error("No se encontró la HojaDeVida");
      }

      const estudioData = {
        institucion,
        titulo,
        fechaInicio,
        nivelEducativo,
        enCurso,
      };
      // Solo enviar fechaFin si enCurso es false y hay valor
      if (!enCurso && nuevoEstudio.fechaFin) {
        estudioData.fechaFin = nuevoEstudio.fechaFin;
      }

      // Agregar a la lista de estudios
      const estudiosActualizados = [...(hojaDeVida.estudios || []), estudioData];
      
      // Actualizar la HojaDeVida completa
      const hojaActualizada = {
        ...hojaDeVida,
        estudios: estudiosActualizados,
      };

      await actualizarHojaDeVida(hojaDeVida.id, hojaActualizada);
      setHojaDeVida(hojaActualizada);
      setEstudios(estudiosActualizados);
      setNuevoEstudio({ institucion: "", titulo: "", fechaInicio: "", fechaFin: "", nivelEducativo: "UNIVERSITARIO", enCurso: true });
      const form = document.getElementById("add-edu-form");
      if (form) form.style.display = "none";
    } catch (err) {
      console.error("Error al agregar estudio:", err);
      alert("Error al agregar estudio: " + err.message);
    }
  };

  const borrarEstudio = async (index) => {
    try {
      if (!hojaDeVida) {
        throw new Error("No se encontró la HojaDeVida");
      }

      // Eliminar por índice
      const estudiosActualizados = hojaDeVida.estudios.filter((_, i) => i !== index);
      
      // Actualizar la HojaDeVida completa
      const hojaActualizada = {
        ...hojaDeVida,
        estudios: estudiosActualizados,
      };

      await actualizarHojaDeVida(hojaDeVida.id, hojaActualizada);
      setHojaDeVida(hojaActualizada);
      setEstudios(estudiosActualizados);
    } catch (err) {
      console.error("Error al eliminar estudio:", err);
      alert("Error al eliminar estudio: " + err.message);
    }
  };

  /* ============================
        EDICIÓN INLINE ESTUDIOS
  ============================ */

  const iniciarEditEdu = (index) => {
    setEditandoEduIndex(index);
    setEduEditTemp({ ...estudios[index] });
  };

  const cancelarEditEdu = () => {
    setEditandoEduIndex(null);
    setEduEditTemp(null);
  };

  const guardarEditEdu = async () => {
    if (!eduEditTemp || editandoEduIndex === null) return;
    
    try {
      setGuardandoEdu(true);
      if (!hojaDeVida) {
        throw new Error("No se encontró la HojaDeVida");
      }

      const estudiosActualizados = [...hojaDeVida.estudios];
      estudiosActualizados[editandoEduIndex] = eduEditTemp;

      const hojaActualizada = {
        ...hojaDeVida,
        estudios: estudiosActualizados,
      };

      await actualizarHojaDeVida(hojaDeVida.id, hojaActualizada);
      setHojaDeVida(hojaActualizada);
      setEstudios(estudiosActualizados);
      setEditandoEduIndex(null);
      setEduEditTemp(null);
    } catch (err) {
      console.error("Error al guardar estudio:", err);
      alert("Error al guardar: " + err.message);
    } finally {
      setGuardandoEdu(false);
    }
  };

  // ============================
  // DESCARGAR PDF
  // ============================
  const descargarPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 15;
      const margin = 15;
      const maxWidth = pageWidth - 2 * margin;
      const lineHeight = 5;

      // Colores profesionales
      const colorPrincipal = [15, 23, 42]; // Navy
      const colorSecundario = [59, 130, 246]; // Blue
      const colorTexto = [30, 41, 59]; // Slate
      const colorSubtexto = [100, 116, 139]; // Gris

      // Título principal - Nombre
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(...colorPrincipal);
      doc.text(`${perfil?.nombre || "Nombre"} ${perfil?.apellido || "Apellido"}`, margin, yPosition);
      yPosition += 10;

      // Profesión / Descripción
      if (perfil?.descripcion) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(12);
        doc.setTextColor(...colorSecundario);
        doc.text(perfil.descripcion, margin, yPosition);
        yPosition += 8;
      }

      // Ubicación
      if (perfil?.municipio?.nombre) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...colorSubtexto);
        doc.text(`📍 ${perfil.municipio.nombre}`, margin, yPosition);
        yPosition += 6;
      }

      // Línea separadora
      doc.setDrawColor(...colorSecundario);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;

      // INFORMACIÓN DE CONTACTO
      if (hojaDeVida?.contactoEmail || hojaDeVida?.telefono || hojaDeVida?.redSocial1) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...colorPrincipal);
        doc.text("INFORMACIÓN DE CONTACTO", margin, yPosition);
        yPosition += 6;

        if (hojaDeVida?.contactoEmail) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(...colorTexto);
          doc.text(`Email: ${hojaDeVida.contactoEmail}`, margin + 3, yPosition);
          yPosition += 5;
        }

        if (hojaDeVida?.telefono) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(...colorTexto);
          doc.text(`Teléfono: ${hojaDeVida.telefono}`, margin + 3, yPosition);
          yPosition += 5;
        }

        if (hojaDeVida?.redSocial1) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(...colorTexto);
          doc.text(`Red Social: ${hojaDeVida.redSocial1}`, margin + 3, yPosition);
          yPosition += 6;
        }

        // Línea separadora
        doc.setDrawColor(...colorSecundario);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;
      }

      // RESUMEN PROFESIONAL
      if (hojaDeVida?.resumenProfesional) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...colorPrincipal);
        doc.text("RESUMEN PROFESIONAL", margin, yPosition);
        yPosition += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...colorTexto);
        const resumenLines = doc.splitTextToSize(hojaDeVida.resumenProfesional, maxWidth - 6);
        doc.text(resumenLines, margin + 3, yPosition);
        yPosition += resumenLines.length * lineHeight + 3;

        // Línea separadora
        doc.setDrawColor(...colorSecundario);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;
      }

      // EXPERIENCIA
      if (experiencias && experiencias.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...colorPrincipal);
        doc.text("EXPERIENCIA LABORAL", margin, yPosition);
        yPosition += 6;

        experiencias.forEach((exp, index) => {
          // Verificar si necesitamos nueva página
          if (yPosition > pageHeight - 20) {
            doc.addPage();
            yPosition = 15;
          }

          // Cargo y empresa
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(...colorSecundario);
          doc.text(`${exp.cargo || "Cargo"}`, margin + 3, yPosition);
          yPosition += 5;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(...colorTexto);
          doc.text(`${exp.empresa || "Empresa"} | ${exp.fechaInicio || "Fecha"} ${exp.fechaFin ? `- ${exp.fechaFin}` : "- Presente"}`, margin + 3, yPosition);
          yPosition += 4;

          if (exp.descripcion) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(...colorSubtexto);
            const descLines = doc.splitTextToSize(exp.descripcion, maxWidth - 6);
            doc.text(descLines, margin + 3, yPosition);
            yPosition += descLines.length * 4 + 2;
          }

          yPosition += 2;
        });

        // Línea separadora
        if (yPosition <= pageHeight - 20) {
          doc.setDrawColor(...colorSecundario);
          doc.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 8;
        }
      }

      // EDUCACIÓN
      if (estudios && estudios.length > 0) {
        // Nueva página si es necesario
        if (yPosition > pageHeight - 25) {
          doc.addPage();
          yPosition = 15;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...colorPrincipal);
        doc.text("EDUCACIÓN", margin, yPosition);
        yPosition += 6;

        estudios.forEach((edu, index) => {
          // Verificar si necesitamos nueva página
          if (yPosition > pageHeight - 20) {
            doc.addPage();
            yPosition = 15;
          }

          // Título y nivel
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(...colorSecundario);
          doc.text(`${edu.titulo || "Título"}`, margin + 3, yPosition);
          yPosition += 5;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(...colorTexto);
          doc.text(`${edu.institucion || "Institución"} | ${edu.nivelEducativo || "Nivel"}`, margin + 3, yPosition);
          yPosition += 4;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(...colorSubtexto);
          const periodo = edu.enCurso ? `${edu.fechaInicio || "Inicio"} - En curso` : `${edu.fechaInicio || "Inicio"} - ${edu.fechaFin || "Fin"}`;
          doc.text(periodo, margin + 3, yPosition);
          yPosition += 5;

          if (edu.descripcion) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(...colorSubtexto);
            const descLines = doc.splitTextToSize(edu.descripcion, maxWidth - 6);
            doc.text(descLines, margin + 3, yPosition);
            yPosition += descLines.length * 4 + 2;
          }

          yPosition += 2;
        });

        // Línea separadora
        if (yPosition <= pageHeight - 20) {
          doc.setDrawColor(...colorSecundario);
          doc.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 8;
        }
      }

      // IDIOMAS
      if (hojaDeVida?.idiomas) {
        // Nueva página si es necesario
        if (yPosition > pageHeight - 15) {
          doc.addPage();
          yPosition = 15;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...colorPrincipal);
        doc.text("IDIOMAS", margin, yPosition);
        yPosition += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...colorTexto);
        const idiomasLines = doc.splitTextToSize(hojaDeVida.idiomas, maxWidth - 6);
        doc.text(idiomasLines, margin + 3, yPosition);
        yPosition += idiomasLines.length * lineHeight + 3;
      }

      // PIE DE PÁGINA - Fecha de generación
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generado: ${new Date().toLocaleDateString('es-CO')} | Hoja de Vida - Workable`, margin, pageHeight - 5);

      // Descargar PDF
      const nombreArchivo = `HojaDeVida_${perfil?.nombre}_${perfil?.apellido}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(nombreArchivo);
    } catch (err) {
      console.error("Error al generar PDF:", err);
      alert("Error al descargar: " + err.message);
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
            onClick={() => navigate("/Aspirante/MiPerfil")}
          >
            Editar perfil
          </button>

          <button
            className="descargar-pdf-btn-PF"
            onClick={descargarPDF}
            title="Descargar Hoja de Vida en PDF"
          >
            📥 Descargar PDF
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
            experiencias.map((exp, index) => (
              editandoExpIndex === index && expEditTemp ? (
                // MODO EDICIÓN INLINE
                <div key={index} className="perfil-experiencia-card-PF perfil-card-editing-PF">
                  <div className="perfil-edit-actions-top-PF">
                    <button
                      className="perfil-exp-delete-PF"
                      onClick={() => borrarExperiencia(index)}
                    >
                      Eliminar
                    </button>
                  </div>

                  <div className="perfil-inline-edit-field-PF">
                    <label>Cargo</label>
                    <input
                      type="text"
                      value={expEditTemp.cargo}
                      onChange={(e) => setExpEditTemp({ ...expEditTemp, cargo: e.target.value })}
                      className="perfil-inline-input-PF"
                    />
                  </div>

                  <div className="perfil-inline-edit-field-PF">
                    <label>Empresa</label>
                    <input
                      type="text"
                      value={expEditTemp.empresa}
                      onChange={(e) => setExpEditTemp({ ...expEditTemp, empresa: e.target.value })}
                      className="perfil-inline-input-PF"
                    />
                  </div>

                  <div className="perfil-inline-edit-field-PF">
                    <label>Fecha inicio</label>
                    <input
                      type="text"
                      value={expEditTemp.fechaInicio}
                      onChange={(e) => setExpEditTemp({ ...expEditTemp, fechaInicio: e.target.value })}
                      className="perfil-inline-input-PF"
                    />
                  </div>

                  <div className="perfil-inline-edit-field-PF">
                    <label>Fecha fin</label>
                    <input
                      type="text"
                      value={expEditTemp.fechaFin || ""}
                      onChange={(e) => setExpEditTemp({ ...expEditTemp, fechaFin: e.target.value })}
                      className="perfil-inline-input-PF"
                      placeholder="Dejar vacío si aún trabajas aquí"
                    />
                  </div>

                  <div className="perfil-inline-edit-field-PF">
                    <label>Descripción</label>
                    <textarea
                      value={expEditTemp.descripcion}
                      onChange={(e) => setExpEditTemp({ ...expEditTemp, descripcion: e.target.value })}
                      className="perfil-inline-textarea-PF"
                    />
                  </div>

                  <div className="perfil-inline-buttons-PF">
                    <button 
                      className="perfil-inline-save-PF"
                      onClick={guardarEditExp}
                      disabled={guardandoExp}
                    >
                      {guardandoExp ? "Guardando..." : "✓ Guardar"}
                    </button>
                    <button 
                      className="perfil-inline-cancel-PF"
                      onClick={cancelarEditExp}
                      disabled={guardandoExp}
                    >
                      ✕ Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // MODO VISTA
                <div key={index} className="perfil-experiencia-card-PF">
                  <div className="perfil-card-actions-PF">
                    <button
                      className="perfil-edit-btn-inline-PF"
                      onClick={() => iniciarEditExp(index)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="perfil-exp-delete-PF"
                      onClick={() => borrarExperiencia(index)}
                    >
                      Eliminar
                    </button>
                  </div>

                  <h4>{exp.cargo}</h4>
                  <p className="perfil-exp-empresa-PF">{exp.empresa}</p>
                  <p className="perfil-exp-fecha-PF">
                    {exp.fechaInicio} {exp.fechaFin ? ` - ${exp.fechaFin}` : " - Actualidad"}
                  </p>
                  {exp.municipio && <p className="perfil-exp-ubicacion-PF">📍 {exp.municipio}</p>}
                  {exp.descripcion && <p className="perfil-exp-desc-PF">{exp.descripcion}</p>}
                </div>
              )
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
              <option value="MAESTRIA">Maestría</option>
              <option value="DOCTORADO">Doctorado</option>
              <option value="ESPECIALIZACION">Especialización</option>
            </select>
            {/* Campo fechaFin solo si no está en curso */}
            {!nuevoEstudio.enCurso && (
              <input
                type="text"
                placeholder="Fecha fin (ej: 2024-12-15)"
                value={nuevoEstudio.fechaFin}
                onChange={(e) =>
                  setNuevoEstudio({ ...nuevoEstudio, fechaFin: e.target.value })
                }
              />
            )}
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                checked={nuevoEstudio.enCurso}
                onChange={(e) =>
                  setNuevoEstudio({ ...nuevoEstudio, enCurso: e.target.checked })
                }
              />
              En curso
            </label>
            <button onClick={() => agregarEstudio()}>Añadir educación</button>
          </div>

          {/* LISTA DE EDUCACIÓN */}
          {estudios.length === 0 ? (
            <p>No tienes estudios registrados</p>
          ) : (
            estudios.map((edu, index) => (
              editandoEduIndex === index && eduEditTemp ? (
                // MODO EDICIÓN INLINE
                <div key={index} className="perfil-educ-card-PF perfil-card-editing-PF">
                  <div className="perfil-edit-actions-top-PF">
                    <button
                      className="perfil-exp-delete-PF"
                      onClick={() => borrarEstudio(index)}
                    >
                      Eliminar
                    </button>
                  </div>

                  <div className="perfil-inline-edit-field-PF">
                    <label>Título</label>
                    <input
                      type="text"
                      value={eduEditTemp.titulo}
                      onChange={(e) => setEduEditTemp({ ...eduEditTemp, titulo: e.target.value })}
                      className="perfil-inline-input-PF"
                    />
                  </div>

                  <div className="perfil-inline-edit-field-PF">
                    <label>Institución</label>
                    <input
                      type="text"
                      value={eduEditTemp.institucion}
                      onChange={(e) => setEduEditTemp({ ...eduEditTemp, institucion: e.target.value })}
                      className="perfil-inline-input-PF"
                    />
                  </div>

                  <div className="perfil-inline-edit-field-PF">
                    <label>Nivel educativo</label>
                    <select
                      value={eduEditTemp.nivelEducativo}
                      onChange={(e) => setEduEditTemp({ ...eduEditTemp, nivelEducativo: e.target.value })}
                      className="perfil-inline-input-PF"
                    >
                      <option value="PRIMARIA">Primaria</option>
                      <option value="BACHILLERATO">Bachillerato</option>
                      <option value="TECNICO">Técnico</option>
                      <option value="TECNOLOGO">Tecnólogo</option>
                      <option value="UNIVERSITARIO">Universitario</option>
                      <option value="MAESTRIA">Maestría</option>
                      <option value="DOCTORADO">Doctorado</option>
                      <option value="ESPECIALIZACION">Especialización</option>
                    </select>
                  </div>

                  <div className="perfil-inline-edit-field-PF">
                    <label>Fecha inicio</label>
                    <input
                      type="text"
                      value={eduEditTemp.fechaInicio}
                      onChange={(e) => setEduEditTemp({ ...eduEditTemp, fechaInicio: e.target.value })}
                      className="perfil-inline-input-PF"
                    />
                  </div>

                  <div className="perfil-inline-edit-field-PF">
                    <label>
                      <input
                        type="checkbox"
                        checked={eduEditTemp.enCurso}
                        onChange={(e) => setEduEditTemp({ ...eduEditTemp, enCurso: e.target.checked })}
                      />
                      En curso
                    </label>
                  </div>

                  {!eduEditTemp.enCurso && (
                    <div className="perfil-inline-edit-field-PF">
                      <label>Fecha fin</label>
                      <input
                        type="text"
                        value={eduEditTemp.fechaFin || ""}
                        onChange={(e) => setEduEditTemp({ ...eduEditTemp, fechaFin: e.target.value })}
                        className="perfil-inline-input-PF"
                      />
                    </div>
                  )}

                  <div className="perfil-inline-buttons-PF">
                    <button 
                      className="perfil-inline-save-PF"
                      onClick={guardarEditEdu}
                      disabled={guardandoEdu}
                    >
                      {guardandoEdu ? "Guardando..." : "✓ Guardar"}
                    </button>
                    <button 
                      className="perfil-inline-cancel-PF"
                      onClick={cancelarEditEdu}
                      disabled={guardandoEdu}
                    >
                      ✕ Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // MODO VISTA
                <div key={index} className="perfil-educ-card-PF">
                  <div className="perfil-card-actions-PF">
                    <button
                      className="perfil-edit-btn-inline-PF"
                      onClick={() => iniciarEditEdu(index)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="perfil-exp-delete-PF"
                      onClick={() => borrarEstudio(index)}
                    >
                      Eliminar
                    </button>
                  </div>
                  <h4>{edu.titulo}</h4>
                  <p className="perfil-edu-inst-PF">{edu.institucion}</p>
                  <p className="perfil-edu-nivel-PF">Nivel: {edu.nivelEducativo || "No especificado"}</p>
                  <p className="perfil-edu-fecha-PF">
                    {edu.fechaInicio} 
                    {edu.enCurso ? " - Actualidad" : edu.fechaFin ? ` - ${edu.fechaFin}` : ""}
                  </p>
                  {edu.descripcion && <p className="perfil-edu-desc-PF">{edu.descripcion}</p>}
                </div>
              )
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

        {/* INFORMACIÓN DE LA HOJA DE VIDA */}
        {hojaDeVida && (
          <div className="perfil-bloque-PF">
            <h3 className="perfil-bloque-titulo-PF">Información Profesional</h3>
            
            {/* Resumen Profesional */}
            <div className="perfil-info-section-PF">
              <h4 className="perfil-info-title-PF">📋 Resumen Profesional</h4>
              <p className="perfil-info-value-PF">
                {hojaDeVida.resumenProfesional || "Sin resumen profesional"}
              </p>
            </div>

            {/* Idiomas */}
            {hojaDeVida.idiomas && (
              <div className="perfil-info-section-PF">
                <h4 className="perfil-info-title-PF">🗣️ Idiomas</h4>
                <p className="perfil-info-value-PF">{hojaDeVida.idiomas}</p>
              </div>
            )}

            {/* Red Social */}
            {hojaDeVida.redSocial1 && (
              <div className="perfil-info-section-PF">
                <h4 className="perfil-info-title-PF">🔗 Red Social</h4>
                <a href={hojaDeVida.redSocial1} target="_blank" rel="noopener noreferrer" className="perfil-link-PF">
                  {hojaDeVida.redSocial1}
                </a>
              </div>
            )}

            {/* Email de Contacto */}
            {hojaDeVida.contactoEmail && (
              <div className="perfil-info-section-PF">
                <h4 className="perfil-info-title-PF">📧 Email de Contacto</h4>
                <p className="perfil-info-value-PF">{hojaDeVida.contactoEmail}</p>
              </div>
            )}

            {/* Teléfono de HojaDeVida */}
            {hojaDeVida.telefono && (
              <div className="perfil-info-section-PF">
                <h4 className="perfil-info-title-PF">📞 Teléfono</h4>
                <p className="perfil-info-value-PF">{hojaDeVida.telefono}</p>
              </div>
            )}

            {/* Fechas */}
            <div className="perfil-info-section-PF">
              <h4 className="perfil-info-title-PF">📅 Fechas</h4>
              <div className="perfil-info-dates-PF">
                {hojaDeVida.fechaCreacion && (
                  <p className="perfil-info-date-PF">
                    <strong>Creada:</strong> {new Date(hojaDeVida.fechaCreacion).toLocaleDateString('es-CO')}
                  </p>
                )}
                {hojaDeVida.fechaActualizacion && (
                  <p className="perfil-info-date-PF">
                    <strong>Actualizada:</strong> {new Date(hojaDeVida.fechaActualizacion).toLocaleDateString('es-CO')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HojaDeVida;
