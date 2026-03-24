import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Download,
	Plus,
	Save,
	Trash2,
	UserCircle2,
} from "lucide-react";
import { jsPDF } from "jspdf";
import AspiranteCard from "../../../components/aspirante/AspiranteCard";
import AspiranteSectionHeader from "../../../components/aspirante/AspiranteSectionHeader";
import AspiranteFormField from "../../../components/aspirante/AspiranteFormField";
import AspiranteButton from "../../../components/aspirante/AspiranteButton";
import AspiranteAlert from "../../../components/aspirante/AspiranteAlert";
import AspiranteLayout from "../../../pages/AspirantePage/AspiranteLayout";
import aspirantesApi from "../../../api/aspirantesApi";
import {
	getHojasDeVidaPorAspirante,
	actualizarHojaDeVida,
} from "../../../api/hojaDeVidaAPI";
import "./HojaDeVida.css";

const emptyStudy = {
	titulo: "",
	institucion: "",
	nivelEducativo: "UNIVERSITARIO",
	fechaInicio: "",
	fechaFin: "",
	certificadoUrl: "",
};

const emptyExperience = {
	cargo: "",
	empresa: "",
	fechaInicio: "",
	fechaFin: "",
	descripcion: "",
	certificadoUrl: "",
};

const formatearFecha = (fecha) => {
	if (!fecha) {
		return "";
	}

	return new Date(fecha).toISOString().slice(0, 10);
};

const normalizarLista = (lista, mapper) => Array.isArray(lista) ? lista.map(mapper) : [];

const normalizarHoja = (data) => {
	const source = Array.isArray(data) ? data[0] : data;

	if (!source) {
		return null;
	}

	return {
		id: source.id,
		resumenProfesional: source.resumenProfesional || source.resumen || "",
		telefono: source.telefono || "",
		correoElectronico: source.correoElectronico || source.contactoEmail || "",
		redSocial: source.redSocial || source.redSocial1 || "",
		estudios: normalizarLista(source.estudios, (estudio) => ({
			titulo: estudio.titulo || "",
			institucion: estudio.institucion || "",
			nivelEducativo: estudio.nivelEducativo || estudio.nivel || "UNIVERSITARIO",
			fechaInicio: formatearFecha(estudio.fechaInicio),
			fechaFin: formatearFecha(estudio.fechaFin),
			certificadoUrl: estudio.certificadoUrl || "",
		})),
		experiencias: normalizarLista(source.experiencias, (experiencia) => ({
			cargo: experiencia.cargo || "",
			empresa: experiencia.empresa || "",
			fechaInicio: formatearFecha(experiencia.fechaInicio),
			fechaFin: formatearFecha(experiencia.fechaFin),
			descripcion: experiencia.descripcion || "",
			certificadoUrl: experiencia.certificadoUrl || "",
		})),
	};
};

const serializarHoja = (hoja) => ({
	resumenProfesional: hoja.resumenProfesional,
	resumen: hoja.resumenProfesional,
	telefono: hoja.telefono,
	correoElectronico: hoja.correoElectronico,
	contactoEmail: hoja.correoElectronico,
	redSocial: hoja.redSocial,
	redSocial1: hoja.redSocial,
	estudios: hoja.estudios,
	experiencias: hoja.experiencias,
});

const formatoTexto = (valor) => valor || "No registrado";

const HojaDeVida = ({ aspiranteId: aspiranteIdProp, editable = true, LayoutComponent = AspiranteLayout }) => {
  const renderSection = (title, items, renderItem) => (
    <div className="hojaDeVida-section">
      <div className="hojaDeVida-section-title">{title}</div>
      {items.map(renderItem)}
    </div>
  );
	const navigate = useNavigate();
	const params = useParams();
	const aspiranteId = aspiranteIdProp || params.aspiranteId;
	const readOnlyMode = !editable;
	const [perfil, setPerfil] = useState(null);
	const [hoja, setHoja] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");
	const [nuevoEstudio, setNuevoEstudio] = useState(emptyStudy);
	const [nuevaExperiencia, setNuevaExperiencia] = useState(emptyExperience);

	const cargarDatos = async () => {
		const usuarioId = aspiranteId || localStorage.getItem("usuarioId");

		if (!usuarioId) {
			if (readOnlyMode) {
				setError("No se encontró la hoja de vida del aspirante.");
				setLoading(false);
				return;
			}

			navigate("/login");
			return;
		}

		try {
			setLoading(true);
			setError("");

			const [perfilData, hojaData] = await Promise.all([
				aspirantesApi.get(usuarioId),
				getHojasDeVidaPorAspirante(usuarioId),
			]);

			setPerfil(perfilData);
			setHoja(normalizarHoja(hojaData));
		} catch (err) {
			console.error("Error al cargar la hoja de vida:", err);
			setError(err.message || "No se pudo cargar la hoja de vida");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		cargarDatos();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const persistirHoja = async (nextHoja, mensajeExito) => {
		if (readOnlyMode) {
			setNotice("La hoja de vida está en modo solo lectura.");
			return;
		}

		if (!nextHoja?.id) {
			setNotice("No se encontró una hoja de vida existente para actualizar.");
			return;
		}

		try {
			setSaving(true);
			setError("");
			await actualizarHojaDeVida(nextHoja.id, serializarHoja(nextHoja));
			setHoja(nextHoja);
			setNotice(mensajeExito || "Hoja de vida actualizada.");
		} catch (err) {
			console.error("Error al guardar hoja de vida:", err);
			setError(err.message || "No se pudo guardar la hoja de vida");
		} finally {
			setSaving(false);
		}
	};

	const handleGeneralChange = (event) => {
		const { name, value } = event.target;
		setHoja((current) =>
			current
				? {
						...current,
						[name]: value,
					}
				: current
		);
	};

	const guardarGeneral = async () => {
		if (readOnlyMode) {
			return;
		}

		if (!hoja) {
			setNotice("No hay hoja de vida para actualizar.");
			return;
		}

		await persistirHoja(hoja, "Datos generales guardados.");
	};

	const agregarEstudio = async (event) => {
		event.preventDefault();

		if (readOnlyMode) {
			return;
		}

		if (!nuevoEstudio.titulo.trim() || !nuevoEstudio.institucion.trim() || !nuevoEstudio.fechaInicio) {
			setNotice("Completa título, institución y fecha de inicio para agregar el estudio.");
			return;
		}

		const nextHoja = {
			...(hoja || {}),
			estudios: [...(hoja?.estudios || []), nuevoEstudio],
		};

		await persistirHoja(nextHoja, "Estudio agregado correctamente.");
		setNuevoEstudio(emptyStudy);
	};

	const eliminarEstudio = async (index) => {
		if (readOnlyMode) {
			return;
		}

		if (!hoja) {
			return;
		}

		const nextHoja = {
			...hoja,
			estudios: hoja.estudios.filter((_, currentIndex) => currentIndex !== index),
		};

		await persistirHoja(nextHoja, "Estudio eliminado.");
	};

	const agregarExperiencia = async (event) => {
		event.preventDefault();

		if (readOnlyMode) {
			return;
		}

		if (!nuevaExperiencia.cargo.trim() || !nuevaExperiencia.empresa.trim() || !nuevaExperiencia.fechaInicio) {
			setNotice("Completa cargo, empresa y fecha de inicio para agregar la experiencia.");
			return;
		}

		const nextHoja = {
			...(hoja || {}),
			experiencias: [...(hoja?.experiencias || []), nuevaExperiencia],
		};

		await persistirHoja(nextHoja, "Experiencia agregada correctamente.");
		setNuevaExperiencia(emptyExperience);
	};

	const eliminarExperiencia = async (index) => {
		if (readOnlyMode) {
			return;
		}

		if (!hoja) {
			return;
		}

		const nextHoja = {
			...hoja,
			experiencias: hoja.experiencias.filter((_, currentIndex) => currentIndex !== index),
		};

		await persistirHoja(nextHoja, "Experiencia eliminada.");
	};

	const descargarPdf = () => {
		const doc = new jsPDF();
		const margenIzquierdo = 14;
		const anchoTexto = 180;
		let cursorY = 18;

		const agregarTitulo = (texto) => {
			doc.setFont("helvetica", "bold");
			doc.setFontSize(16);
			doc.text(texto, margenIzquierdo, cursorY);
			cursorY += 8;
		};

		const agregarSubtitulo = (texto) => {
			doc.setFont("helvetica", "bold");
			doc.setFontSize(11);
			doc.text(texto, margenIzquierdo, cursorY);
			cursorY += 6;
		};

		const agregarTexto = (texto) => {
			doc.setFont("helvetica", "normal");
			doc.setFontSize(10);
			const lineas = doc.splitTextToSize(texto, anchoTexto);
			doc.text(lineas, margenIzquierdo, cursorY);
			cursorY += lineas.length * 5 + 2;
		};

		const nuevaPaginaSiHaceFalta = () => {
			if (cursorY > 275) {
				doc.addPage();
				cursorY = 18;
			}
		};

		agregarTitulo("HOJA DE VIDA");
		agregarTexto(`Nombre: ${formatoTexto(perfil?.nombre)} ${formatoTexto(perfil?.apellido)}`);
		agregarTexto(`Correo: ${formatoTexto(perfil?.correo)}`);
		agregarTexto(`Telefono: ${formatoTexto(hoja?.telefono || perfil?.telefono)}`);
		agregarTexto(`Fecha de nacimiento: ${perfil?.fechaNacimiento ? new Date(perfil.fechaNacimiento).toLocaleDateString("es-CO") : "No registrada"}`);
		agregarTexto(`Genero: ${formatoTexto(perfil?.genero)}`);
		agregarTexto(`Municipio: ${formatoTexto(perfil?.municipio?.nombre)}`);
		agregarTexto(`URL foto perfil: ${formatoTexto(perfil?.urlFotoPerfil)}`);
		cursorY += 2;

		nuevaPaginaSiHaceFalta();
		agregarSubtitulo("Resumen profesional");
		agregarTexto(formatoTexto(hoja?.resumenProfesional));

		nuevaPaginaSiHaceFalta();
		agregarSubtitulo("Estudios");
		if (Array.isArray(hoja?.estudios) && hoja.estudios.length > 0) {
			hoja.estudios.forEach((estudio, index) => {
				nuevaPaginaSiHaceFalta();
				agregarTexto(`${index + 1}. ${formatoTexto(estudio.titulo)} - ${formatoTexto(estudio.institucion)} (${formatoTexto(estudio.nivelEducativo)})`);
				agregarTexto(`   ${formatoTexto(estudio.fechaInicio)} a ${formatoTexto(estudio.fechaFin)}`);
			});
		} else {
			agregarTexto("No hay estudios registrados.");
		}

		nuevaPaginaSiHaceFalta();
		agregarSubtitulo("Experiencia");
		if (Array.isArray(hoja?.experiencias) && hoja.experiencias.length > 0) {
			hoja.experiencias.forEach((experiencia, index) => {
				nuevaPaginaSiHaceFalta();
				agregarTexto(`${index + 1}. ${formatoTexto(experiencia.cargo)} - ${formatoTexto(experiencia.empresa)}`);
				agregarTexto(`   ${formatoTexto(experiencia.fechaInicio)} a ${formatoTexto(experiencia.fechaFin)}`);
				if (experiencia.descripcion) {
					agregarTexto(`   ${experiencia.descripcion}`);
				}
			});
		} else {
			agregarTexto("No hay experiencia registrada.");
		}

		doc.save(`hoja-de-vida-${perfil?.nombre || "aspirante"}.pdf`);
	};

	if (loading) {
		return (
			<LayoutComponent shellClassName="hoja-shell-AP" mainClassName="hoja-main-AP">
				<div className="hoja-state-AP asp-loading">Cargando hoja de vida...</div>
			</LayoutComponent>
		);
	}

	return (
		<LayoutComponent shellClassName="hoja-shell-AP" mainClassName="hoja-main-AP">
			<section className="hoja-hero-AP">
				<div className="hoja-hero-left-AP">
					<div className="hoja-avatar-AP">
						{perfil?.urlFotoPerfil ? (
							<img src={perfil.urlFotoPerfil} alt={`${perfil.nombre} ${perfil.apellido}`} />
						) : (
							<UserCircle2 size={48} />
						)}
					</div>

					<div>
							{/* Eliminado label redundante */}
						<h1>
							{perfil?.nombre} {perfil?.apellido}
						</h1>
						<p>{perfil?.municipio?.nombre || "Sin ubicación registrada"}</p>
					</div>
				</div>

				<AspiranteButton type="button" variant="secondary" onClick={descargarPdf}>
					<Download size={16} />
					Descargar PDF
				</AspiranteButton>
			</section>

			{error && <AspiranteAlert type="error">{error}</AspiranteAlert>}
			{notice && <AspiranteAlert type="success">{notice}</AspiranteAlert>}
			{!hoja && <AspiranteAlert type="warning">No se encontró una hoja de vida registrada.</AspiranteAlert>}

			<section className="hoja-grid-AP">
							<AspiranteCard className="hoja-card-AP">
								<AspiranteSectionHeader
									kicker="Información general"
									title="Contacto y resumen"
						action={!readOnlyMode ? (
							<AspiranteButton type="button" onClick={guardarGeneral} disabled={saving || !hoja}>
								<Save size={16} />
								Guardar
							</AspiranteButton>
						) : null}
					/>

					<div className="hoja-general-inline-AP">
							<div className="hoja-field-inline-AP">
								<span className="hoja-field-label-AP">Teléfono:</span>
								<span className="hoja-text-value-AP">{formatoTexto(hoja?.telefono || perfil?.telefono)}</span>
							</div>

							<div className="hoja-field-inline-AP">
								<span className="hoja-field-label-AP">Correo electrónico:</span>
								<span className="hoja-text-value-AP">{formatoTexto(hoja?.correoElectronico || perfil?.correoElectronico)}</span>
							</div>

							<div className="hoja-field-inline-AP">
								<span className="hoja-field-label-AP">Red social:</span>
								<span className="hoja-text-value-AP">{formatoTexto(hoja?.redSocial || perfil?.redSocial)}</span>
							</div>

						<AspiranteFormField label="Resumen profesional" fullWidth>
							<textarea
								name="resumenProfesional"
								rows={3}
								value={hoja?.resumenProfesional || ""}
								onChange={handleGeneralChange}
								disabled={readOnlyMode}
							/>
						</AspiranteFormField>
					</div>
				</AspiranteCard>

								<AspiranteCard className="hoja-card-AP">
									<AspiranteSectionHeader kicker="Experiencia" title={readOnlyMode ? "Experiencia" : "Agregar experiencia"} />

					{!readOnlyMode && (
					<form className="hoja-form-grid-AP" onSubmit={agregarExperiencia}>
						<AspiranteFormField label="Cargo">
							<input
								value={nuevaExperiencia.cargo}
								onChange={(event) =>
									setNuevaExperiencia((current) => ({ ...current, cargo: event.target.value }))
								}
							/>
						</AspiranteFormField>

						<AspiranteFormField label="Empresa">
							<input
								value={nuevaExperiencia.empresa}
								onChange={(event) =>
									setNuevaExperiencia((current) => ({ ...current, empresa: event.target.value }))
								}
							/>
						</AspiranteFormField>

						<AspiranteFormField label="Inicio">
							<input
								type="date"
								value={nuevaExperiencia.fechaInicio}
								onChange={(event) =>
									setNuevaExperiencia((current) => ({ ...current, fechaInicio: event.target.value }))
								}
							/>
						</AspiranteFormField>

						<AspiranteFormField label="Fin">
							<input
								type="date"
								value={nuevaExperiencia.fechaFin}
								onChange={(event) =>
									setNuevaExperiencia((current) => ({ ...current, fechaFin: event.target.value }))
								}
							/>
						</AspiranteFormField>

						<AspiranteFormField label="Descripción" fullWidth>
							<textarea
								rows={2}
								value={nuevaExperiencia.descripcion}
								onChange={(event) =>
									setNuevaExperiencia((current) => ({ ...current, descripcion: event.target.value }))
								}
							/>
						</AspiranteFormField>

						<AspiranteFormField label="Certificado URL" fullWidth>
							<input
								value={nuevaExperiencia.certificadoUrl}
								onChange={(event) =>
									setNuevaExperiencia((current) => ({ ...current, certificadoUrl: event.target.value }))
								}
							/>
						</AspiranteFormField>

						<AspiranteButton type="submit" className="full-width-AP" disabled={saving || !hoja}>
							<Plus size={16} />
							Agregar experiencia
						</AspiranteButton>
					</form>
					)}

					<div className="list-stack-AP">
						{(hoja?.experiencias || []).length === 0 ? (
							<div className="asp-empty">No hay experiencias registradas.</div>
						) : (
							(hoja?.experiencias || []).map((experiencia, index) => (
								<article key={`${experiencia.cargo}-${index}`} className="item-card-AP">
									<div className="item-top-AP">
										<div>
											<h3>{experiencia.cargo || "Sin cargo"}</h3>
											<p>{experiencia.empresa || "Empresa"}</p>
										</div>
										<div className="item-date-range-AP">
											<span className="item-date-start-AP">{experiencia.fechaInicio || "Inicio"}</span>
											<span className="item-date-end-AP">{experiencia.fechaFin || "Actualidad"}</span>
										</div>
										{!readOnlyMode && (
											<AspiranteButton type="button" variant="icon" className="danger" onClick={() => eliminarExperiencia(index)}>
												<Trash2 size={16} />
											</AspiranteButton>
										)}
									</div>
									{experiencia.descripcion && <p>{experiencia.descripcion}</p>}
								</article>
							))
						)}
					</div>
				</AspiranteCard>

				<AspiranteCard className="hoja-card-AP hoja-card-wide-AP">
					<AspiranteSectionHeader kicker="Estudios" title={readOnlyMode ? "Formación" : "Agregar formación"} />

					{!readOnlyMode && (
					<form className="hoja-form-grid-AP" onSubmit={agregarEstudio}>
						<AspiranteFormField label="Título">
							<input
								value={nuevoEstudio.titulo}
								onChange={(event) =>
									setNuevoEstudio((current) => ({ ...current, titulo: event.target.value }))
								}
							/>
						</AspiranteFormField>

						<AspiranteFormField label="Institución">
							<input
								value={nuevoEstudio.institucion}
								onChange={(event) =>
									setNuevoEstudio((current) => ({ ...current, institucion: event.target.value }))
								}
							/>
						</AspiranteFormField>

						<AspiranteFormField label="Nivel educativo">
							<select
								value={nuevoEstudio.nivelEducativo}
								onChange={(event) =>
									setNuevoEstudio((current) => ({ ...current, nivelEducativo: event.target.value }))
								}
							>
								<option value="TECNICO">Técnico</option>
								<option value="TECNOLOGICO">Tecnológico</option>
								<option value="UNIVERSITARIO">Universitario</option>
								<option value="POSGRADO">Posgrado</option>
								<option value="OTRO">Otro</option>
							</select>
						</AspiranteFormField>

						<AspiranteFormField label="Inicio">
							<input
								type="date"
								value={nuevoEstudio.fechaInicio}
								onChange={(event) =>
									setNuevoEstudio((current) => ({ ...current, fechaInicio: event.target.value }))
								}
							/>
						</AspiranteFormField>

						<AspiranteFormField label="Fin">
							<input
								type="date"
								value={nuevoEstudio.fechaFin}
								onChange={(event) =>
									setNuevoEstudio((current) => ({ ...current, fechaFin: event.target.value }))
								}
							/>
						</AspiranteFormField>

						<AspiranteFormField label="Certificado URL" fullWidth>
							<input
								value={nuevoEstudio.certificadoUrl}
								onChange={(event) =>
									setNuevoEstudio((current) => ({ ...current, certificadoUrl: event.target.value }))
								}
							/>
						</AspiranteFormField>

						<AspiranteButton type="submit" className="full-width-AP" disabled={saving || !hoja}>
							<Plus size={16} />
							Agregar estudio
						</AspiranteButton>
					</form>
					)}

					<div className="list-stack-AP">
						{(hoja?.estudios || []).length === 0 ? (
							<div className="asp-empty">No hay estudios registrados.</div>
						) : (
							(hoja?.estudios || []).map((estudio, index) => (
								<article key={`${estudio.titulo}-${index}`} className="item-card-AP">
									<div className="item-top-AP">
										<div>
											<h3>{estudio.titulo || "Sin título"}</h3>
											<p>{estudio.institucion || "Institución"}</p>
										</div>
															<div className="item-date-range-AP">
																<span className="item-date-start-AP">{estudio.fechaInicio || "Inicio"}</span>
																<span className="item-date-end-AP">{estudio.fechaFin || "Actualidad"}</span>
															</div>
										{!readOnlyMode && (
											<AspiranteButton type="button" variant="icon" className="danger" onClick={() => eliminarEstudio(index)}>
												<Trash2 size={16} />
											</AspiranteButton>
										)}
									</div>
								</article>
							))
						)}
					</div>
				</AspiranteCard>
			</section>
		</LayoutComponent>
	);
};

export default HojaDeVida;
