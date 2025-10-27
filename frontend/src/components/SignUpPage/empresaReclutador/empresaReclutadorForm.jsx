import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { crearEmpresa } from "../../../api/empresaAPI";
import { crearReclutador } from "../../../api/reclutadoresApi";
import './empresaReclutadorForm.css';

const EmpresaReclutadorForm = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([
    { id: 1, nombre: 'TECNOLOGIA' },
    { id: 2, nombre: 'SALUD' },
    { id: 3, nombre: 'EDUCACION' },
    { id: 4, nombre: 'FINANZAS' },
    { id: 5, nombre: 'COMERCIO' },
    { id: 6, nombre: 'ALIMENTICIOS' }
  ]);
  const [municipios, setMunicipios] = useState([
    { id: 1, nombre: 'BOGOTA D.C' },
    { id: 2, nombre: 'MEDELLIN' },
    { id: 3, nombre: 'BELLO' },
    { id: 4, nombre: 'ITAGUI' },
    { id: 5, nombre: 'ENVIGADO' },
    { id: 6, nombre: 'RIONEGRO' }
  ]);

  console.log("🔍 Categorías actuales:", categorias);
  console.log("🔍 Municipios actuales:", municipios);

  // Cargar categorías y municipios del backend
  useEffect(() => {
    const cargarDatos = async () => {
      // Datos de respaldo (siempre los cargamos primero)
      const categoriasRespaldo = [
        { id: 1, nombre: 'TECNOLOGIA' },
        { id: 2, nombre: 'SALUD' },
        { id: 3, nombre: 'EDUCACION' },
        { id: 4, nombre: 'FINANZAS' },
        { id: 5, nombre: 'COMERCIO' },
        { id: 6, nombre: 'ALIMENTICIOS' }
      ];
      
      const municipiosRespaldo = [
        { id: 1, nombre: 'BOGOTA D.C' },
        { id: 2, nombre: 'MEDELLIN' },
        { id: 3, nombre: 'BELLO' },
        { id: 4, nombre: 'ITAGUI' },
        { id: 5, nombre: 'ENVIGADO' },
        { id: 6, nombre: 'RIONEGRO' }
      ];
      
      // Cargar datos de respaldo inmediatamente
      setCategorias(categoriasRespaldo);
      setMunicipios(municipiosRespaldo);
      
      try {
        // Intentar cargar desde el backend
        const categoriasResponse = await fetch('http://localhost:8080/api/categoria/all');
        if (categoriasResponse.ok) {
          const categoriasData = await categoriasResponse.json();
          console.log("✅ Categorías cargadas del backend:", categoriasData);
          setCategorias(categoriasData.map(cat => ({ id: cat.categoria_id, nombre: cat.nombre })));
        }
        
        const municipiosResponse = await fetch('http://localhost:8080/api/municipio/all');
        if (municipiosResponse.ok) {
          const municipiosData = await municipiosResponse.json();
          console.log("✅ Municipios cargados del backend:", municipiosData);
          setMunicipios(municipiosData.map(mun => ({ id: mun.municipio_id, nombre: mun.nombre })));
        }
      } catch (error) {
        console.warn("⚠️ No se pudieron cargar datos del backend, usando datos de respaldo:", error);
      }
    };
    
    cargarDatos();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Validar todos los campos
    if (
      !data.nit_id ||
      !data.nombreEmpresa ||
      !data.ubicacion ||
      !data.descripcion ||
      !data.numeroTrabajadores ||
      !data.correoCorporativo ||
      !data.categoria_id ||
      !data.municipio_id ||
      !data.nombreReclutador ||
      !data.correoReclutador ||
      !data.contrasenaReclutador ||
      !data.telefonoReclutador
    ) {
      alert("❌ Todos los campos son obligatorios");
      return;
    }

    // Datos de la empresa (formato que espera el DTO del backend)
    const empresaData = {
      nit_id: Number(data.nit_id),
      nom: data.nombreEmpresa,
      ubi: data.ubicacion,
      desc: data.descripcion,
      numTrab: Number(data.numeroTrabajadores),
      correoCorp: data.correoCorporativo,
      cat_id: Number(data.categoria_id),
      munici_id: Number(data.municipio_id)
    };

    try {
      // 1. Crear la empresa primero
      console.log("🏢 Creando empresa...", empresaData);
      const empresaResponse = await crearEmpresa(empresaData);
      console.log("✅ Empresa creada:", empresaResponse);
      
      // Obtener el NIT de la empresa creada (puede venir en diferentes formatos)
      const empresaId = empresaResponse.nitId || empresaResponse.nit_id || data.nit_id;
      console.log("🆔 ID de empresa obtenido:", empresaId);

      if (!empresaId) {
        throw new Error("No se pudo obtener el ID de la empresa creada");
      }

      // 2. Crear el reclutador asociado a la empresa
      const reclutadorData = {
        nom: data.nombreReclutador,
        clave: data.contrasenaReclutador,
        corr: data.correoReclutador,
        tel: Number(data.telefonoReclutador),
        empresa_id: Number(empresaId)
      };

      console.log("👤 Creando reclutador...", reclutadorData);
      const reclutadorResponse = await crearReclutador(reclutadorData);
      console.log("✅ Reclutador creado:", reclutadorResponse);

      alert("🎉 ¡Empresa y reclutador registrados con éxito!");
      formRef.current.reset();

      // 3. Redirigir al login con el correo del reclutador pre-llenado
      navigate("/login", { 
        state: { 
          email: data.correoReclutador,
          message: "Registro exitoso. Inicia sesión con las credenciales del reclutador." 
        } 
      });

    } catch (error) {
      console.error("❌ Error en el registro:", error);
      console.error("Error completo:", error.response?.data);
      let mensajeError = "Error al registrar empresa y reclutador";

      if (error.response) {
        // El servidor respondió con un código de error
        const errorData = error.response.data;
        console.log("Respuesta del servidor:", errorData);
        
        if (typeof errorData === 'string') {
          mensajeError = errorData;
        } else if (errorData.message) {
          mensajeError = errorData.message;
        } else if (errorData.error) {
          mensajeError = errorData.error;
        } else {
          mensajeError = JSON.stringify(errorData);
        }
      } else if (error.request) {
        mensajeError = "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.";
      } else if (error.message) {
        mensajeError = error.message;
      }

      alert(`❌ ${mensajeError}`);
    }
  };

  return (
    <div className="form-empresa-reclutador">
      <h2>Registro de Empresa y Reclutador</h2>
      <form className="form-signup-unificado" onSubmit={handleSubmit} ref={formRef}>
        
        {/* SECCIÓN EMPRESA */}
        <div className="seccion-formulario">
          <h3>Información de la Empresa</h3>
          
          <div className="form-grid-ER">
            <div className="form-group-ER">
              <label htmlFor="nit_id">NIT de la empresa:</label>
              <input
                type="text"
                id="nit_id"
                name="nit_id"
                placeholder="Ej: 900123456-7"
                required
                className="input-signup"
              />
            </div>
            
            <div className="form-group-ER">
              <label htmlFor="nombreEmpresa">Nombre de la empresa:</label>
              <input
                type="text"
                id="nombreEmpresa"
                name="nombreEmpresa"
                placeholder="Ej: Tech Solutions S.A.S"
                required
                className="input-signup"
              />
            </div>
            
            <div className="form-group-ER">
              <label htmlFor="ubicacion">Ubicación:</label>
              <input
                type="text"
                id="ubicacion"
                name="ubicacion"
                placeholder="Dirección completa"
                required
                className="input-signup"
              />
            </div>
            
            <div className="form-group-ER">
              <label htmlFor="numeroTrabajadores">Número de trabajadores:</label>
              <input
                type="number"
                id="numeroTrabajadores"
                name="numeroTrabajadores"
                placeholder="Ej: 50"
                required
                className="input-signup"
                min="1"
              />
            </div>
            
            <div className="form-group-ER">
              <label htmlFor="categoria_id">Categoría:</label>
              <select id="categoria_id" name="categoria_id" required className="input-signup">
                <option value="">Selecciona categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group-ER">
              <label htmlFor="municipio_id">Municipio:</label>
              <select id="municipio_id" name="municipio_id" required className="input-signup">
                <option value="">Selecciona municipio</option>
                {municipios.map(municipio => (
                  <option key={municipio.id} value={municipio.id}>
                    {municipio.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group-ER full-width-ER">
              <label htmlFor="descripcion">Descripción de la empresa:</label>
              <textarea
                id="descripcion"
                name="descripcion"
                placeholder="Describe tu empresa, sector, actividad principal..."
                required
                className="input-signup"
                rows="3"
              />
            </div>
            
            <div className="form-group-ER full-width-ER">
              <label htmlFor="correoCorporativo">Correo corporativo:</label>
              <input
                type="email"
                id="correoCorporativo"
                name="correoCorporativo"
                placeholder="contacto@empresa.com"
                required
                className="input-signup"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN RECLUTADOR */}
        <div className="seccion-formulario">
          <h3>Información del Reclutador (Para iniciar sesión)</h3>
          
          <div className="form-grid-ER">
            <div className="form-group-ER">
              <label htmlFor="nombreReclutador">Nombre completo:</label>
              <input
                type="text"
                id="nombreReclutador"
                name="nombreReclutador"
                placeholder="Ej: Juan Pérez"
                required
                className="input-signup"
              />
            </div>
            
            <div className="form-group-ER">
              <label htmlFor="telefonoReclutador">Teléfono:</label>
              <input
                type="tel"
                id="telefonoReclutador"
                name="telefonoReclutador"
                placeholder="3001234567"
                required
                className="input-signup"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            
            <div className="form-group-ER">
              <label htmlFor="correoReclutador">Correo electrónico:</label>
              <input
                type="email"
                id="correoReclutador"
                name="correoReclutador"
                placeholder="juan.perez@empresa.com"
                required
                className="input-signup"
              />
            </div>
            
            <div className="form-group-ER">
              <label htmlFor="contrasenaReclutador">Contraseña:</label>
              <input
                type="password"
                id="contrasenaReclutador"
                name="contrasenaReclutador"
                placeholder="Mínimo 6 caracteres"
                required
                className="input-signup"
                minLength="6"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="button-submit-unificado">
          Registrar Empresa y Reclutador
        </button>
      </form>
    </div>
  );
};

export default EmpresaReclutadorForm;