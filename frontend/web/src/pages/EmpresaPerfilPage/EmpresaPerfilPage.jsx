import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Building2, CalendarDays, MapPin, Phone, Mail, Users, BadgeInfo, Star } from "lucide-react";
import Header from "../../components/Header/Header";
import SidebarAspirante from "../../components/SidebarAspirante/SidebarAspirante";
import SidebarReclutador from "../../components/SidebarReclutador/SidebarReclutador";
import Footer from "../../components/Footer/footer";
import AppCard from "../../components/shared/AppCard";
import AppPageShell from "../../components/shared/AppPageShell";
import { getEmpresaById } from "../../api/empresaAPI";
import { getOfertasPorEmpresa } from "../../api/ofertasAPI";
import "./EmpresaPerfilPage.css";

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

function EmpresaPerfilPage() {
  const { empresaId } = useParams();
  const rol = (localStorage.getItem("rol") || "").toUpperCase();
  const [empresa, setEmpresa] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [puntuacionInput, setPuntuacionInput] = useState("");
  const [puntuando, setPuntuando] = useState(false);

  const sidebar = useMemo(() => {
    if (rol === "RECLUTADOR") {
      return <SidebarReclutador />;
    }

    if (rol === "ASPIRANTE") {
      return <SidebarAspirante />;
    }

    return null;
  }, [rol]);

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

        const [empresaResult, ofertasResult] = await Promise.allSettled([
          getEmpresaById(empresaId),
          getOfertasPorEmpresa(empresaId),
        ]);

        if (empresaResult.status === "fulfilled") {
          setEmpresa(empresaResult.value);
        } else {
          throw empresaResult.reason;
        }

        if (ofertasResult.status === "fulfilled") {
          setOfertas(Array.isArray(ofertasResult.value) ? ofertasResult.value : []);
        } else {
          setOfertas([]);
        }
      } catch (err) {
        console.error("Error al cargar perfil de empresa:", err);
        setError(err.message || "No se pudo cargar el perfil de la empresa");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [empresaId]);

  const handlePuntuar = async () => {
    const puntuacion = parseInt(puntuacionInput);
    if (isNaN(puntuacion) || puntuacion < 1 || puntuacion > 5) {
      alert("La puntuación debe estar entre 1 y 5");
      return;
    }

    try {
      setPuntuando(true);
      const response = await fetch(`http://localhost:8080/api/empresa/${empresaId}/puntuar`, {
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
        mainClassName="empresa-perfil-main"
        shellClassName=""
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
        mainClassName="empresa-perfil-main"
        shellClassName=""
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
      mainClassName="empresa-perfil-main"
      shellClassName=""
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

        {/* Ofertas */}
        <section className="empresa-perfil-ofertas">
          <h2>Ofertas laborales ({ofertas.length})</h2>
          {ofertas.length === 0 ? (
            <p className="empresa-perfil-no-ofertas">Esta empresa no tiene ofertas publicadas actualmente.</p>
          ) : (
            <div className="empresa-perfil-ofertas-grid">
              {ofertas.map((oferta) => (
                <AppCard key={oferta.id} className="empresa-perfil-oferta-card">
                  <div className="empresa-perfil-oferta-header">
                    <h3>{oferta.titulo || "Sin título"}</h3>
                    <span className="empresa-perfil-oferta-modalidad">{oferta.modalidad || "Modalidad"}</span>
                  </div>
                  <p className="empresa-perfil-oferta-descripcion">
                    {oferta.descripcion || "Sin descripción"}
                  </p>
                  <div className="empresa-perfil-oferta-meta">
                    <span>
                      <MapPin size={14} />
                      {oferta.municipio?.nombre || "Sin ubicación"}
                    </span>
                    <span>
                      <CalendarDays size={14} />
                      {formatDate(oferta.fechaPublicacion)}
                    </span>
                  </div>
                  <div className="empresa-perfil-oferta-salary">
                    {formatSalary(oferta.salario)}
                  </div>
                  <Link to={`/Aspirante/OfertaCompleta/${oferta.id}`} className="empresa-perfil-oferta-link">
                    Ver oferta completa
                  </Link>
                </AppCard>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppPageShell>
  );
}

export default EmpresaPerfilPage;