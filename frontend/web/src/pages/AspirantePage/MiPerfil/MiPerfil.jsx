import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import aspirantesApi from "../../../api/aspirantesApi";
import { getMunicipios } from "../../../api/municipioAPI";
import SidebarAspirante from "../../../components/SidebarAspirante/SidebarAspirante";
import {
  FaUser,
  FaBriefcase,
  FaWheelchair,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendar,
  FaIdCard,
} from "react-icons/fa";
import {
  CheckCircle,
  Eye,
  Rocket,
  Trash2,
  AlertCircle,
  Edit2,
  Save,
  X,
  LogOut,
} from "lucide-react";
import Header from "../../../components/Header/Header";
import Menu from "../../../components/Menu/Menu";
import Footer from "../../../components/Footer/footer";
import "./MiPerfil.css";

const MiPerfil = () => {
	const [usuario, setUsuario] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deletePassword, setDeletePassword] = useState("");
	const [deleteError, setDeleteError] = useState("");
	const [editingField, setEditingField] = useState(null);
	const [editValues, setEditValues] = useState({});
	const [savingField, setSavingField] = useState(null);
	const [municipios, setMunicipios] = useState([]);
	const [loadingMunicipios, setLoadingMunicipios] = useState(true);
	const navigate = useNavigate();

	// getPerfil - obtener usuario actual usando aspirantesApi
	const getUsuario = async () => {
		const usuarioId = localStorage.getItem("usuarioId");
		setLoading(true);
		setError(""); // limpiar errores previos

		try {
			if (!usuarioId) {
				throw new Error("No se encontró ID de usuario en sesión");
			}
			const usuario = await aspirantesApi.get(usuarioId);
			console.log("Usuario obtenido:", usuario);
			setUsuario(usuario); // Actualizar estado con datos obtenidos

		} catch (err) {
			console.error("Error obteniendo usuario:", err);
			setError(err.message || "No se pudo cargar la información del perfil. Por favor, intenta de nuevo.");
			if (err.message.includes("401") || err.message.includes("expirada") || err.message.includes("404")) {
				// Token inválido, expirado o usuario no encontrado
				localStorage.clear();
				navigate("/login");
			}

		} finally {
			setLoading(false);
		}
	};

	// deleteUsuario - eliminar cuenta usando aspirantesApi
	const eliminarCuenta = async () => {
		if (!deletePassword || deletePassword.trim().length === 0) {
			setDeleteError("Debes ingresar tu contraseña para confirmar");
			return;
		}
		const usuarioId = localStorage.getItem("usuarioId");

		try { 
			// Usar aspirantesApi.deletePublic() para eliminar
			const response = await aspirantesApi.deletePublic(usuarioId);

			//Verificar si la respuesta indica éxito
			if (response && (response.id || response.message)) {
				//Exito: limpiar estado, cerra modal, redirigir a login
				setShowDeleteModal(false);
				setDeletePassword("");
				setDeleteError("");
				localStorage.clear();
				alert("Tu cuenta ha sido eliminada exitosamente.");
				navigate("/login");
			} else {
				throw new Error("No se pudo eliminar la cuenta. Por favor, intenta de nuevo.");
			}

		} catch (error) {
			console.error("Error eliminando cuenta:", error);
			//Manejar errores específicos
			if (error.response?.status === 401) {
				setDeleteError("Token inválido o expirado. Por favor, inicia sesión nuevamente.");
				localStorage.clear();
				navigate("/login");
			} else if (error.response?.status === 403) {
				setDeleteError("No tienes permiso para eliminar esta cuenta.");
			} else {
				setDeleteError("Error al eliminar la cuenta. Por favor, intenta de nuevo.");
			}
		}
	};

	const cerrarSesion = () => {
		localStorage.clear();
		navigate("/login");
	};

	// Función para cargar municipios
	const cargarMunicipios = async () => {
		try {
			setLoadingMunicipios(true);
			const municipiosData = await getMunicipios();
			setMunicipios(municipiosData);
		} catch (error) {
			console.error("Error cargando municipios:", error);
		} finally {
			setLoadingMunicipios(false);
		}
	};

	// Funciones para editar campos
	const startEditing = (field, value) => {
		setEditingField(field);
		if (field === 'municipio') {
			// Para municipio, guardamos el ID del municipio actual
			const currentMunicipioId = usuario?.municipio?.id;
			setEditValues({ ...editValues, municipio: currentMunicipioId || "" });
		} else {
			setEditValues({ ...editValues, [field]: value || "" });
		}
	};

	const cancelEditing = () => {
		setEditingField(null);
		setEditValues({});
	};

	// Cargar municipios al montar el componente
	useEffect(() => {
		cargarMunicipios();
	}, []);

	const saveField = async (field) => {
		const usuarioId = localStorage.getItem("usuarioId");
		
		setSavingField(field);
		
		try {
			let updateData;
			
			if (field === 'municipio') {
				// Para municipio, enviar el ID del municipio seleccionado
				updateData = {
					municipioId: parseInt(editValues[field])
				};
			} else {
				updateData = {
					[field]: editValues[field]
				};
			}
			
			// Llamar a aspirantesApi para actualizar
			const updatedUsuario = await aspirantesApi.update(usuarioId, updateData);
			
			// Actualizar el estado local con los datos recibidos del servidor
			setUsuario(updatedUsuario);
			setEditingField(null);
			setEditValues({});
			alert("Campo actualizado exitosamente");
		} catch (err) {
			console.error("Error actualizando campo:", err);
			alert("Error al actualizar: " + (err.message || "Por favor, intenta de nuevo."));
		} finally {
			setSavingField(null);
		}
	};

	useEffect(() => {
		getUsuario();
	}, []);

	if (loading) {
		return (
			<div className="loading-container">
			<div className="spinner"></div>
			<p>Cargando tu perfil...</p>
			</div>
		);
	}

	if (error && !usuario) {
		return (
			<div className="error-container">
			<AlertCircle size={48} className="error-icon" />
			<h2>Error al cargar perfil</h2>
			<p>{error}</p>
			<button
				onClick={() => getUsuario()}
				className="btn-retry"
			>
				Reintentar
			</button>
			</div>
		);
	}

	return (
	<>
		<Header isLoggedIn={true} userRole="ASPIRANTE" />
		<Menu />

		<div style={{display: 'flex', minHeight: 'calc(100vh - 80px)'}}>
			<SidebarAspirante />
			
			<main className="main-perfil-MPF">
			<div className="container-perfil-MPF">
				{/* Encabezado del Perfil */}
				<section className="profile-header-MPF">
				<div className="profile-pic-MPF">
					{usuario?.urlFotoPerfil ? (
					<img
						src={usuario.urlFotoPerfil}
						alt={`${usuario.nombre} ${usuario.apellido}`}
						onError={(e) => {
						e.target.style.display = "none";
						e.target.nextSibling.style.display = "flex";
						}}
					/>
					) : null}
					<div className="profile-pic-placeholder-MPF">
					<FaUser size={64} />
					</div>
				</div>

			<div className="profile-info-MPF">
				<div className="profile-name-section-MPF">
					{editingField === 'nombre' || editingField === 'apellido' ? (
						<div className="edit-name-section-MPF">
							<input
								type="text"
								placeholder="Nombre"
								value={editValues.nombre !== undefined ? editValues.nombre : usuario?.nombre || ''}
								onChange={(e) => setEditValues({...editValues, nombre: e.target.value})}
								className="info-input-MPF edit-name-input-MPF"
							/>
							<input
								type="text"
								placeholder="Apellido"
								value={editValues.apellido !== undefined ? editValues.apellido : usuario?.apellido || ''}
								onChange={(e) => setEditValues({...editValues, apellido: e.target.value})}
								className="info-input-MPF edit-name-input-MPF"
							/>
							<div className="edit-actions-MPF">
								<button
									onClick={() => {
										saveField('nombre');
										saveField('apellido');
									}}
									className="btn-edit-save-MPF"
									disabled={savingField === 'nombre' || savingField === 'apellido'}
								>
									<Save size={16} />
								</button>
								<button
									onClick={cancelEditing}
									className="btn-edit-cancel-MPF"
								>
									<X size={16} />
								</button>
							</div>
						</div>
					) : (
						<div className="profile-name-display-MPF">
							<h1 className="profile-name-MPF">
								{usuario?.nombre} {usuario?.apellido}
							</h1>
							<button
								onClick={() => startEditing('nombre', usuario?.nombre)}
								className="btn-edit-MPF btn-edit-name-MPF"
								title="Editar nombre"
							>
								<Edit2 size={18} />
							</button>
						</div>
					)}
				</div>
				<div className="profile-status-MPF">
					<CheckCircle size={20} className="icon-check" />
					<span>Perfil activo</span>
				</div>
			</div>
			</section>

			{/* Grid de Información en Tarjetas */}
			<div className="profile-grid-MPF">
				{/* Tarjeta: Información de Contacto */}
				<section className="card-info-MPF">
					<div className="card-header-MPF">
						<FaPhone className="card-icon" />
						<h2 className="card-title-MPF">Información de Contacto</h2>
					</div>
					<div className="info-list-MPF">
						{/* Correo Electrónico */}
						<div className="info-item-MPF">
							<div className="info-field-wrapper-MPF">
								<div>
									<label className="info-label">Correo Electrónico</label>
									{editingField === 'correo' ? (
										<input
											type="email"
											value={editValues.correo}
											onChange={(e) => setEditValues({...editValues, correo: e.target.value})}
											className="info-input-MPF"
										/>
									) : (
										<p className="info-value">{usuario?.correo || "No registrado"}</p>
									)}
								</div>
								<div className="edit-actions-MPF">
									{editingField === 'correo' ? (
										<>
											<button
												onClick={() => saveField('correo')}
												className="btn-edit-save-MPF"
												disabled={savingField === 'correo'}
											>
												<Save size={16} />
											</button>
											<button
												onClick={cancelEditing}
												className="btn-edit-cancel-MPF"
											>
												<X size={16} />
											</button>
										</>
									) : (
										<button
											onClick={() => startEditing('correo', usuario?.correo)}
											className="btn-edit-MPF"
										>
											<Edit2 size={16} />
										</button>
									)}
								</div>
							</div>
						</div>

						{/* Teléfono */}
						<div className="info-item-MPF">
							<div className="info-field-wrapper-MPF">
								<div>
									<label className="info-label">Teléfono</label>
									{editingField === 'telefono' ? (
										<input
											type="tel"
											value={editValues.telefono}
											onChange={(e) => setEditValues({...editValues, telefono: e.target.value})}
											className="info-input-MPF"
										/>
									) : (
										<p className="info-value">{usuario?.telefono || "No registrado"}</p>
									)}
								</div>
								<div className="edit-actions-MPF">
									{editingField === 'telefono' ? (
										<>
											<button
												onClick={() => saveField('telefono')}
												className="btn-edit-save-MPF"
												disabled={savingField === 'telefono'}
											>
												<Save size={16} />
											</button>
											<button
												onClick={cancelEditing}
												className="btn-edit-cancel-MPF"
											>
												<X size={16} />
											</button>
										</>
									) : (
										<button
											onClick={() => startEditing('telefono', usuario?.telefono)}
											className="btn-edit-MPF"
										>
											<Edit2 size={16} />
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Tarjeta: Información Personal */}
				<section className="card-info-MPF">
					<div className="card-header-MPF">
						<FaUser className="card-icon" />
						<h2 className="card-title-MPF">Información Personal</h2>
					</div>
					<div className="info-list-MPF">
						{/* Género */}
						<div className="info-item-MPF">
							<div className="info-field-wrapper-MPF">
								<div>
									<label className="info-label">Género</label>
									{editingField === 'genero' ? (
										<select
											value={editValues.genero}
											onChange={(e) => setEditValues({...editValues, genero: e.target.value})}
											className="info-input-MPF"
										>
											<option value="">Seleccionar</option>
											<option value="MASCULINO">Masculino</option>
											<option value="FEMENINO">Femenino</option>
											<option value="OTRO">Otro</option>
										</select>
									) : (
										<p className="info-value">{usuario?.genero || "No especificado"}</p>
									)}
								</div>
								<div className="edit-actions-MPF">
									{editingField === 'genero' ? (
										<>
											<button
												onClick={() => saveField('genero')}
												className="btn-edit-save-MPF"
												disabled={savingField === 'genero'}
											>
												<Save size={16} />
											</button>
											<button
												onClick={cancelEditing}
												className="btn-edit-cancel-MPF"
											>
												<X size={16} />
											</button>
										</>
									) : (
										<button
											onClick={() => startEditing('genero', usuario?.genero)}
											className="btn-edit-MPF"
										>
											<Edit2 size={16} />
										</button>
									)}
								</div>
							</div>
						</div>

						<div className="info-item-MPF">
							<div className="info-field-wrapper-MPF">
								<div>
									<label className="info-label">Fecha de Nacimiento</label>
									{editingField === 'fechaNacimiento' ? (
										<input
											type="date"
											value={editValues.fechaNacimiento}
											onChange={(e) => setEditValues({...editValues, fechaNacimiento: e.target.value})}
											className="info-input-MPF"
										/>
									) : (
										<p className="info-value">
											{usuario?.fechaNacimiento 
												? new Date(usuario.fechaNacimiento).toLocaleDateString('es-CO', {
													year: 'numeric',
													month: 'long',
													day: 'numeric'
												})
												: "No registrada"
											}
										</p>
									)}
								</div>
								<div className="edit-actions-MPF">
									{editingField === 'fechaNacimiento' ? (
										<>
											<button
												onClick={() => saveField('fechaNacimiento')}
												className="btn-edit-save-MPF"
												disabled={savingField === 'fechaNacimiento'}
											>
												<Save size={16} />
											</button>
											<button
												onClick={cancelEditing}
												className="btn-edit-cancel-MPF"
											>
												<X size={16} />
											</button>
										</>
									) : (
										<button
											onClick={() => startEditing('fechaNacimiento', usuario?.fechaNacimiento)}
											className="btn-edit-MPF"
										>
											<Edit2 size={16} />
										</button>
									)}
								</div>
							</div>
						</div>

						<div className="info-item-MPF">
							<label className="info-label">Cuenta Creada</label>
							<p className="info-value">
								{usuario?.fechaCreacion 
									? new Date(usuario.fechaCreacion).toLocaleDateString('es-CO', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})
									: "Fecha no disponible"
								}
							</p>
						</div>
					</div>
				</section>

				{/* Tarjeta: Ubicación */}
				<section className="card-info-MPF">
					<div className="card-header-MPF">
						<FaMapMarkerAlt className="card-icon" />
						<h2 className="card-title-MPF">Ubicación</h2>
					</div>
					<div className="info-list-MPF">
						{/* Municipio */}
						<div className="info-item-MPF">
							<div className="info-field-wrapper-MPF">
								<div>
									<label className="info-label">Municipio</label>
									{editingField === 'municipio' ? (
										<select
											value={editValues.municipio}
											onChange={(e) => setEditValues({...editValues, municipio: e.target.value})}
											className="info-input-MPF"
											disabled={loadingMunicipios}
										>
											<option value="">
												{loadingMunicipios ? "Cargando municipios..." : "Selecciona un municipio"}
											</option>
											{municipios.map((municipio) => (
												<option key={municipio.id} value={municipio.id}>
													{municipio.nombre}
												</option>
											))}
										</select>
									) : (
										<p className="info-value">{usuario?.municipio?.nombre || "No registrado"}</p>
									)}
								</div>
								<div className="edit-actions-MPF">
									{editingField === 'municipio' ? (
										<>
											<button
												onClick={() => saveField('municipio')}
												className="btn-edit-save-MPF"
												disabled={savingField === 'municipio'}
											>
												<Save size={16} />
											</button>
											<button
												onClick={cancelEditing}
												className="btn-edit-cancel-MPF"
											>
												<X size={16} />
											</button>
										</>
									) : (
										<button
											onClick={() => startEditing('municipio', usuario?.municipio?.nombre)}
											className="btn-edit-MPF"
										>
											<Edit2 size={16} />
										</button>
									)}
								</div>
							</div>
						</div>

						{/* Departamento */}
						<div className="info-item-MPF">
							<div className="info-field-wrapper-MPF">
								<div>
									<label className="info-label">Departamento</label>
									<p className="info-value">
										{editingField === 'municipio' && editValues.municipio
											? municipios.find(m => m.id === parseInt(editValues.municipio))?.departamento || "No registrado"
											: usuario?.municipio?.departamento || "No registrado"
										}
									</p>
								</div>
								<div className="edit-actions-MPF">
									{/* El departamento se actualiza automáticamente con el municipio */}
								</div>
							</div>
						</div>

						<div className="info-item-MPF">
							<label className="info-label">Estado de Cuenta</label>
							<p className="info-value">
								<span className={`status-badge-MPF ${usuario?.isActive ? 'active' : 'inactive'}`}>
									{usuario?.isActive ? '✓ Activa' : '✗ Inactiva'}
								</span>
							</p>
						</div>
					</div>
				</section>
			</div>

			{/* Descripción Personal */}
			{usuario?.descripcion && (
				<section className="card-info-MPF card-full-MPF">
					<div className="card-header-MPF">
						<FaBriefcase className="card-icon" />
						<h2 className="card-title-MPF">Acerca de Mí</h2>
					</div>
					<p className="summary-text-MPF">{usuario.descripcion}</p>
				</section>
			)}

			{/* Tarjeta: Información Profesional */}
			{(usuario?.experienciaLaboral?.length > 0 || usuario?.estudios?.length > 0) && (
				<section className="card-info-MPF card-full-MPF">
					<div className="card-header-MPF">
						<FaBriefcase className="card-icon" />
						<h2 className="card-title-MPF">Información Profesional</h2>
					</div>
					
					{/* Experiencia Laboral */}
					{usuario?.experienciaLaboral?.length > 0 && (
						<div className="professional-section-MPF">
							<h3 className="subsection-title-MPF">Experiencia Laboral</h3>
							<div className="professional-list-MPF">
								{usuario.experienciaLaboral.map((exp, index) => (
									<div key={index} className="professional-item-MPF">
										<div className="item-header-MPF">
											<h4 className="item-title-MPF">{exp.cargo || exp.puesto}</h4>
											<span className="item-company-MPF">{exp.empresa}</span>
										</div>
										<p className="item-description-MPF">{exp.descripcion}</p>
										<div className="item-dates-MPF">
											<span>{new Date(exp.fechaInicio).toLocaleDateString('es-CO', { year: 'numeric', month: 'short' })}</span>
											<span>→</span>
											<span>{exp.fechaFin ? new Date(exp.fechaFin).toLocaleDateString('es-CO', { year: 'numeric', month: 'short' }) : 'Actualmente'}</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Educación */}
					{usuario?.estudios?.length > 0 && (
						<div className="professional-section-MPF">
							<h3 className="subsection-title-MPF">Educación</h3>
							<div className="professional-list-MPF">
								{usuario.estudios.map((estudio, index) => (
									<div key={index} className="professional-item-MPF">
										<div className="item-header-MPF">
											<h4 className="item-title-MPF">{estudio.titulo}</h4>
											<span className="item-company-MPF">{estudio.institucion}</span>
										</div>
										<p className="item-level-MPF">Nivel: {estudio.nivel}</p>
										<div className="item-dates-MPF">
											<span>{new Date(estudio.fechaInicio).getFullYear()}</span>
											<span>→</span>
											<span>{estudio.fechaFin ? new Date(estudio.fechaFin).getFullYear() : 'En progreso'}</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</section>
			)}

			{/* Tarjeta: Habilidades */}
			{usuario?.habilidades?.length > 0 && (
				<section className="card-info-MPF card-full-MPF">
					<div className="card-header-MPF">
						<FaWheelchair className="card-icon" />
						<h2 className="card-title-MPF">Habilidades</h2>
					</div>
					<div className="skills-grid-MPF">
						{usuario.habilidades.map((habilidad, index) => (
							<span key={index} className="skill-badge-MPF">
								{typeof habilidad === 'string' ? habilidad : habilidad.nombre}
							</span>
						))}
					</div>
				</section>
			)}

			{/* Resumen */}
			{usuario?.resumen && (
				<section className="card-info-MPF card-full-MPF">
					<div className="card-header-MPF">
						<FaBriefcase className="card-icon" />
						<h2 className="card-title-MPF">Resumen Profesional</h2>
					</div>
					<p className="summary-text-MPF">{usuario.resumen}</p>
				</section>
			)}

			{/* Acciones Rápidas */}
			<section className="quick-actions-MPF">
			<h2>Acciones</h2>
			<div className="actions-grid-MPF">
				<Link to="/Aspirante/MiPerfil/MisPostulaciones" className="action-card-MPF">
				<Rocket size={32} className="action-icon" />
				<h3>Mis Postulaciones</h3>
				<p>Revisa el estado de tus aplicaciones</p>
				</Link>

				<Link to="/Aspirante/MiPerfil/HojaDeVida" className="action-card-MPF">
				<Eye size={32} className="action-icon" />
				<h3>Ver Mi Hoja de Vida</h3>
				<p>Mira cómo te ven los reclutadores</p>
				</Link>

				<button
				onClick={cerrarSesion}
				className="action-card-MPF action-warning-MPF"
				>
				<LogOut size={32} className="action-icon" />
				<h3>Cerrar Sesión</h3>
				<p>Cierra tu sesión en la plataforma</p>
				</button>

				<button
				onClick={() => setShowDeleteModal(true)}
				className="action-card-MPF action-danger-MPF"
				>
				<Trash2 size={32} className="action-icon" />
				<h3>Eliminar Cuenta</h3>
				<p>Elimina permanentemente tu perfil</p>
				</button>
			</div>
			</section>
		</div>

		{/* Modal de Confirmación para Eliminar Cuenta (RF04) */}
		{showDeleteModal && (
		<div
			className="modal-overlay-MPF"
			onClick={() => setShowDeleteModal(false)}
		>
			<div
			className="modal-content-MPF"
			onClick={(e) => e.stopPropagation()}
			>
			<div className="modal-header-MPF">
				<AlertCircle size={48} className="modal-icon-danger" />
				<h2>¿Eliminar cuenta?</h2>
			</div>

			<div className="modal-body-MPF">
				<p className="warning-text-MPF">
				Esta acción es <strong>permanente e irreversible</strong>.
				</p>
				<p>Se eliminarán:</p>
				<ul className="delete-list-MPF">
				<li>✓ Tu información personal</li>
				<li>✓ Todas tus postulaciones</li>
				<li>✓ Tu hoja de vida</li>
				<li>✓ Tus valoraciones</li>
				</ul>

				<div className="form-group-MPF">
				<label htmlFor="delete-password">
					Ingresa tu contraseña para confirmar:
				</label>
				<input
					type="password"
					id="delete-password"
					value={deletePassword}
					onChange={(e) => {
					setDeletePassword(e.target.value);
					setDeleteError("");
					}}
					placeholder="Tu contraseña"
					className="input-delete-MPF"
					autoFocus
				/>
				{deleteError && (
					<span className="error-message-MPF">{deleteError}</span>
				)}
				</div>
			</div>

			<div className="modal-footer-MPF">
				<button
				onClick={() => {
					setShowDeleteModal(false);
					setDeletePassword("");
					setDeleteError("");
				}}
				className="btn-cancel-MPF"
				>
				Cancelar
				</button>
				<button
				onClick={eliminarCuenta}
				className="btn-delete-MPF"
				disabled={!deletePassword}
				>
				Eliminar mi cuenta
				</button>
			</div>
			</div>
		</div>
		)}
		</main>
		</div>

		<Footer />
	</>
	);

};

export default MiPerfil;