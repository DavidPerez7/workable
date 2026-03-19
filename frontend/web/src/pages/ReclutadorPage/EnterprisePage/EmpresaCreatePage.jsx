import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import SidebarReclutador from "../../../components/SidebarReclutador/SidebarReclutador";
import { crearEmpresa } from "../../../api/empresaAPI";
import "./EnterprisePage.css";

function EmpresaCreatePage() {
  const [form, setForm] = useState({
    nombre: "",
    nit: "",
    numeroTrabajadores: "",
    email: "",
    telefono: "",
    descripcion: "",
    logoUrl: "",
    municipioId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await crearEmpresa({
        nombre: form.nombre,
        nit: form.nit,
        numeroTrabajadores: Number(form.numeroTrabajadores || 1),
        email: form.email,
        telefono: form.telefono,
        descripcion: form.descripcion,
        logoUrl: form.logoUrl || null,
        categories: ["TECNOLOGIA"],
        municipio: { id: Number(form.municipioId) },
      });
      navigate("/Reclutador/EnterprisePage");
    } catch (err) {
      setError(err.message || "No se pudo crear la empresa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderReclutador />
      <div className="reclutador-shell-RP">
        <SidebarReclutador />
        <main className="reclutador-main-RP">
          <section className="reclutador-card-RP">
            <div className="reclutador-card-header-RP">
              <div>
                <p className="reclutador-kicker-RP">Empresa</p>
                <h2>Crear empresa</h2>
              </div>
            </div>
            <form className="empresa-form-RP" onSubmit={handleSubmit}>
              <div className="empresa-row-RP">
                <label>
                  Nombre *
                  <input name="nombre" value={form.nombre} onChange={handleChange} required />
                </label>
                <label>
                  NIT *
                  <input name="nit" value={form.nit} onChange={handleChange} required />
                </label>
              </div>
              <div className="empresa-row-RP">
                <label>
                  Numero trabajadores *
                  <input name="numeroTrabajadores" value={form.numeroTrabajadores} onChange={handleChange} required />
                </label>
                <label>
                  Email *
                  <input name="email" type="email" value={form.email} onChange={handleChange} required />
                </label>
              </div>
              <div className="empresa-row-RP">
                <label>
                  Telefono *
                  <input name="telefono" value={form.telefono} onChange={handleChange} required />
                </label>
                <label>
                  Logo (URL)
                  <input name="logoUrl" value={form.logoUrl} onChange={handleChange} />
                </label>
              </div>
              <label className="empresa-full-RP">
                Municipio ID *
                <input name="municipioId" value={form.municipioId} onChange={handleChange} required />
              </label>
              <label className="empresa-full-RP">
                Descripcion *
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows="4" required />
              </label>
              <button type="submit" className="reclutador-button-RP" disabled={loading}>
                {loading ? "Creando..." : "Crear empresa"}
              </button>
              {error && <p className="reclutador-alert-RP error">{error}</p>}
            </form>
          </section>
        </main>
      </div>
    </>
  );
}

export default EmpresaCreatePage;
