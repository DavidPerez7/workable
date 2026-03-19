import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import SidebarReclutador from "../../../components/SidebarReclutador/SidebarReclutador";
import { actualizarEmpresa, eliminarEmpresa, getEmpresaById } from "../../../api/empresaAPI";
import reclutadoresApi from "../../../api/reclutadoresApi";
import "./EmpresaEditPage.css";

function EmpresaEditPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarEmpresa = async () => {
      try {
        setLoading(true);
        const reclutador = await reclutadoresApi.getMyProfile();
        const empresaId = reclutador?.empresa?.id;
        if (!empresaId) {
          setError("No tienes empresa asociada");
          return;
        }
        const data = await getEmpresaById(empresaId);
        setForm({
          id: data.id,
          nombre: data.nombre || "",
          nit: data.nit || "",
          numeroTrabajadores: data.numeroTrabajadores || "",
          email: data.email || data.emailContacto || "",
          telefono: data.telefono || data.telefonoContacto || "",
          descripcion: data.descripcion || "",
          logoUrl: data.logoUrl || data.logo || "",
          municipioId: data.municipio?.id || "",
          categories: Array.isArray(data.categories) ? data.categories : [],
        });
      } catch (err) {
        console.error("Error al cargar empresa:", err);
        setError(err.message || "No se pudo cargar la empresa");
      } finally {
        setLoading(false);
      }
    };

    cargarEmpresa();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleCategory = (category) => {
    setForm((prev) => {
      const next = new Set(prev.categories);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return { ...prev, categories: Array.from(next) };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form?.id) return;

    try {
      setSaving(true);
      await actualizarEmpresa(form.id, {
        nombre: form.nombre,
        nit: form.nit,
        numeroTrabajadores: Number(form.numeroTrabajadores || 1),
        email: form.email,
        telefono: form.telefono,
        descripcion: form.descripcion,
        logoUrl: form.logoUrl || null,
        categories: form.categories.length ? form.categories : ["TECNOLOGIA"],
        municipio: form.municipioId ? { id: Number(form.municipioId) } : null,
      });
      navigate("/Reclutador/EnterprisePage");
    } catch (err) {
      console.error("Error al actualizar empresa:", err);
      setError(err.message || "No se pudo actualizar la empresa");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!form?.id) return;
    const confirmacion = window.confirm("Deseas eliminar esta empresa?");
    if (!confirmacion) return;
    try {
      setSaving(true);
      await eliminarEmpresa(form.id);
      navigate("/Reclutador/EnterprisePage");
    } catch (err) {
      console.error("Error al eliminar empresa:", err);
      setError(err.message || "No se pudo eliminar la empresa");
    } finally {
      setSaving(false);
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
                <h2>Editar empresa</h2>
              </div>
            </div>

            {loading ? (
              <p className="empresa-text-EP">Cargando empresa...</p>
            ) : form ? (
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
                  Municipio ID
                  <input name="municipioId" value={form.municipioId} onChange={handleChange} />
                </label>

                <label className="empresa-full-RP">
                  Descripcion *
                  <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows="4" required />
                </label>

                <div className="empresa-full-RP">
                  <span className="empresa-label-RP">Categorias</span>
                  <div className="empresa-categories-RP">
                    {[
                      "TECNOLOGIA",
                      "SOFTWARE",
                      "SALUD",
                      "EDUCACION",
                      "FINANZAS",
                      "CONSULTORIA",
                      "MANUFACTURERA",
                      "RETAIL",
                      "MARKETING",
                      "RECURSOS_HUMANOS",
                    ].map((cat) => (
                      <label key={cat} className="empresa-category-RP">
                        <input
                          type="checkbox"
                          checked={form.categories.includes(cat)}
                          onChange={() => handleToggleCategory(cat)}
                        />
                        <span>{cat.replace(/_/g, " ")}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {error && <p className="reclutador-alert-RP error">{error}</p>}

                <div className="empresa-actions-RP">
                  <button type="submit" className="reclutador-button-RP" disabled={saving}>
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                  <button
                    type="button"
                    className="empresa-danger-RP"
                    onClick={handleDelete}
                    disabled={saving}
                  >
                    Eliminar empresa
                  </button>
                </div>
              </form>
            ) : (
              <p className="empresa-text-EP">No se encontro la empresa.</p>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

export default EmpresaEditPage;
