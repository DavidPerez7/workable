import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  GraduationCap,
  Plus,
  Save,
  Trash2,
  UserCircle2,
} from "lucide-react";
import Header from "../../../../components/Header/Header";
import SidebarAspirante from "../../../../components/SidebarAspirante/SidebarAspirante";
import Footer from "../../../../components/Footer/footer";
import aspirantesApi from "../../../../api/aspirantesApi";
import {
  getHojasDeVidaPorAspirante,
  actualizarHojaDeVida,
} from "../../../../api/hojaDeVidaAPI";
import "./HojaDeVida.css";

const emptyStudy = {
  titulo: "",
  institucion: "",
  nivelEducativo: "UNIVERSITARIO",
  fechaInicio: "",
  fechaFin: "",
  certificadoUrl: "",
};

const emptyExperience = {
  cargo: "",
  empresa: "",
  fechaInicio: "",
  fechaFin: "",
  descripcion: "",
  certificadoUrl: "",
};

const formatearFecha = (fecha) => {
  if (!fecha) {
    return "";
  }

  return new Date(fecha).toISOString().slice(0, 10);
};

const normalizarLista = (lista, mapper) =>
  Array.isArray(lista) ? lista.map(mapper) : [];

const normalizarHoja = (data) => {
  const source = Array.isArray(data) ? data[0] : data;

  if (!source) {
    return null;
  }

  return {
    id: source.id,
    resumenProfesional: source.resumenProfesional || source.resumen || "",
    telefono: source.telefono || "",
    correoElectronico: source.correoElectronico || source.contactoEmail || "",
    redSocial: source.redSocial || source.redSocial1 || "",
    estudios: normalizarLista(source.estudios, (estudio) => ({
      titulo: estudio.titulo || "",
      institucion: estudio.institucion || "",
      nivelEducativo: estudio.nivelEducativo || estudio.nivel || "UNIVERSITARIO",
      fechaInicio: formatearFecha(estudio.fechaInicio),
      fechaFin: formatearFecha(estudio.fechaFin),
      certificadoUrl: estudio.certificadoUrl || "",
    })),
    experiencias: normalizarLista(source.experiencias, (experiencia) => ({
      cargo: experiencia.cargo || "",
      empresa: experiencia.empresa || "",
      fechaInicio: formatearFecha(experiencia.fechaInicio),
      fechaFin: formatearFecha(experiencia.fechaFin),
      descripcion: experiencia.descripcion || "",
      certificadoUrl: experiencia.certificadoUrl || "",
    })),
  };
};

const serializarHoja = (hoja) => ({
  resumenProfesional: hoja.resumenProfesional,
  resumen: hoja.resumenProfesional,
  telefono: hoja.telefono,
  correoElectronico: hoja.correoElectronico,
  contactoEmail: hoja.correoElectronico,
  redSocial: hoja.redSocial,
  redSocial1: hoja.redSocial,
  estudios: hoja.estudios,
  experiencias: hoja.experiencias,
});

const HojaDeVida = () => {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [hoja, setHoja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [nuevoEstudio, setNuevoEstudio] = useState(emptyStudy);
  const [nuevaExperiencia, setNuevaExperiencia] = useState(emptyExperience);

  const cargarDatos = async () => {
    const usuarioId = localStorage.getItem("usuarioId");

    if (!usuarioId) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [perfilData, hojaData] = await Promise.all([
        aspirantesApi.get(usuarioId),
        getHojasDeVidaPorAspirante(usuarioId),
      ]);

      setPerfil(perfilData);
      setHoja(normalizarHoja(hojaData));
    } catch (err) {
      console.error("Error al cargar la hoja de vida:", err);
      setError(err.message || "No se pudo cargar la hoja de vida");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistirHoja = async (nextHoja, mensajeExito) => {
    if (!nextHoja?.id) {
      setNotice("No se encontró una hoja de vida existente para actualizar.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await actualizarHojaDeVida(nextHoja.id, serializarHoja(nextHoja));
      setHoja(nextHoja);
      setNotice(mensajeExito || "Hoja de vida actualizada.");
    } catch (err) {
      console.error("Error al guardar hoja de vida:", err);
      setError(err.message || "No se pudo guardar la hoja de vida");
    } finally {
      setSaving(false);
    }
  };

  const handleGeneralChange = (event) => {
    const { name, value } = event.target;
    setHoja((current) =>
      current
        ? {
            ...current,
            [name]: value,
          }
        : current
    );
  };

  const guardarGeneral = async () => {
    if (!hoja) {
      setNotice("No hay hoja de vida para actualizar.");
      return;
    }

    await persistirHoja(hoja, "Datos generales guardados.");
  };

  const agregarEstudio = async (event) => {
    event.preventDefault();

    if (!nuevoEstudio.titulo.trim() || !nuevoEstudio.institucion.trim() || !nuevoEstudio.fechaInicio) {
      setNotice("Completa título, institución y fecha de inicio para agregar el estudio.");
      return;
    }

    const nextHoja = {
      ...(hoja || {}),
      estudios: [...(hoja?.estudios || []), nuevoEstudio],
    };

    await persistirHoja(nextHoja, "Estudio agregado correctamente.");
    setNuevoEstudio(emptyStudy);
  };

  const eliminarEstudio = async (index) => {
    if (!hoja) {
      return;
    }

    const nextHoja = {
      ...hoja,
      estudios: hoja.estudios.filter((_, currentIndex) => currentIndex !== index),
    };

    await persistirHoja(nextHoja, "Estudio eliminado.");
  };

  const agregarExperiencia = async (event) => {
    event.preventDefault();

    if (!nuevaExperiencia.cargo.trim() || !nuevaExperiencia.empresa.trim() || !nuevaExperiencia.fechaInicio) {
      setNotice("Completa cargo, empresa y fecha de inicio para agregar la experiencia.");
      return;
    }

    const nextHoja = {
      ...(hoja || {}),
      experiencias: [...(hoja?.experiencias || []), nuevaExperiencia],
    };

    await persistirHoja(nextHoja, "Experiencia agregada correctamente.");
    setNuevaExperiencia(emptyExperience);
  };

  const eliminarExperiencia = async (index) => {
    if (!hoja) {
      return;
    }

    const nextHoja = {
      ...hoja,
      experiencias: hoja.experiencias.filter((_, currentIndex) => currentIndex !== index),
    };

    await persistirHoja(nextHoja, "Experiencia eliminada.");
  };

  if (loading) {
    return <div className="hoja-state-AP">Cargando hoja de vida...</div>;
  }

  return (
    <>
      <Header isLoggedIn={true} userRole="ASPIRANTE" />

      <div className="hoja-shell-AP">
        <SidebarAspirante />

        <main className="hoja-main-AP">
          <section className="hoja-hero-AP">
            <div className="hoja-hero-left-AP">
              <div className="hoja-avatar-AP">
                {perfil?.urlFotoPerfil ? (
                  <img src={perfil.urlFotoPerfil} alt={`${perfil.nombre} ${perfil.apellido}`} />
                ) : (
                  <UserCircle2 size={48} />
                )}
              </div>

              <div>
                <p className="hoja-kicker-AP">Hoja de vida</p>
                <h1>
                  {perfil?.nombre} {perfil?.apellido}
                </h1>
                <p>{perfil?.municipio?.nombre || "Sin ubicación registrada"}</p>
              </div>
            </div>

            <Link to="/Aspirante/MiPerfil" className="secondary-button-AP">
              Volver al perfil
            </Link>
          </section>

          {error && <div className="alert-AP error">{error}</div>}
          {notice && <div className="alert-AP success">{notice}</div>}
          {!hoja && <div className="alert-AP warning">No se encontró una hoja de vida registrada.</div>}

          <section className="hoja-grid-AP">
            <article className="hoja-card-AP">
              <div className="section-header-AP">
                <div>
                  <p className="hoja-kicker-AP">Información general</p>
                  <h2>Contacto y resumen</h2>
                </div>
                <button type="button" className="primary-button-AP" onClick={guardarGeneral} disabled={saving || !hoja}>
                  <Save size={16} />
                  Guardar
                </button>
              </div>

              <div className="hoja-form-grid-AP">
                <label className="field-AP">
                  <span>Teléfono</span>
                  <input name="telefono" value={hoja?.telefono || ""} onChange={handleGeneralChange} />
                </label>

                <label className="field-AP">
                  <span>Correo electrónico</span>
                  <input
                    name="correoElectronico"
                    value={hoja?.correoElectronico || ""}
                    onChange={handleGeneralChange}
                  />
                </label>

                <label className="field-AP field-wide-AP">
                  <span>Red social</span>
                  <input name="redSocial" value={hoja?.redSocial || ""} onChange={handleGeneralChange} />
                </label>

                <label className="field-AP field-wide-AP">
                  <span>Resumen profesional</span>
                  <textarea
                    name="resumenProfesional"
                    rows={5}
                    value={hoja?.resumenProfesional || ""}
                    onChange={handleGeneralChange}
                  />
                </label>
              </div>
            </article>

            <article className="hoja-card-AP">
              <div className="section-header-AP">
                <div>
                  <p className="hoja-kicker-AP">Experiencia</p>
                  <h2>Agregar experiencia</h2>
                </div>
              </div>

              <form className="hoja-form-grid-AP" onSubmit={agregarExperiencia}>
                <label className="field-AP">
                  <span>Cargo</span>
                  <input
                    value={nuevaExperiencia.cargo}
                    onChange={(event) =>
                      setNuevaExperiencia((current) => ({ ...current, cargo: event.target.value }))
                    }
                  />
                </label>

                <label className="field-AP">
                  <span>Empresa</span>
                  <input
                    value={nuevaExperiencia.empresa}
                    onChange={(event) =>
                      setNuevaExperiencia((current) => ({ ...current, empresa: event.target.value }))
                    }
                  />
                </label>

                <label className="field-AP">
                  <span>Inicio</span>
                  <input
                    type="date"
                    value={nuevaExperiencia.fechaInicio}
                    onChange={(event) =>
                      setNuevaExperiencia((current) => ({ ...current, fechaInicio: event.target.value }))
                    }
                  />
                </label>

                <label className="field-AP">
                  <span>Fin</span>
                  <input
                    type="date"
                    value={nuevaExperiencia.fechaFin}
                    onChange={(event) =>
                      setNuevaExperiencia((current) => ({ ...current, fechaFin: event.target.value }))
                    }
                  />
                </label>

                <label className="field-AP field-wide-AP">
                  <span>Descripción</span>
                  <textarea
                    rows={3}
                    value={nuevaExperiencia.descripcion}
                    onChange={(event) =>
                      setNuevaExperiencia((current) => ({ ...current, descripcion: event.target.value }))
                    }
                  />
                </label>

                <label className="field-AP field-wide-AP">
                  <span>Certificado URL</span>
                  <input
                    value={nuevaExperiencia.certificadoUrl}
                    onChange={(event) =>
                      setNuevaExperiencia((current) => ({ ...current, certificadoUrl: event.target.value }))
                    }
                  />
                </label>

                <button type="submit" className="primary-button-AP full-width-AP" disabled={saving || !hoja}>
                  <Plus size={16} />
                  Agregar experiencia
                </button>
              </form>

              <div className="list-stack-AP">
                {(hoja?.experiencias || []).length === 0 ? (
                  <div className="empty-state-AP">No tienes experiencias registradas.</div>
                ) : (
                  (hoja?.experiencias || []).map((experiencia, index) => (
                    <article key={`${experiencia.cargo}-${index}`} className="item-card-AP">
                      <div className="item-top-AP">
                        <div>
                          <h3>{experiencia.cargo || "Sin cargo"}</h3>
                          <p>{experiencia.empresa || "Empresa"}</p>
                        </div>
                        <button type="button" className="icon-button-AP danger" onClick={() => eliminarExperiencia(index)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <span>
                        {experiencia.fechaInicio || "Inicio"} - {experiencia.fechaFin || "Actualidad"}
                      </span>
                      {experiencia.descripcion && <p>{experiencia.descripcion}</p>}
                    </article>
                  ))
                )}
              </div>
            </article>

            <article className="hoja-card-AP hoja-card-wide-AP">
              <div className="section-header-AP">
                <div>
                  <p className="hoja-kicker-AP">Estudios</p>
                  <h2>Agregar formación</h2>
                </div>
              </div>

              <form className="hoja-form-grid-AP" onSubmit={agregarEstudio}>
                <label className="field-AP">
                  <span>Título</span>
                  <input
                    value={nuevoEstudio.titulo}
                    onChange={(event) =>
                      setNuevoEstudio((current) => ({ ...current, titulo: event.target.value }))
                    }
                  />
                </label>

                <label className="field-AP">
                  <span>Institución</span>
                  <input
                    value={nuevoEstudio.institucion}
                    onChange={(event) =>
                      setNuevoEstudio((current) => ({ ...current, institucion: event.target.value }))
                    }
                  />
                </label>

                <label className="field-AP">
                  <span>Nivel educativo</span>
                  <select
                    value={nuevoEstudio.nivelEducativo}
                    onChange={(event) =>
                      setNuevoEstudio((current) => ({ ...current, nivelEducativo: event.target.value }))
                    }
                  >
                    <option value="TECNICO">Técnico</option>
                    <option value="TECNOLOGICO">Tecnológico</option>
                    <option value="UNIVERSITARIO">Universitario</option>
                    <option value="POSGRADO">Posgrado</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </label>

                <label className="field-AP">
                  <span>Inicio</span>
                  <input
                    type="date"
                    value={nuevoEstudio.fechaInicio}
                    onChange={(event) =>
                      setNuevoEstudio((current) => ({ ...current, fechaInicio: event.target.value }))
                    }
                  />
                </label>

                <label className="field-AP">
                  <span>Fin</span>
                  <input
                    type="date"
                    value={nuevoEstudio.fechaFin}
                    onChange={(event) =>
                      setNuevoEstudio((current) => ({ ...current, fechaFin: event.target.value }))
                    }
                  />
                </label>

                <label className="field-AP field-wide-AP">
                  <span>Certificado URL</span>
                  <input
                    value={nuevoEstudio.certificadoUrl}
                    onChange={(event) =>
                      setNuevoEstudio((current) => ({ ...current, certificadoUrl: event.target.value }))
                    }
                  />
                </label>

                <button type="submit" className="primary-button-AP full-width-AP" disabled={saving || !hoja}>
                  <Plus size={16} />
                  Agregar estudio
                </button>
              </form>

              <div className="list-stack-AP">
                {(hoja?.estudios || []).length === 0 ? (
                  <div className="empty-state-AP">No tienes estudios registrados.</div>
                ) : (
                  (hoja?.estudios || []).map((estudio, index) => (
                    <article key={`${estudio.titulo}-${index}`} className="item-card-AP">
                      <div className="item-top-AP">
                        <div>
                          <h3>{estudio.titulo || "Sin título"}</h3>
                          <p>{estudio.institucion || "Institución"}</p>
                        </div>
                        <button type="button" className="icon-button-AP danger" onClick={() => eliminarEstudio(index)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <span>
                        {estudio.nivelEducativo || "Nivel"} · {estudio.fechaInicio || "Inicio"} - {estudio.fechaFin || "Actualidad"}
                      </span>
                    </article>
                  ))
                )}
              </div>
            </article>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default HojaDeVida;
