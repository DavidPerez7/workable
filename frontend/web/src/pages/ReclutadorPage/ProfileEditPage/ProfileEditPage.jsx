import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import SidebarReclutador from "../../../components/SidebarReclutador/SidebarReclutador";
import reclutadoresApi from "../../../api/reclutadoresApi";
import { getMunicipios } from "../../../api/municipioAPI";
import "./ProfileEditPage.css";

function ProfileEditPage() {
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    correo: "",
    telefono: "",
    urlFotoPerfil: "",
    urlBanner: "",
    municipioId: "",
    password: "",
  });
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const data = await reclutadoresApi.getMyProfile();
        const listaMunicipios = await getMunicipios();
        setMunicipios(listaMunicipios || []);
        setForm({
          id: data.id,
          nombre: data.nombre || "",
          correo: data.correo || "",
          telefono: data.telefono || "",
          urlFotoPerfil: data.urlFotoPerfil || "",
          urlBanner: data.urlBanner || "",
          municipioId: data.municipio?.id || "",
          password: "",
        });
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        setError(err.message || "No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.id) return;

    try {
      setSaving(true);
      setError("");
      const payload = {
        nombre: form.nombre,
        correo: form.correo,
        telefono: form.telefono,
        urlFotoPerfil: form.urlFotoPerfil,
        urlBanner: form.urlBanner,
        municipio: form.municipioId ? { id: Number(form.municipioId) } : null,
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      await reclutadoresApi.update(form.id, payload, form.id);
      alert("Perfil actualizado");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setError(err.message || "No se pudo actualizar el perfil");
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
                <p className="reclutador-kicker-RP">Perfil</p>
                <h2>Editar perfil</h2>
              </div>
              <Link to="/Reclutador/ReclutadorProfile" className="reclutador-link-RP">
                Volver
              </Link>
            </div>

            {loading ? (
              <p>Cargando perfil...</p>
            ) : (
              <form className="perfil-form-RP" onSubmit={handleSubmit}>
                <div className="perfil-row-RP">
                  <label>
                    Nombre *
                    <input name="nombre" value={form.nombre} onChange={handleChange} required />
                  </label>
                  <label>
                    Correo *
                    <input name="correo" type="email" value={form.correo} onChange={handleChange} required />
                  </label>
                </div>

                <div className="perfil-row-RP">
                  <label>
                    Telefono
                    <input name="telefono" value={form.telefono} onChange={handleChange} />
                  </label>
                  <label>
                    Municipio
                    <select name="municipioId" value={form.municipioId} onChange={handleChange}>
                      <option value="">Selecciona municipio</option>
                      {municipios.map((mun) => (
                        <option key={mun.id} value={mun.id}>
                          {mun.nombre} - {mun.departamento?.nombre || ""}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="perfil-row-RP">
                  <label>
                    Foto (URL)
                    <input name="urlFotoPerfil" value={form.urlFotoPerfil} onChange={handleChange} />
                  </label>
                  <label>
                    Banner (URL)
                    <input name="urlBanner" value={form.urlBanner} onChange={handleChange} />
                  </label>
                </div>

                <label className="perfil-full-RP">
                  Nueva contraseña
                  <input name="password" type="password" value={form.password} onChange={handleChange} />
                </label>

                {error && <p className="reclutador-alert-RP error">{error}</p>}

                <button type="submit" className="reclutador-button-RP" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </form>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

export default ProfileEditPage;
