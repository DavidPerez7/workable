import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Download,
	Link2,
	Mail,
	Plus,
	Save,
	Phone,
	Trash2,
	X,
	UserCircle2,
} from "lucide-react";
import { jsPDF } from "jspdf";
import AspiranteCard from "../../../components/aspirante/AspiranteCard";
import AspiranteSectionHeader from "../../../components/aspirante/AspiranteSectionHeader";
import AspiranteFormField from "../../../components/aspirante/AspiranteFormField";
import AspiranteButton from "../../../components/aspirante/AspiranteButton";
import AspiranteAlert from "../../../components/aspirante/AspiranteAlert";
import AspiranteLayout from "../../../pages/AspirantePage/AspiranteLayout";
import ReclutadorLayout from "../../../pages/ReclutadorPage/ReclutadorLayout";
import aspirantesApi from "../../../api/aspirantesApi";
import {
	getHojasDeVidaPorAspirante,
	actualizarHojaDeVida,
} from "../../../api/hojaDeVidaAPI";
import html2canvas from "html2canvas";
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

const HojaDeVida = ({ aspiranteId: aspiranteIdProp, editable = true, LayoutComponent }) => {
  // Determinar el layout basado en el rol del usuario
  const userRole = localStorage.getItem("rol");
  const FinalLayoutComponent = LayoutComponent || (userRole === "RECLUTADOR" ? ReclutadorLayout : AspiranteLayout);
  const renderSection = (title, items, renderItem) => (
    <div className="hojaDeVida-section">
      <div className="hojaDeVida-section-title">{title}</div>
      {items.map(renderItem)}
    </div>
  );
	const navigate = useNavigate();
	const params = useParams();
	const aspiranteId = aspiranteIdProp || params.aspiranteId;
	const canEdit = editable && userRole === "ASPIRANTE";
	const readOnlyMode = true;
	const pdfContentRef = useRef(null);
	const [showEditModal, setShowEditModal] = useState(false);
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
		if (!canEdit) {
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
		if (!canEdit) {
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

		if (!canEdit) {
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
		if (!canEdit) {
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

		if (!canEdit) {
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
		if (!canEdit) {
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

	const handleOpenEditModal = () => {
		if (!canEdit) {
			return;
		}

		setShowEditModal(true);
	};

	const handleCloseEditModal = () => {
		setShowEditModal(false);
		cargarDatos();
	};

	const descargarPdf = async () => {
		const contenido = pdfContentRef.current;

		if (!contenido) {
			setError("No se pudo preparar la vista para descargar el PDF.");
			return;
		}

		const clone = contenido.cloneNode(true);
		const ocultar = clone.querySelectorAll("[data-pdf-ignore='true']");
		ocultar.forEach((elemento) => elemento.remove());
		clone.style.width = "794px";
		clone.style.maxWidth = "794px";
		clone.style.minHeight = "auto";
		clone.style.padding = "0";
		clone.style.margin = "0";
		clone.style.background = "#ffffff";
		clone.style.boxSizing = "border-box";
		clone.style.overflow = "visible";
		clone.classList.add("hoja-pdf-export-AP");
		clone.style.position = "relative";
		clone.style.display = "block";
		clone.style.height = "auto";
		clone.style.maxHeight = "none";
		clone.querySelectorAll("img").forEach((imagen) => {
			imagen.style.maxWidth = "100%";
			imagen.style.height = "auto";
			imagen.style.objectFit = "cover";
		});
		clone.querySelectorAll(".hoja-card-AP, .item-card-AP").forEach((elemento) => {
			elemento.style.breakInside = "avoid";
			elemento.style.pageBreakInside = "avoid";
			elemento.style.overflow = "visible";
			elemento.style.maxHeight = "none";
		});

		const contenedorTemporal = document.createElement("div");
		contenedorTemporal.style.position = "fixed";
		contenedorTemporal.style.left = "-10000px";
		contenedorTemporal.style.top = "0";
		contenedorTemporal.style.width = "794px";
		contenedorTemporal.style.background = "#ffffff";
		contenedorTemporal.style.zIndex = "-1";
		contenedorTemporal.style.height = "auto";
		contenedorTemporal.style.overflow = "visible";
		contenedorTemporal.appendChild(clone);
		document.body.appendChild(contenedorTemporal);

		await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
		if (document.fonts?.ready) {
			await document.fonts.ready;
		}

		const canvas = await html2canvas(clone, {
			scale: 1.7,
			useCORS: true,
			backgroundColor: "#ffffff",
			width: clone.scrollWidth,
			height: clone.scrollHeight,
			windowWidth: 794,
			windowHeight: clone.scrollHeight,
			scrollY: 0,
			scrollX: 0,
		});

		document.body.removeChild(contenedorTemporal);

		const imgData = canvas.toDataURL("image/png");
		const doc = new jsPDF({
			orientation: "p",
			unit: "mm",
			format: "a4",
			compress: true,
		});

		const pageWidth = doc.internal.pageSize.getWidth();
		const pageHeight = doc.internal.pageSize.getHeight();
		const margin = 4;
		const availableWidth = pageWidth - margin * 2;
		const availableHeight = pageHeight - margin * 2;
		const imageWidth = availableWidth;
		const imageHeight = (canvas.height * imageWidth) / canvas.width;
		const pages = Math.max(1, Math.ceil(imageHeight / availableHeight));
		const finalWidth = imageWidth;
		const finalHeight = imageHeight;
		const x = margin;

		for (let pageIndex = 0; pageIndex < pages; pageIndex += 1) {
			if (pageIndex > 0) {
				doc.addPage();
			}

			const y = margin - pageIndex * availableHeight;
			doc.addImage(imgData, "PNG", x, y, finalWidth, finalHeight, undefined, "FAST");
		}

		doc.save(`hoja-de-vida-${perfil?.nombre || "aspirante"}.pdf`);
	};

	if (loading) {
		return (
			<FinalLayoutComponent shellClassName="hoja-shell-AP" mainClassName="hoja-main-AP">
				<div className="hoja-state-AP asp-loading">Cargando hoja de vida...</div>
			</FinalLayoutComponent>
		);
	}

	return (
		<FinalLayoutComponent shellClassName="hoja-shell-AP" mainClassName="hoja-main-AP">
			<div ref={pdfContentRef} className="hoja-pdf-content-AP">
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

				<div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
					<AspiranteButton type="button" variant="secondary" onClick={descargarPdf} data-pdf-ignore="true">
						<Download size={16} />
						Descargar PDF
					</AspiranteButton>
					{canEdit && (
						<AspiranteButton type="button" variant="secondary" onClick={handleOpenEditModal} data-pdf-ignore="true">
							Editar HDV
						</AspiranteButton>
					)}
				</div>
			</section>

			{error && (
				<div data-pdf-ignore="true">
					<AspiranteAlert type="error">{error}</AspiranteAlert>
				</div>
			)}
			{notice && (
				<div data-pdf-ignore="true">
					<AspiranteAlert type="success">{notice}</AspiranteAlert>
				</div>
			)}
			{!hoja && (
				<div data-pdf-ignore="true">
					<AspiranteAlert type="warning">No se encontró una hoja de vida registrada.</AspiranteAlert>
				</div>
			)}

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

					<div className="hoja-contact-grid-AP">
						<div className="hoja-contact-item-AP">
							<div className="hoja-contact-head-AP">
								<Phone size={16} />
								<span>Teléfono</span>
							</div>
							{readOnlyMode ? (
								<p className="hoja-contact-value-AP">{formatoTexto(hoja?.telefono || perfil?.telefono)}</p>
							) : (
								<input name="telefono" value={hoja?.telefono || ""} onChange={handleGeneralChange} />
							)}
						</div>

						<div className="hoja-contact-item-AP">
							<div className="hoja-contact-head-AP">
								<Mail size={16} />
								<span>Correo electrónico</span>
							</div>
							{readOnlyMode ? (
								<p className="hoja-contact-value-AP">{formatoTexto(hoja?.correoElectronico || perfil?.correoElectronico)}</p>
							) : (
								<input name="correoElectronico" value={hoja?.correoElectronico || ""} onChange={handleGeneralChange} />
							)}
						</div>

						<div className="hoja-contact-item-AP">
							<div className="hoja-contact-head-AP">
								<Link2 size={16} />
								<span>Red social</span>
							</div>
							{readOnlyMode ? (
								<p className="hoja-contact-value-AP">{formatoTexto(hoja?.redSocial || perfil?.redSocial)}</p>
							) : (
								<input name="redSocial" value={hoja?.redSocial || ""} onChange={handleGeneralChange} />
							)}
						</div>

						<div className="hoja-summary-box-AP">
							<AspiranteFormField label="Resumen profesional" fullWidth>
								<textarea
									name="resumenProfesional"
									rows={4}
									value={hoja?.resumenProfesional || ""}
									onChange={handleGeneralChange}
									disabled={readOnlyMode}
								/>
							</AspiranteFormField>
						</div>
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
											<div className="item-date-row-AP">
												<span className="item-date-start-AP">{experiencia.fechaInicio || "Inicio"}</span>
												<span className="item-date-end-AP">{experiencia.fechaFin || "Actualidad"}</span>
											</div>
											{experiencia.certificadoUrl ? (
												<a className="item-certificate-AP" href={experiencia.certificadoUrl} target="_blank" rel="noreferrer">
													Ver certificado
												</a>
											) : (
												<span className="item-certificate-AP item-certificate-AP--empty">Sin certificado</span>
											)}
										</div>
										{!readOnlyMode && (
											<AspiranteButton type="button" variant="icon" className="danger" onClick={() => eliminarExperiencia(index)}>
												<Trash2 size={16} />
											</AspiranteButton>
										)}
									</div>
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
																<div className="item-date-row-AP">
																	<span className="item-date-start-AP">{estudio.fechaInicio || "Inicio"}</span>
																	<span className="item-date-end-AP">{estudio.fechaFin || "Actualidad"}</span>
																</div>
																{estudio.certificadoUrl ? (
																	<a className="item-certificate-AP" href={estudio.certificadoUrl} target="_blank" rel="noreferrer">
																		Ver certificado
																	</a>
																) : (
																	<span className="item-certificate-AP item-certificate-AP--empty">Sin certificado</span>
																)}
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
			</div>

			{showEditModal && canEdit && (
				<div className="hoja-modal-overlay-AP" onClick={handleCloseEditModal}>
					<div className="hoja-modal-AP" onClick={(event) => event.stopPropagation()}>
						<div className="hoja-modal-header-AP">
							<div>
								<p className="hoja-kicker-AP">Edición</p>
								<h2>Editar hoja de vida</h2>
							</div>
							<button type="button" className="hoja-modal-close-AP" onClick={handleCloseEditModal}>
								<X size={18} />
							</button>
						</div>

						<div className="hoja-modal-body-AP">
							<AspiranteCard className="hoja-card-AP hoja-modal-card-AP">
								<AspiranteSectionHeader kicker="Información general" title="Contacto y resumen" action={<AspiranteButton type="button" onClick={guardarGeneral} disabled={saving || !hoja}><Save size={16} />Guardar cambios</AspiranteButton>} />
								<div className="hoja-contact-grid-AP">
									<div className="hoja-contact-item-AP"><div className="hoja-contact-head-AP"><Phone size={16} /><span>Teléfono</span></div><input name="telefono" value={hoja?.telefono || ""} onChange={handleGeneralChange} /></div>
									<div className="hoja-contact-item-AP"><div className="hoja-contact-head-AP"><Mail size={16} /><span>Correo electrónico</span></div><input name="correoElectronico" value={hoja?.correoElectronico || ""} onChange={handleGeneralChange} /></div>
									<div className="hoja-contact-item-AP"><div className="hoja-contact-head-AP"><Link2 size={16} /><span>Red social</span></div><input name="redSocial" value={hoja?.redSocial || ""} onChange={handleGeneralChange} /></div>
									<div className="hoja-summary-box-AP"><AspiranteFormField label="Resumen profesional" fullWidth><textarea name="resumenProfesional" rows={4} value={hoja?.resumenProfesional || ""} onChange={handleGeneralChange} /></AspiranteFormField></div>
								</div>
							</AspiranteCard>

							<AspiranteCard className="hoja-card-AP hoja-modal-card-AP">
								<AspiranteSectionHeader kicker="Experiencia" title="Administrar experiencia" />
								<form className="hoja-form-grid-AP hoja-modal-form-AP" onSubmit={agregarExperiencia}>
									<AspiranteFormField label="Cargo"><input value={nuevaExperiencia.cargo} onChange={(event) => setNuevaExperiencia((current) => ({ ...current, cargo: event.target.value }))} /></AspiranteFormField>
									<AspiranteFormField label="Empresa"><input value={nuevaExperiencia.empresa} onChange={(event) => setNuevaExperiencia((current) => ({ ...current, empresa: event.target.value }))} /></AspiranteFormField>
									<AspiranteFormField label="Inicio"><input type="date" value={nuevaExperiencia.fechaInicio} onChange={(event) => setNuevaExperiencia((current) => ({ ...current, fechaInicio: event.target.value }))} /></AspiranteFormField>
									<AspiranteFormField label="Fin"><input type="date" value={nuevaExperiencia.fechaFin} onChange={(event) => setNuevaExperiencia((current) => ({ ...current, fechaFin: event.target.value }))} /></AspiranteFormField>
									<AspiranteFormField label="Certificado URL" fullWidth><input value={nuevaExperiencia.certificadoUrl} onChange={(event) => setNuevaExperiencia((current) => ({ ...current, certificadoUrl: event.target.value }))} /></AspiranteFormField>
									<AspiranteButton type="submit" className="full-width-AP" disabled={saving || !hoja}><Plus size={16} />Agregar experiencia</AspiranteButton>
								</form>
								<div className="list-stack-AP">{(hoja?.experiencias || []).length === 0 ? <div className="asp-empty">No hay experiencias registradas.</div> : (hoja?.experiencias || []).map((experiencia, index) => (<article key={`${experiencia.cargo}-${index}`} className="item-card-AP"><div className="item-top-AP"><div><h3>{experiencia.cargo || "Sin cargo"}</h3><p>{experiencia.empresa || "Empresa"}</p></div><div className="item-date-range-AP"><div className="item-date-row-AP"><span className="item-date-start-AP">{experiencia.fechaInicio || "Inicio"}</span><span className="item-date-end-AP">{experiencia.fechaFin || "Actualidad"}</span></div>{experiencia.certificadoUrl ? <a className="item-certificate-AP" href={experiencia.certificadoUrl} target="_blank" rel="noreferrer">Ver certificado</a> : <span className="item-certificate-AP item-certificate-AP--empty">Sin certificado</span>}</div><AspiranteButton type="button" variant="icon" className="danger" onClick={() => eliminarExperiencia(index)}><Trash2 size={16} /></AspiranteButton></div></article>))}</div>
							</AspiranteCard>

							<AspiranteCard className="hoja-card-AP hoja-card-wide-AP hoja-modal-card-AP">
								<AspiranteSectionHeader kicker="Estudios" title="Administrar formación" />
								<form className="hoja-form-grid-AP hoja-modal-form-AP" onSubmit={agregarEstudio}>
									<AspiranteFormField label="Título"><input value={nuevoEstudio.titulo} onChange={(event) => setNuevoEstudio((current) => ({ ...current, titulo: event.target.value }))} /></AspiranteFormField>
									<AspiranteFormField label="Institución"><input value={nuevoEstudio.institucion} onChange={(event) => setNuevoEstudio((current) => ({ ...current, institucion: event.target.value }))} /></AspiranteFormField>
									<AspiranteFormField label="Nivel educativo"><select value={nuevoEstudio.nivelEducativo} onChange={(event) => setNuevoEstudio((current) => ({ ...current, nivelEducativo: event.target.value }))}><option value="TECNICO">Técnico</option><option value="TECNOLOGICO">Tecnológico</option><option value="UNIVERSITARIO">Universitario</option><option value="POSGRADO">Posgrado</option><option value="OTRO">Otro</option></select></AspiranteFormField>
									<AspiranteFormField label="Inicio"><input type="date" value={nuevoEstudio.fechaInicio} onChange={(event) => setNuevoEstudio((current) => ({ ...current, fechaInicio: event.target.value }))} /></AspiranteFormField>
									<AspiranteFormField label="Fin"><input type="date" value={nuevoEstudio.fechaFin} onChange={(event) => setNuevoEstudio((current) => ({ ...current, fechaFin: event.target.value }))} /></AspiranteFormField>
									<AspiranteFormField label="Certificado URL" fullWidth><input value={nuevoEstudio.certificadoUrl} onChange={(event) => setNuevoEstudio((current) => ({ ...current, certificadoUrl: event.target.value }))} /></AspiranteFormField>
									<AspiranteButton type="submit" className="full-width-AP" disabled={saving || !hoja}><Plus size={16} />Agregar estudio</AspiranteButton>
								</form>
								<div className="list-stack-AP">{(hoja?.estudios || []).length === 0 ? <div className="asp-empty">No hay estudios registrados.</div> : (hoja?.estudios || []).map((estudio, index) => (<article key={`${estudio.titulo}-${index}`} className="item-card-AP"><div className="item-top-AP"><div><h3>{estudio.titulo || "Sin título"}</h3><p>{estudio.institucion || "Institución"}</p></div><div className="item-date-range-AP"><div className="item-date-row-AP"><span className="item-date-start-AP">{estudio.fechaInicio || "Inicio"}</span><span className="item-date-end-AP">{estudio.fechaFin || "Actualidad"}</span></div>{estudio.certificadoUrl ? <a className="item-certificate-AP" href={estudio.certificadoUrl} target="_blank" rel="noreferrer">Ver certificado</a> : <span className="item-certificate-AP item-certificate-AP--empty">Sin certificado</span>}</div><AspiranteButton type="button" variant="icon" className="danger" onClick={() => eliminarEstudio(index)}><Trash2 size={16} /></AspiranteButton></div></article>))}</div>
							</AspiranteCard>
						</div>

						<div className="hoja-modal-footer-AP">
							<AspiranteButton type="button" variant="secondary" onClick={handleCloseEditModal}>Cerrar</AspiranteButton>
						</div>
					</div>
				</div>
			)}
		</FinalLayoutComponent>
	);
};

export default HojaDeVida;
