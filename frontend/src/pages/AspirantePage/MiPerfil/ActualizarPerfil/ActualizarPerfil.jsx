import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
User,
Mail,
Phone,
MapPin,
Calendar,
Briefcase,
FileText,
Save,
X,
AlertCircle,
CheckCircle,
Camera,
Loader
} from "lucide-react";
import Header from "../../../../components/Header/Header";
import footer from "../../../../components/Footer/footer";
import "./ActualizarPerfil.css";

const ActualizarPerfil = () => {
const navigate = useNavigate();
const idAspirante = localStorage.getItem("idAspirante");
const token = localStorage.getItem("token");

// Estados del formulario
const [formData, setFormData] = useState({
	nombre: "",
	apellido: "",
	telefono: "",
	ubicacion: "",
	fechaNacimiento: "",
	cargo: "",
	descripcion: "",
	resumen: "",
	municipioId: "",
	fotoPerfilUrl: ""
});

const [originalData, setOriginalData] = useState({});
const [municipios, setMunicipios] = useState([]);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [hasChanges, setHasChanges] = useState(false);
const [previewImage, setPreviewImage] = useState(null);

const cargarDatosPerfil = async () => {
	try {
	const data = {
		id: idAspirante || "1",
		nom: "Juan Carlos",
		ape: "Pérez González",
		tel: "3001234567",
		ubi: "Calle 123 #45-67",
		feNa: "1995-06-15",
		cargo: "Desarrollador Full Stack",
		descripcion: "Desarrollador apasionado por crear soluciones tecnológicas inclusivas y accesibles.",
		resumen: "5 años de experiencia en desarrollo web",
		municipioId: 1,
		nombreMunicipio: "Bogotá D.C",
		fotoPerfilUrl: null
	};

	// Simular delay de red
	await new Promise(resolve => setTimeout(resolve, 800));

	const formattedData = {
		nombre: data.nom || "",
		apellido: data.ape || "",
		telefono: data.tel || "",
		ubicacion: data.ubi || "",
		fechaNacimiento: data.feNa || "",
		cargo: data.cargo || "",
		descripcion: data.descripcion || "",
		resumen: data.resumen || "",
		municipioId: data.municipioId || "",
		fotoPerfilUrl: data.fotoPerfilUrl || ""
	};

	setFormData(formattedData);
	setOriginalData(formattedData);
	setPreviewImage(data.fotoPerfilUrl);
	setLoading(false);
	} catch (err) {
	console.error("Error cargando perfil:", err);
	setError("No se pudo cargar tu perfil");
	setLoading(false);
	}
};

// ============================================================
// Cargar lista de municipios
// TODO: CONECTAR CON API - Por ahora usando datos de ejemplo
// ============================================================
const cargarMunicipios = async () => {
	try {
	// ❌ COMENTADO - Llamada a API
	// const response = await fetch('http://localhost:8080/api/municipios', {
	//   method: 'GET',
	//   headers: {
	//     Authorization: `Bearer ${token}`,
	//     "Content-Type": "application/json",
	//   },
	// });

	// if (!response.ok) throw new Error("Error al cargar municipios");
	// const data = await response.json();

	// ✅ DATOS DE EJEMPLO - Simula lista de municipios
	const data = [
		{ id: 1, nombre: "BOGOTA D.C" },
		{ id: 2, nombre: "MEDELLIN" },
		{ id: 3, nombre: "BELLO" },
		{ id: 4, nombre: "ITAGUI" },
		{ id: 5, nombre: "ENVIGADO" },
		{ id: 6, nombre: "RIONEGRO" },
		{ id: 7, nombre: "CALI" },
		{ id: 8, nombre: "BARRANQUILLA" },
		{ id: 9, nombre: "BUCARAMANGA" }
	];

	setMunicipios(data);
	} catch (err) {
	console.error("Error cargando municipios:", err);
	}
};

// Detectar cambios en el formulario
useEffect(() => {
	const changed = JSON.stringify(formData) !== JSON.stringify(originalData);
	setHasChanges(changed);
}, [formData, originalData]);

// Cargar datos iniciales
useEffect(() => {
	const testId = idAspirante || "1";
	cargarDatosPerfil();
	cargarMunicipios();
}, [idAspirante]);

// ============================================================
// Manejar cambios en inputs
// ============================================================
const handleChange = (e) => {
	const { name, value } = e.target;
	setFormData(prev => ({
	...prev,
	[name]: value
	}));
	setError("");
	setSuccess("");
};

// ============================================================
// Manejar cambio de imagen de perfil
// Validación: máximo 2 MB, formatos JPG/PNG
// ============================================================
const handleImageChange = (e) => {
	const file = e.target.files[0];
	
	if (!file) return;

	// Validar tamaño (2 MB)
	if (file.size > 2 * 1024 * 1024) {
	setError("La imagen debe ser menor a 2 MB");
	return;
	}

	// Validar formato
	if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
	setError("Solo se permiten imágenes JPG o PNG");
	return;
	}

	// Crear preview
	const reader = new FileReader();
	reader.onloadend = () => {
	setPreviewImage(reader.result);
	setFormData(prev => ({
		...prev,
		fotoPerfilUrl: reader.result
	}));
	};
	reader.readAsDataURL(file);
	setError("");
};

// ============================================================
// RF03: Actualizar perfil del aspirante
// Criterios de aceptación:
// - Puedo editar todos los campos excepto correo
// - Los cambios se guardan en base de datos
// - Se muestra mensaje de confirmación
// - Formulario sin límite de tiempo
// TODO: CONECTAR CON API - Por ahora simula actualización
// ============================================================
const handleSubmit = async (e) => {
	e.preventDefault();
	setSaving(true);
	setError("");
	setSuccess("");

	// Validaciones básicas
	if (!formData.nombre.trim() || !formData.apellido.trim()) {
	setError("El nombre y apellido son obligatorios");
	setSaving(false);
	return;
	}

	if (formData.telefono && formData.telefono.length < 10) {
	setError("El teléfono debe tener al menos 10 dígitos");
	setSaving(false);
	return;
	}

	try {
	// ❌ COMENTADO - Llamada a API
	// const response = await fetch(`http://localhost:8080/api/aspirante/${idAspirante}`, {
	//   method: 'PUT',
	//   headers: {
	//     Authorization: `Bearer ${token}`,
	//     "Content-Type": "application/json",
	//   },
	//   body: JSON.stringify({
	//     nom: formData.nombre,
	//     ape: formData.apellido,
	//     tel: formData.telefono,
	//     ubi: formData.ubicacion,
	//     feNa: formData.fechaNacimiento,
	//     cargo: formData.cargo,
	//     descripcion: formData.descripcion,
	//     resumen: formData.resumen,
	//     municipioId: formData.municipioId,
	//     fotoPerfilUrl: formData.fotoPerfilUrl
	//   })
	// });

	// if (!response.ok) throw new Error("Error al actualizar perfil");
	// const updatedData = await response.json();

	// ✅ SIMULACIÓN - Por ahora simula actualización exitosa
	await new Promise(resolve => setTimeout(resolve, 1500));

	// Actualizar datos originales con los nuevos
	setOriginalData(formData);
	setSuccess("¡Perfil actualizado exitosamente!");
	
	// Scroll al inicio para ver el mensaje
	window.scrollTo({ top: 0, behavior: 'smooth' });

	// Opcional: redirigir después de 2 segundos
	setTimeout(() => {
		navigate("/Aspirante/MiPerfil");
	}, 2000);

	} catch (err) {
	console.error("Error actualizando perfil:", err);
	setError("No se pudo actualizar el perfil. Intenta de nuevo.");
	} finally {
	setSaving(false);
	}
};

// ============================================================
// Cancelar y volver sin guardar
// ============================================================
const handleCancel = () => {
	if (hasChanges) {
	if (window.confirm("¿Descartar los cambios realizados?")) {
		navigate("/Aspirante/MiPerfil");
	}
	} else {
	navigate("/Aspirante/MiPerfil");
	}
};

// Estados de carga
if (loading) {
	return (
	<div className="loading-container-APF">
		<Loader className="spinner-APF" size={48} />
		<p>Cargando tu perfil...</p>
	</div>
	);
}

return (
	<>
	<Header isLoggedIn={true} userRole="ASPIRANTE" />
	<Menu />

	<main className="main-actualizar-perfil-APF">
		<div className="container-actualizar-perfil-APF">
		
		{/* Header */}
		<div className="header-section-APF">
			<h1 className="title-APF">Actualizar Perfil</h1>
			<p className="subtitle-APF">
			Mantén tu información actualizada para mejorar tus oportunidades laborales
			</p>
		</div>

		{/* Mensajes de éxito/error */}
		{success && (
			<div className="alert-success-APF">
			<CheckCircle size={24} />
			<span>{success}</span>
			</div>
		)}

		{error && (
			<div className="alert-error-APF">
			<AlertCircle size={24} />
			<span>{error}</span>
			</div>
		)}

		<form onSubmit={handleSubmit} className="form-actualizar-APF">
			
			{/* Foto de perfil */}
			<section className="section-foto-APF">
			<h2 className="section-title-APF">
				<Camera size={24} />
				Foto de Perfil
			</h2>
			
			<div className="foto-container-APF">
				<div className="foto-preview-APF">
				{previewImage ? (
					<img src={previewImage} alt="Vista previa" />
				) : (
					<User size={64} className="foto-placeholder-icon-APF" />
				)}
				</div>
				
				<div className="foto-actions-APF">
				<label htmlFor="foto-input" className="btn-upload-APF">
					<Camera size={20} />
					Cambiar foto
				</label>
				<input
					type="file"
					id="foto-input"
					accept="image/jpeg,image/jpg,image/png"
					onChange={handleImageChange}
					className="foto-input-hidden-APF"
				/>
				<p className="foto-hint-APF">
					Máximo 2 MB - Formatos: JPG, PNG
				</p>
				</div>
			</div>
			</section>

			{/* Información Personal */}
			<section className="section-form-APF">
			<h2 className="section-title-APF">
				<User size={24} />
				Información Personal
			</h2>

			<div className="form-grid-APF">
				<div className="form-group-APF">
				<label htmlFor="nombre" className="form-label-APF">
					Nombre <span className="required-APF">*</span>
				</label>
				<input
					type="text"
					id="nombre"
					name="nombre"
					value={formData.nombre}
					onChange={handleChange}
					className="form-input-APF"
					placeholder="Tu nombre"
					required
				/>
				</div>

				<div className="form-group-APF">
				<label htmlFor="apellido" className="form-label-APF">
					Apellido <span className="required-APF">*</span>
				</label>
				<input
					type="text"
					id="apellido"
					name="apellido"
					value={formData.apellido}
					onChange={handleChange}
					className="form-input-APF"
					placeholder="Tu apellido"
					required
				/>
				</div>

				<div className="form-group-APF">
				<label htmlFor="fechaNacimiento" className="form-label-APF">
					Fecha de Nacimiento
				</label>
				<div className="input-with-icon-APF">
					<Calendar size={20} className="input-icon-APF" />
					<input
					type="date"
					id="fechaNacimiento"
					name="fechaNacimiento"
					value={formData.fechaNacimiento}
					onChange={handleChange}
					className="form-input-APF"
					max={new Date().toISOString().split('T')[0]}
					/>
				</div>
				</div>

				<div className="form-group-APF">
				<label htmlFor="cargo" className="form-label-APF">
					Cargo o Profesión
				</label>
				<div className="input-with-icon-APF">
					<Briefcase size={20} className="input-icon-APF" />
					<input
					type="text"
					id="cargo"
					name="cargo"
					value={formData.cargo}
					onChange={handleChange}
					className="form-input-APF"
					placeholder="Ej: Desarrollador Full Stack"
					/>
				</div>
				</div>
			</div>
			</section>

			{/* Información de Contacto */}
			<section className="section-form-APF">
			<h2 className="section-title-APF">
				<Phone size={24} />
				Información de Contacto
			</h2>

			<div className="form-grid-APF">
				<div className="form-group-APF">
				<label htmlFor="telefono" className="form-label-APF">
					Teléfono
				</label>
				<div className="input-with-icon-APF">
					<Phone size={20} className="input-icon-APF" />
					<input
					type="tel"
					id="telefono"
					name="telefono"
					value={formData.telefono}
					onChange={handleChange}
					className="form-input-APF"
					placeholder="3001234567"
					pattern="[0-9]{10}"
					/>
				</div>
				<span className="form-hint-APF">10 dígitos sin espacios</span>
				</div>

				<div className="form-group-APF">
				<label htmlFor="municipioId" className="form-label-APF">
					Municipio
				</label>
				<div className="input-with-icon-APF">
					<MapPin size={20} className="input-icon-APF" />
					<select
					id="municipioId"
					name="municipioId"
					value={formData.municipioId}
					onChange={handleChange}
					className="form-select-APF"
					>
					<option value="">Selecciona un municipio</option>
					{municipios.map(municipio => (
						<option key={municipio.id} value={municipio.id}>
						{municipio.nombre}
						</option>
					))}
					</select>
				</div>
				</div>

				<div className="form-group-APF form-group-full-APF">
				<label htmlFor="ubicacion" className="form-label-APF">
					Dirección
				</label>
				<div className="input-with-icon-APF">
					<MapPin size={20} className="input-icon-APF" />
					<input
					type="text"
					id="ubicacion"
					name="ubicacion"
					value={formData.ubicacion}
					onChange={handleChange}
					className="form-input-APF"
					placeholder="Calle 123 #45-67"
					/>
				</div>
				</div>
			</div>
			</section>

			{/* Información Profesional */}
			<section className="section-form-APF">
			<h2 className="section-title-APF">
				<FileText size={24} />
				Información Profesional
			</h2>

			<div className="form-group-APF">
				<label htmlFor="resumen" className="form-label-APF">
				Resumen Profesional
				</label>
				<input
				type="text"
				id="resumen"
				name="resumen"
				value={formData.resumen}
				onChange={handleChange}
				className="form-input-APF"
				placeholder="Ej: 5 años de experiencia en desarrollo web"
				maxLength="100"
				/>
				<span className="form-hint-APF">
				{formData.resumen.length}/100 caracteres
				</span>
			</div>

			<div className="form-group-APF">
				<label htmlFor="descripcion" className="form-label-APF">
				Descripción / Acerca de ti
				</label>
				<textarea
				id="descripcion"
				name="descripcion"
				value={formData.descripcion}
				onChange={handleChange}
				className="form-textarea-APF"
				placeholder="Cuéntanos sobre tu experiencia, habilidades y objetivos profesionales..."
				rows="5"
				maxLength="500"
				/>
				<span className="form-hint-APF">
				{formData.descripcion.length}/500 caracteres
				</span>
			</div>
			</section>

			{/* Botones de acción */}
			<div className="form-actions-APF">
			<button
				type="button"
				onClick={handleCancel}
				className="btn-cancel-APF"
				disabled={saving}
			>
				<X size={20} />
				Cancelar
			</button>

			<button
				type="submit"
				className="btn-submit-APF"
				disabled={saving || !hasChanges}
			>
				{saving ? (
				<>
					<Loader className="btn-spinner-APF" size={20} />
					Guardando...
				</>
				) : (
				<>
					<Save size={20} />
					Guardar Cambios
				</>
				)}
			</button>
			</div>

			{/* Indicador de cambios */}
			{hasChanges && !saving && (
			<div className="changes-indicator-APF">
				<AlertCircle size={18} />
				Tienes cambios sin guardar
			</div>
			)}
		</form>
		</div>
	</main>

	<Footer />
	</>
);
};

export default ActualizarPerfil;