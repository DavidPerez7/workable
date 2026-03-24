import React, { useRef, useState, useEffect } from "react";
import { crearEmpresa } from "../../../api/empresaAPI";
import { getMunicipios } from "../../../api/municipioAPI";
import reclutadoresApi from "../../../api/reclutadoresApi";
import ReclutadorLayout from "../ReclutadorLayout";
import ReclutadorButton from "../../../components/reclutador/ReclutadorButton";
import ReclutadorCard from "../../../components/reclutador/ReclutadorCard";
import ReclutadorFormField from "../../../components/reclutador/ReclutadorFormField";
import ReclutadorSectionHeader from "../../../components/reclutador/ReclutadorSectionHeader";
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
        window.location.href = "/Reclutador/Empresa";
      }, 500);

    } catch (error) {
      console.error("Error al registrar empresa:", error);
      alert(`Error al registrar empresa: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReclutadorLayout>
      <ReclutadorCard>
        <ReclutadorSectionHeader kicker="Empresa" title="Registrar empresa" />

        <form onSubmit={handleSubmit} ref={formRef} className="empresa-form-RP">
          <div className="empresa-row-RP">
            <ReclutadorFormField label="Nombre *">
              <input type="text" name="nombre" required className="reclutador-input-RP" />
            </ReclutadorFormField>
            <ReclutadorFormField label="NIT *">
              <input type="text" name="nit" required className="reclutador-input-RP" />
            </ReclutadorFormField>
          </div>

          <div className="empresa-row-RP">
            <ReclutadorFormField label="Numero de trabajadores *">
              <input type="number" name="numeroTrabajadores" min="1" required className="reclutador-input-RP" />
            </ReclutadorFormField>
            <ReclutadorFormField label="Email *">
              <input type="email" name="email" required className="reclutador-input-RP" />
            </ReclutadorFormField>
          </div>

          <div className="empresa-row-RP">
            <ReclutadorFormField label="Telefono *">
              <input type="tel" name="telefono" required className="reclutador-input-RP" />
            </ReclutadorFormField>
            <ReclutadorFormField label="Logo (URL)">
              <input type="url" name="logoUrl" className="reclutador-input-RP" />
            </ReclutadorFormField>
          </div>

          <ReclutadorFormField label="Descripcion *">
            <textarea name="descripcion" rows="4" required className="reclutador-textarea-RP" />
          </ReclutadorFormField>

          <ReclutadorFormField label="Municipio *">
            <select name="municipioId" required className="reclutador-select-RP">
              <option value="">Selecciona municipio</option>
              {municipios.map((mun) => (
                <option key={mun.id} value={mun.id}>
                  {mun.nombre} - {mun.departamento?.nombre || ""}
                </option>
              ))}
            </select>
          </ReclutadorFormField>

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

          <ReclutadorButton type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrar empresa"}
          </ReclutadorButton>
        </form>
      </ReclutadorCard>
    </ReclutadorLayout>
  );
};

export default RegistrarEmpresa;
