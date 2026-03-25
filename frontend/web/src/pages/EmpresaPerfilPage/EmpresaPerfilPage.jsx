import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Building2, CalendarDays, MapPin, Phone, Mail, Users, BadgeInfo, Star, Edit, X, Save } from "lucide-react";
import Header from "../../components/Header/Header";
import SidebarAspirante from "../../components/SidebarAspirante/SidebarAspirante";
import SidebarReclutador from "../../components/SidebarReclutador/SidebarReclutador";
import Footer from "../../components/Footer/footer";
import AppCard from "../../components/shared/AppCard";
import OfertaCard from "../../components/shared/OfertaCard";
import AppPageShell from "../../components/shared/AppPageShell";
import { getEmpresaById, actualizarEmpresa } from "../../api/empresaAPI";
import { API_BASE_URL } from "../../api/apiBase";
import { getMunicipios } from "../../api/municipioAPI";
import { getOfertasByEmpresaId } from "../../api/ofertasAPI";
import reclutadoresApi from "../../api/reclutadoresApi";
import "./EmpresaPerfilPage.css";

const formatDate = (value) => {
  if (!value) return "Sin fecha";
  try {
    return new Date(value).toLocaleDateString("es-CO");
  } catch {
    return "Sin fecha";
  }
};

function EmpresaPerfilPage() {
  const { empresaId } = useParams();
  const [rol, setRol] = useState(() => (localStorage.getItem("rol") || "").toUpperCase());
  const [empresa, setEmpresa] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [reclutadores, setReclutadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [puntuacionInput, setPuntuacionInput] = useState("");
  const [puntuando, setPuntuando] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: "",
    numeroTrabajadores: "",
    descripcion: "",
    email: "",
    telefono: "",
    logoUrl: "",
    municipioId: "",
    categories: []
  });
  const [saving, setSaving] = useState(false);
  const [municipios, setMunicipios] = useState([]);

  const sidebar =
    rol === "RECLUTADOR" ? (
      <SidebarReclutador />
    ) : rol === "ASPIRANTE" ? (
      <SidebarAspirante />
    ) : null;

  const shellClassName =
    rol === "RECLUTADOR"
      ? "reclutador-shell-RP"
      : rol === "ASPIRANTE"
      ? "aspirante-shell-AP"
      : "";

  const mainClassName =
    rol === "RECLUTADOR"
      ? "reclutador-main-RP empresa-perfil-main"
      : "empresa-perfil-main";

  useEffect(() => {
    const cargarDatos = async () => {
      if (!empresaId) {
        setError("No se encontró la empresa.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Cargar municipios para el modal de edición
        try {
          const municipiosData = await getMunicipios();
          setMunicipios(municipiosData);
        } catch (munError) {
          console.warn("Error al cargar municipios:", munError);
        }

        const [empresaResult, ofertasResult, reclutadoresResult] = await Promise.allSettled([
          getEmpresaById(empresaId),
          getOfertasByEmpresaId(empresaId),
          reclutadoresApi.getByEmpresa(empresaId),
        ]);

        if (empresaResult.status === "fulfilled") {
          setEmpresa(empresaResult.value);
        } else {
          throw empresaResult.reason;
        }

        if (ofertasResult.status === "fulfilled") {
          setOfertas(Array.isArray(ofertasResult.value) ? ofertasResult.value : []);
        } else {
          console.error("Error al cargar ofertas:", ofertasResult.reason);
          setOfertas([]);
        }

        if (reclutadoresResult.status === "fulfilled") {
          setReclutadores(Array.isArray(reclutadoresResult.value) ? reclutadoresResult.value : []);
        } else {
          console.error("Error al cargar reclutadores:", reclutadoresResult.reason);
          setReclutadores([]);
        }

        // Check if owner
        if (rol === "RECLUTADOR") {
          try {
            const reclutador = await reclutadoresApi.getMyProfile();
            setIsOwner(reclutador?.empresa?.id === Number(empresaId));
          } catch (err) {
            console.warn("Error checking ownership:", err);
            setIsOwner(false);
          }
        }
      } catch (err) {
        console.error("Error al cargar perfil de empresa:", err);
        setError(err.message || "No se pudo cargar el perfil de la empresa");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [empresaId, rol]);

  const handleOpenEditModal = () => {
    setEditForm({
      nombre: empresa?.nombre || "",
      numeroTrabajadores: empresa?.numeroTrabajadores || "",
      descripcion: empresa?.descripcion || "",
      email: empresa?.email || "",
      telefono: empresa?.telefono || "",
      logoUrl: empresa?.logoUrl || "",
      municipioId: empresa?.municipio?.id || "",
      categories: empresa?.categories || []
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditForm({
      nombre: "",
      numeroTrabajadores: "",
      descripcion: "",
      email: "",
      telefono: "",
      logoUrl: "",
      municipioId: "",
      categories: []
    });
  };

  const handleSaveEmpresa = async () => {
    try {
      setSaving(true);

      if (!editForm.nombre.trim()) {
        alert("El nombre de la empresa es requerido");
        return;
      }

      if (!editForm.municipioId) {
        alert("Debe seleccionar un municipio");
        return;
      }

      const empresaData = {
        nombre: editForm.nombre.trim(),
        numeroTrabajadores: parseInt(editForm.numeroTrabajadores) || 0,
        descripcion: editForm.descripcion.trim() || null,
        email: editForm.email.trim() || null,
        telefono: editForm.telefono.trim() || null,
        logoUrl: editForm.logoUrl.trim() || null,
        nit: empresa.nit,
        municipio: { id: parseInt(editForm.municipioId) },
        categories: Array.isArray(editForm.categories) ? editForm.categories.filter((c) => c.trim()) : []
      };

      const result = await actualizarEmpresa(empresaId, empresaData);
      
      const updatedEmpresa = await getEmpresaById(empresaId);
      setEmpresa(updatedEmpresa);
      
      setShowEditModal(false);
      alert("Empresa actualizada exitosamente");
    } catch (err) {
      console.error("Error al actualizar empresa:", err);
      alert("Error al actualizar la empresa: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePuntuar = async () => {
    const puntuacion = parseInt(puntuacionInput);
    if (isNaN(puntuacion) || puntuacion < 1 || puntuacion > 5) {
      alert("La puntuación debe estar entre 1 y 5");
      return;
    }

    try {
      setPuntuando(true);
      const response = await fetch(`${API_BASE_URL}/api/empresa/${empresaId}/puntuar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ puntuacion })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al puntuar');
      }

      alert('Puntuación registrada exitosamente');
      // Recargar empresa para actualizar promedio
      window.location.reload();
    } catch (err) {
      console.error('Error al puntuar:', err);
      alert(err.message);
    } finally {
      setPuntuando(false);
    }
  };

  const resumen = useMemo(
    () => [
      {
        label: "Municipio",
        value: empresa?.municipio?.nombre || "-",
        icon: <MapPin size={16} />,
      },
      {
        label: "Correo",
        value: empresa?.email || "-",
        icon: <Mail size={16} />,
      },
      {
        label: "Teléfono",
        value: empresa?.telefono || "-",
        icon: <Phone size={16} />,
      },
      {
        label: "Número de empleados",
        value: empresa?.numeroTrabajadores || "-",
        icon: <Users size={16} />,
      },
      {
        label: "NIT",
        value: empresa?.nit || "-",
        icon: <BadgeInfo size={16} />,
      },
      {
        label: "Categorías",
        value: empresa?.categories ? Array.from(empresa.categories).join(", ") : "-",
        icon: <BadgeInfo size={16} />,
      },
      {
        label: "Fecha de creación",
        value: formatDate(empresa?.fechaCreacion),
        icon: <CalendarDays size={16} />,
      },
    ],
    [empresa]
  );

  if (loading) {
    return (
      <>
        <Header />
        {sidebar}
        <main className="empresa-perfil-main">
          <div className="empresa-perfil-loading">Cargando perfil de empresa...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <AppPageShell
        header={<Header variant="simple" />}
        sidebar={sidebar}
        footer={<Footer />}
        mainClassName={mainClassName}
        shellClassName={shellClassName}
        orientation={sidebar ? "sidebar" : "stacked"}
      >
        <div className="empresa-perfil-loading">
          <p>Cargando perfil de empresa...</p>
        </div>
      </AppPageShell>
    );
  }

  if (error) {
    return (
      <AppPageShell
        header={<Header variant="simple" />}
        sidebar={sidebar}
        footer={<Footer />}
        mainClassName={mainClassName}
        shellClassName={shellClassName}
        orientation={sidebar ? "sidebar" : "stacked"}
      >
        <div className="empresa-perfil-error">
          <h2>No se pudo cargar el perfil</h2>
          <p>{error}</p>
        </div>
      </AppPageShell>
    );
  }

  return (
    <AppPageShell
      header={<Header variant="simple" />}
      sidebar={sidebar}
      footer={<Footer />}
      mainClassName={mainClassName}
      shellClassName={shellClassName}
      orientation={sidebar ? "sidebar" : "stacked"}
    >
      <div className="empresa-perfil-container">
        {/* Hero Section */}
        <section className="empresa-perfil-hero">
          <div className="empresa-perfil-avatar">
            {empresa?.logoUrl ? (
              <img src={empresa.logoUrl} alt={empresa.nombre} />
            ) : (
              <Building2 size={60} />
            )}
          </div>
          <div className="empresa-perfil-hero-info">
            <h1>{empresa?.nombre || "Empresa"}</h1>
            <p>{empresa?.descripcion || "Sin descripción"}</p>
            <div className="empresa-perfil-meta">
              <span>
                <MapPin size={16} />
                {empresa?.municipio?.nombre || "Sin ubicación"}
              </span>
              <span>
                <Users size={16} />
                {empresa?.numeroTrabajadores || "N/A"} empleados
              </span>
              <span className={`empresa-perfil-puntuacion ${empresa?.puntuacion >= 4 ? 'puntuacion-alta' : empresa?.puntuacion >= 3 ? 'puntuacion-media' : 'puntuacion-baja'}`}>
                <Star size={16} />
                {empresa?.puntuacion ? empresa.puntuacion.toFixed(1) : "N/A"}
              </span>
            </div>
            {isOwner && (
              <div className="empresa-perfil-editar">
                <button 
                  onClick={handleOpenEditModal} 
                  className="empresa-perfil-editar-btn"
                >
                  <Edit size={16} />
                  Editar Empresa
                </button>
              </div>
            )}
            {rol === "ASPIRANTE" && (
              <div className="empresa-perfil-puntuar">
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={puntuacionInput}
                  onChange={(e) => setPuntuacionInput(e.target.value)}
                  placeholder="1-5"
                  disabled={puntuando}
                />
                <button onClick={handlePuntuar} disabled={puntuando}>
                  {puntuando ? "Puntuando..." : "Puntuar"}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Resumen */}
        <section className="empresa-perfil-resumen">
          <h2>Información de la empresa</h2>
          <div className="empresa-perfil-resumen-grid">
            {resumen.map((item, index) => (
              <div key={index} className="empresa-perfil-resumen-item">
                {item.icon}
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="empresa-perfil-reclutadores">
          <div className="empresa-perfil-section-head">
            <h2>Reclutadores vinculados</h2>
            <span>{reclutadores.length}</span>
          </div>
          {reclutadores.length === 0 ? (
            <p className="empresa-perfil-no-reclutadores">Todavía no hay reclutadores vinculados a esta empresa.</p>
          ) : (
            <div className="empresa-perfil-reclutadores-list">
              {reclutadores.map((reclutador) => (
                <div key={reclutador.id} className="empresa-perfil-reclutador-chip">
                  <div className="empresa-perfil-reclutador-avatar">
                    {(reclutador.nombre || "R").charAt(0).toUpperCase()}
                  </div>
                  <div className="empresa-perfil-reclutador-info">
                    <strong>{reclutador.nombre || "Reclutador"} {reclutador.apellido || ""}</strong>
                    <span>{reclutador.correo || "Sin correo"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Ofertas */}
        <section className="empresa-perfil-ofertas">
          <h2>Ofertas laborales ({ofertas.length})</h2>
          {ofertas.length === 0 ? (
            <p className="empresa-perfil-no-ofertas">Esta empresa no tiene ofertas publicadas actualmente.</p>
          ) : (
            <div className="empresa-perfil-ofertas-grid">
              {ofertas.map((oferta) => (
                <OfertaCard 
                  key={oferta.id} 
                  oferta={oferta} 
                  rol={rol} 
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="empresa-edit-modal-overlay">
          <div className="empresa-edit-modal">
            <div className="empresa-edit-modal-header">
              <h2>Editar Empresa</h2>
              <button onClick={handleCloseEditModal} className="empresa-edit-modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="empresa-edit-modal-body">
              <div className="empresa-edit-form">
                <div className="empresa-edit-field">
                  <label>Nombre de la Empresa</label>
                  <input
                    type="text"
                    value={editForm.nombre}
                    onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                    placeholder="Nombre de la empresa"
                  />
                </div>
                
                <div className="empresa-edit-field">
                  <label>Número de Trabajadores</label>
                  <input
                    type="number"
                    value={editForm.numeroTrabajadores}
                    onChange={(e) => setEditForm({...editForm, numeroTrabajadores: e.target.value})}
                    placeholder="Número de empleados"
                    min="0"
                  />
                </div>
                
                <div className="empresa-edit-field">
                  <label>Descripción</label>
                  <textarea
                    value={editForm.descripcion}
                    onChange={(e) => setEditForm({...editForm, descripcion: e.target.value})}
                    placeholder="Descripción de la empresa"
                    rows="3"
                  />
                </div>
                
                <div className="empresa-edit-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    placeholder="contacto@empresa.com"
                  />
                </div>
                
                <div className="empresa-edit-field">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={editForm.telefono}
                    onChange={(e) => setEditForm({...editForm, telefono: e.target.value})}
                    placeholder="Número de teléfono"
                  />
                </div>
                
                <div className="empresa-edit-field">
                  <label>URL del Logo</label>
                  <input
                    type="url"
                    value={editForm.logoUrl}
                    onChange={(e) => setEditForm({...editForm, logoUrl: e.target.value})}
                    placeholder="https://ejemplo.com/logo.png"
                  />
                </div>
                
                <div className="empresa-edit-field">
                  <label>Municipio</label>
                  <select
                    value={editForm.municipioId}
                    onChange={(e) => setEditForm({...editForm, municipioId: e.target.value})}
                    className="empresa-edit-select"
                  >
                    <option value="">Selecciona municipio</option>
                    {municipios.map((mun) => (
                      <option key={mun.id} value={mun.id}>
                        {mun.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="empresa-edit-field">
                  <label>Categorías (separadas por coma)</label>
                  <input
                    type="text"
                    value={editForm.categories.join(', ')}
                    onChange={(e) => setEditForm({...editForm, categories: e.target.value.split(',').map(c => c.trim()).filter(c => c)})}
                    placeholder="TECNOLOGIA, SERVICIOS"
                  />
                </div>
              </div>
            </div>
            <div className="empresa-edit-modal-footer">
              <button onClick={handleCloseEditModal} className="empresa-edit-btn-cancel">
                Cancelar
              </button>
              <button onClick={handleSaveEmpresa} disabled={saving} className="empresa-edit-btn-save">
                <Save size={16} />
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppPageShell>
  );
}

export default EmpresaPerfilPage;