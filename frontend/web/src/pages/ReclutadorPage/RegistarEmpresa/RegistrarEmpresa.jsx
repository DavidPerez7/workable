import React, { useRef, useState, useEffect } from "react";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import SidebarReclutador from "../../../components/SidebarReclutador/SidebarReclutador";
import { crearEmpresa } from "../../../api/empresaAPI";
import { getMunicipios } from "../../../api/municipioAPI";
import reclutadoresApi from "../../../api/reclutadoresApi";
import "./RegistrarEmpresa.css";

const RegistrarEmpresa = () => {
  const formRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [municipios, setMunicipios] = useState([]);

  useEffect(() => {
    const cargarMunicipios = async () => {
      try {
        const data = await getMunicipios();
        setMunicipios(data);
      } catch (error) {
        console.error("Error al cargar municipios:", error);
      }
    };
    cargarMunicipios();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const camposRequeridos = [
      "nombre",
      "nit",
      "numeroTrabajadores",
      "email",
      "telefono",
      "descripcion",
      "municipioId",
    ];

    const faltantes = camposRequeridos.filter((campo) => !data[campo]);

    if (faltantes.length > 0) {
      alert("Todos los campos marcados con * son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const categories = formData.getAll("categories");
      const empresaData = {
        nombre: data.nombre,
        nit: data.nit,
        numeroTrabajadores: Number(data.numeroTrabajadores),
        email: data.email,
        telefono: data.telefono,
        descripcion: data.descripcion,
        logoUrl: data.logoUrl || null,
        categories: categories.length > 0 ? categories : ["TECNOLOGIA"],
        municipio: { id: Number(data.municipioId) },
      };

      const response = await crearEmpresa(empresaData);
      console.log("Empresa creada:", response);

      // Asignar la empresa al reclutador logueado
      try {
        await reclutadoresApi.asignarEmpresa(response.id);
        console.log("Empresa asignada al reclutador");
      } catch (err) {
        console.warn("No se pudo asignar la empresa automáticamente:", err);
      }

      // Actualizar localStorage con los datos de la empresa
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.empresa = { id: response.id };
      user.empresaId = response.id;
      user.empresaNombre = response.nombre;
      localStorage.setItem('user', JSON.stringify(user));

      alert("Empresa registrada con éxito");
      formRef.current.reset();

      // Recargar la página para que los cambios se reflejen inmediatamente
      setTimeout(() => {
        window.location.href = "/Reclutador/EnterprisePage";
      }, 500);

    } catch (error) {
      console.error("Error al registrar empresa:", error);
      alert(`Error al registrar empresa: ${error.message}`);
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
                <h2>Registrar empresa</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} ref={formRef} className="empresa-form-RP">
              <div className="empresa-row-RP">
                <label>
                  Nombre *
                  <input type="text" name="nombre" required />
                </label>
                <label>
                  NIT *
                  <input type="text" name="nit" required />
                </label>
              </div>

              <div className="empresa-row-RP">
                <label>
                  Numero de trabajadores *
                  <input type="number" name="numeroTrabajadores" min="1" required />
                </label>
                <label>
                  Email *
                  <input type="email" name="email" required />
                </label>
              </div>

              <div className="empresa-row-RP">
                <label>
                  Telefono *
                  <input type="tel" name="telefono" required />
                </label>
                <label>
                  Logo (URL)
                  <input type="url" name="logoUrl" />
                </label>
              </div>

              <label className="empresa-full-RP">
                Descripcion *
                <textarea name="descripcion" rows="4" required />
              </label>

              <label className="empresa-full-RP">
                Municipio *
                <select name="municipioId" required>
                  <option value="">Selecciona municipio</option>
                  {municipios.map((mun) => (
                    <option key={mun.id} value={mun.id}>
                      {mun.nombre} - {mun.departamento?.nombre || ""}
                    </option>
                  ))}
                </select>
              </label>

              <div className="empresa-full-RP">
                <span className="empresa-label-RP">Categorias *</span>
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
                      <input type="checkbox" name="categories" value={cat} />
                      <span>{cat.replace(/_/g, " ")}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="reclutador-button-RP" disabled={loading}>
                {loading ? "Registrando..." : "Registrar empresa"}
              </button>
            </form>
          </section>
        </main>
      </div>
    </>
  );
};

export default RegistrarEmpresa;
