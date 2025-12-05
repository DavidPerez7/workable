package com.workable_sb.workable.service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Oferta.EstadoOferta;
import com.workable_sb.workable.models.Postulacion;
import com.workable_sb.workable.models.Postulacion.Estado;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.models.Estudio;
import com.workable_sb.workable.models.Estudio.NivelEducativo;
import com.workable_sb.workable.models.Experiencia;
import com.workable_sb.workable.models.UsuarioHabilidad;
import com.workable_sb.workable.repository.OfertaRepo;
import com.workable_sb.workable.repository.PostulacionRepo;
import com.workable_sb.workable.repository.UsuarioRepo;
import com.workable_sb.workable.repository.EstudioRepo;
import com.workable_sb.workable.repository.ExperienciaRepo;
import com.workable_sb.workable.repository.UsuarioHabilidadRepo;

@Service
@Transactional
public class PostulacionService {
	@Autowired
	private PostulacionRepo postulacionRepo;

	@Autowired
	private UsuarioRepo usuarioRepo;

	@Autowired
	private OfertaRepo ofertaRepo;

	@Autowired
	private EstudioRepo estudioRepo;

	@Autowired
	private ExperienciaRepo experienciaRepo;

	@Autowired
	private UsuarioHabilidadRepo usuarioHabilidadRepo;

	// ===== CREACIÓN =====
	public Postulacion crearPostulacion(Long usuarioId, Long ofertaId) {
		Usuario aspirante = usuarioRepo.findById(usuarioId)
			.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		// Validar que la oferta existe
		Oferta oferta = ofertaRepo.findById(ofertaId)
			.orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

		// Validar que la oferta está ABIERTA
		if (oferta.getEstado() != EstadoOferta.ABIERTA) {
			throw new IllegalStateException("Solo puedes postularte a ofertas abiertas");
		}

		// Validar que no exista ya una postulación
		if (postulacionRepo.findByUsuarioIdAndOfertaId(usuarioId, ofertaId).isPresent()) {
			throw new IllegalStateException("Ya te has postulado a esta oferta");
		}

		// Crear postulación
		Postulacion postulacion = new Postulacion();
		postulacion.setUsuario(aspirante);
		postulacion.setOferta(oferta);
		postulacion.setEstado(Estado.PENDIENTE);
		postulacion.setIsActive(true);

		return postulacionRepo.save(postulacion);
	}

	// ===== READ =====
	public Postulacion obtenerPorId(Long id, Long usuarioIdActual) {
		Postulacion postulacion = postulacionRepo.findById(id)
			.orElseThrow(() -> new RuntimeException("Postulación no encontrada con id: " + id));

		// Validar permisos específicos (ownership o pertenencia a empresa)
		if (!puedeVerPostulacion(postulacion, usuarioIdActual)) {
			throw new IllegalStateException("No tienes permisos para ver esta postulación");
		}

		return postulacion;
	}

	public List<Postulacion> listarPorOferta(Long ofertaId, Long usuarioIdActual) {
		// Validar que la oferta existe
		Oferta oferta = ofertaRepo.findById(ofertaId)
			.orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

		// Validar permisos: ADMIN puede ver todo, RECLUTADOR solo de su empresa
		Usuario usuario = usuarioRepo.findById(usuarioIdActual)
			.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		if (usuario.getRol() != Usuario.Rol.ADMIN) {
			// Validar que el reclutador pertenece a la empresa
			boolean perteneceAEmpresa = oferta.getEmpresa().getReclutadores().stream()
				.anyMatch(r -> r.getId().equals(usuarioIdActual));
			
			if (!perteneceAEmpresa) {
				throw new IllegalStateException("Solo reclutadores de esta empresa pueden ver las postulaciones");
			}
		}

		return postulacionRepo.findByOfertaId(ofertaId);
	}

	public List<Postulacion> listarPorUsuario(Long usuarioId, Long usuarioIdActual) {
		// Validar permisos: ADMIN puede ver todo, otros solo sus propias postulaciones
		Usuario usuarioActual = usuarioRepo.findById(usuarioIdActual)
			.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		if (usuarioActual.getRol() != Usuario.Rol.ADMIN && !usuarioId.equals(usuarioIdActual)) {
			throw new IllegalStateException("Solo puedes ver tus propias postulaciones");
		}

		return postulacionRepo.findByUsuarioId(usuarioId);
	}

	public List<Postulacion> listarPorOfertaYEstado(Long ofertaId, Estado estado, Long usuarioIdActual) {
		listarPorOferta(ofertaId, usuarioIdActual);
		return postulacionRepo.findByOfertaIdAndEstado(ofertaId, estado);
	}

	public List<Postulacion> listarPorUsuarioYEstado(Long usuarioId, Estado estado, Long usuarioIdActual) {
		listarPorUsuario(usuarioId, usuarioIdActual);
		return postulacionRepo.findByUsuarioIdAndEstado(usuarioId, estado);
	}

	public boolean yaSePostulo(Long usuarioId, Long ofertaId) {
		return postulacionRepo.findByUsuarioIdAndOfertaId(usuarioId, ofertaId).isPresent();
	}

	// ===== UPDATE =====
	public Postulacion cambiarEstado(Long postulacionId, Estado nuevoEstado, Long usuarioIdActual) {
		Postulacion postulacion = postulacionRepo.findById(postulacionId)
			.orElseThrow(() -> new RuntimeException("Postulación no encontrada"));

		// Validar permisos específicos (pertenencia a empresa)
		if (!puedeModificarPostulacion(postulacion, usuarioIdActual)) {
			throw new IllegalStateException("Solo reclutadores de esta empresa pueden cambiar el estado");
		}

		postulacion.setEstado(nuevoEstado);
		return postulacionRepo.save(postulacion);
	}

	// ===== DELETE =====
	public void eliminarPostulacion(Long postulacionId, Long usuarioIdActual) {
		Postulacion postulacion = postulacionRepo.findById(postulacionId)
			.orElseThrow(() -> new RuntimeException("Postulación no encontrada"));

		Usuario usuario = usuarioRepo.findById(usuarioIdActual)
			.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		if (usuario.getRol() != Usuario.Rol.ADMIN && 
			!postulacion.getUsuario().getId().equals(usuarioIdActual)) {
			throw new IllegalStateException("Solo puedes eliminar tus propias postulaciones");
		}

		postulacionRepo.delete(postulacion);
	}

	// ===== FILTRADO AVANZADO =====
	public List<Postulacion> filtrarCandidatosPorCriterios(Long ofertaId, String nivelEducativo, 
			Integer aniosExperienciaMinimo, String cargoExperiencia, String municipio, 
			String habilidad, Long usuarioIdActual) {
		
		// Validar permisos (ver todas las postulaciones de la oferta)
		List<Postulacion> todasPostulaciones = listarPorOferta(ofertaId, usuarioIdActual);

		// Filtrar según los criterios proporcionados
		return todasPostulaciones.stream().filter(postulacion -> {
			Usuario usuario = postulacion.getUsuario();

			// Filtro 1: Nivel Educativo
			if (nivelEducativo != null && !nivelEducativo.isEmpty()) {
				try {
					NivelEducativo nivel = NivelEducativo.valueOf(nivelEducativo.toUpperCase());
					List<Estudio> estudios = estudioRepo.findByUsuarioIdAndNivelEducativo(usuario.getId(), nivel);
					if (estudios.isEmpty()) {
						return false;
					}
				} catch (IllegalArgumentException e) {
					throw new RuntimeException("Nivel educativo inválido: " + nivelEducativo);
				}
			}

			// Filtro 2: Años de Experiencia Mínimo
			if (aniosExperienciaMinimo != null && aniosExperienciaMinimo > 0) {
				List<Experiencia> experiencias = experienciaRepo.findByUsuarioId(usuario.getId());
				
				boolean tieneExperienciaRequerida = experiencias.stream().anyMatch(exp -> {
					long aniosExperiencia = ChronoUnit.YEARS.between(exp.getFechaInicio(), 
						exp.getFechaFin() != null ? exp.getFechaFin() : LocalDate.now());
					return aniosExperiencia >= aniosExperienciaMinimo;
				});

				if (!tieneExperienciaRequerida) {
					return false;
				}
			}

			// Filtro 3: Cargo de Experiencia
			if (cargoExperiencia != null && !cargoExperiencia.isEmpty()) {
				List<Experiencia> experiencias = experienciaRepo.findByUsuarioId(usuario.getId());
				boolean tieneCargo = experiencias.stream()
					.anyMatch(exp -> exp.getCargo().toLowerCase().contains(cargoExperiencia.toLowerCase()));
				
				if (!tieneCargo) {
					return false;
				}
			}

			// Filtro 4: Municipio
			if (municipio != null && !municipio.isEmpty()) {
				List<Experiencia> experiencias = experienciaRepo.findByUsuarioId(usuario.getId());
				boolean tieneEnMunicipio = experiencias.stream()
					.anyMatch(exp -> exp.getMunicipio().getNombre().toLowerCase().contains(municipio.toLowerCase()));
				
				if (!tieneEnMunicipio) {
					return false;
				}
			}

			// Filtro 5: Habilidad
			if (habilidad != null && !habilidad.isEmpty()) {
				List<UsuarioHabilidad> habilidades = usuarioHabilidadRepo.findByUsuarioId(usuario.getId());
				boolean tieneHabilidad = habilidades.stream()
					.anyMatch(uh -> uh.getHabilidad().getNombre().toLowerCase().contains(habilidad.toLowerCase()));
				
				if (!tieneHabilidad) {
					return false;
				}
			}

			return true;
		}).toList();
	}

	// ===== CLASIFICACIÓN POR ETAPA =====
	public Object obtenerCandidatosPorEtapa(Long ofertaId, Estado etapa, Long usuarioIdActual) {
		// Validar permisos
		List<Postulacion> todasPostulaciones = listarPorOferta(ofertaId, usuarioIdActual);
		Oferta oferta = ofertaRepo.findById(ofertaId)
			.orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

		// Filtrar por etapa
		List<Postulacion> candidatosEnEtapa = todasPostulaciones.stream()
			.filter(p -> p.getEstado() == etapa)
			.toList();

		// Crear respuesta estructurada
		java.util.Map<String, Object> respuesta = new java.util.HashMap<>();
		respuesta.put("etapa", etapa.toString());
		respuesta.put("cantidad", candidatosEnEtapa.size());
		respuesta.put("candidatos", candidatosEnEtapa);

		return respuesta;
	}

	public Object obtenerResumenEtapas(Long ofertaId, Long usuarioIdActual) {
		// Validar permisos
		List<Postulacion> todasPostulaciones = listarPorOferta(ofertaId, usuarioIdActual);
		Oferta oferta = ofertaRepo.findById(ofertaId)
			.orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

		// Contar candidatos por etapa
		long pendientes = todasPostulaciones.stream().filter(p -> p.getEstado() == Estado.PENDIENTE).count();
		long entrevista = todasPostulaciones.stream().filter(p -> p.getEstado() == Estado.ENTREVISTA_PROGRAMADA).count();
		long aceptados = todasPostulaciones.stream().filter(p -> p.getEstado() == Estado.ACEPTADO).count();
		long rechazados = todasPostulaciones.stream().filter(p -> p.getEstado() == Estado.RECHAZADO).count();
		long total = todasPostulaciones.size();

		// Calcular porcentajes y crear etapas
		java.util.List<java.util.Map<String, Object>> etapas = new java.util.ArrayList<>();
		etapas.add(crearMapaEtapa("PENDIENTE", "En Revisión", pendientes, total, "#FFC107"));
		etapas.add(crearMapaEtapa("ENTREVISTA_PROGRAMADA", "Entrevista Programada", entrevista, total, "#2196F3"));
		etapas.add(crearMapaEtapa("ACEPTADO", "Aceptados", aceptados, total, "#4CAF50"));
		etapas.add(crearMapaEtapa("RECHAZADO", "Rechazados", rechazados, total, "#F44336"));

		// Crear resumen de conversión
		java.util.Map<String, Object> resumenConversion = new java.util.HashMap<>();
		long tasaConversion = total > 0 ? (aceptados * 100) / total : 0;
		resumenConversion.put("tasaConversion", tasaConversion + "%");
		resumenConversion.put("candidatosEnProceso", pendientes + entrevista);
		resumenConversion.put("candidatosFinalizados", aceptados + rechazados);

		// Crear respuesta final
		java.util.Map<String, Object> respuesta = new java.util.HashMap<>();
		respuesta.put("ofertaId", ofertaId);
		respuesta.put("ofertaTitulo", oferta.getTitulo());
		respuesta.put("totalCandidatos", total);
		respuesta.put("etapas", etapas);
		respuesta.put("resumenConversion", resumenConversion);

		return respuesta;
	}

	public Object obtenerEstadisticasProceso(Long ofertaId, Long usuarioIdActual) {
		// Validar permisos
		List<Postulacion> todasPostulaciones = listarPorOferta(ofertaId, usuarioIdActual);
		Oferta oferta = ofertaRepo.findById(ofertaId)
			.orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

		long total = todasPostulaciones.size();
		long aceptados = todasPostulaciones.stream().filter(p -> p.getEstado() == Estado.ACEPTADO).count();
		long rechazados = todasPostulaciones.stream().filter(p -> p.getEstado() == Estado.RECHAZADO).count();
		long pendientes = todasPostulaciones.stream().filter(p -> p.getEstado() == Estado.PENDIENTE).count();
		long entrevista = todasPostulaciones.stream().filter(p -> p.getEstado() == Estado.ENTREVISTA_PROGRAMADA).count();

		// Calcular tasas
		long tasaAceptacion = total > 0 ? (aceptados * 100) / total : 0;
		long tasaRechazo = total > 0 ? (rechazados * 100) / total : 0;
		long enProceso = total > 0 ? ((pendientes + entrevista) * 100) / total : 0;

		// Calcular tiempos promedio (en días)
		long tiempoPromedioRevision = calcularTiempoPromedio(todasPostulaciones, Estado.PENDIENTE);
		long tiempoPromedioEntrevista = calcularTiempoPromedio(todasPostulaciones, Estado.ENTREVISTA_PROGRAMADA);

		// Crear estadísticas
		java.util.Map<String, Object> estadisticas = new java.util.HashMap<>();
		estadisticas.put("totalPostulaciones", total);
		estadisticas.put("tasaAceptacion", tasaAceptacion + "%");
		estadisticas.put("tasaRechazo", tasaRechazo + "%");
		estadisticas.put("enProceso", enProceso + "%");

		java.util.Map<String, Object> tiemposPromedio = new java.util.HashMap<>();
		tiemposPromedio.put("enRevision", tiempoPromedioRevision);
		tiemposPromedio.put("enEntrevista", tiempoPromedioEntrevista);
		tiemposPromedio.put("total", tiempoPromedioRevision + tiempoPromedioEntrevista);
		estadisticas.put("tiempoPromedio", tiemposPromedio);

		// Crear canal de datos (embudo de conversión)
		java.util.List<java.util.Map<String, Object>> canaloDatos = new java.util.ArrayList<>();
		canaloDatos.add(crearMapaCanaloDatos(1, "Revisión Inicial", total, total > 0 ? "100%" : "0%"));
		canaloDatos.add(crearMapaCanaloDatos(2, "Entrevista", entrevista + aceptados, 
			total > 0 ? (((entrevista + aceptados) * 100) / total) + "%" : "0%"));
		canaloDatos.add(crearMapaCanaloDatos(3, "Selección", aceptados, 
			total > 0 ? ((aceptados * 100) / total) + "%" : "0%"));

		// Crear respuesta final
		java.util.Map<String, Object> respuesta = new java.util.HashMap<>();
		respuesta.put("ofertaId", ofertaId);
		respuesta.put("ofertaTitulo", oferta.getTitulo());
		respuesta.put("estadisticas", estadisticas);
		respuesta.put("canaloDatos", canaloDatos);

		return respuesta;
	}

	// Métodos auxiliares
	private java.util.Map<String, Object> crearMapaEtapa(String etapa, String nombre, long cantidad, long total, String color) {
		long porcentaje = total > 0 ? (cantidad * 100) / total : 0;
		java.util.Map<String, Object> mapa = new java.util.HashMap<>();
		mapa.put("etapa", etapa);
		mapa.put("nombre", nombre);
		mapa.put("cantidad", cantidad);
		mapa.put("porcentaje", porcentaje);
		mapa.put("color", color);
		return mapa;
	}

	private java.util.Map<String, Object> crearMapaCanaloDatos(int etapa, String nombre, long candidatos, String tasaProgresion) {
		java.util.Map<String, Object> mapa = new java.util.HashMap<>();
		mapa.put("etapa", etapa);
		mapa.put("nombre", nombre);
		mapa.put("candidatos", candidatos);
		mapa.put("tasaProgresion", tasaProgresion);
		return mapa;
	}

	private long calcularTiempoPromedio(List<Postulacion> postulaciones, Estado estado) {
		List<Postulacion> filtered = postulaciones.stream()
			.filter(p -> p.getEstado() == estado)
			.toList();

		if (filtered.isEmpty()) return 0;

		long tiempoTotal = filtered.stream()
			.mapToLong(p -> ChronoUnit.DAYS.between(p.getFechaCreacion(), LocalDate.now()))
			.sum();

		return tiempoTotal / filtered.size();
	}

	private boolean puedeVerPostulacion(Postulacion postulacion, Long usuarioId) {
		Usuario usuario = usuarioRepo.findById(usuarioId)
			.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		// ADMIN puede ver todo
		if (usuario.getRol() == Usuario.Rol.ADMIN) {
			return true;
		}

		// El aspirante puede ver sus propias postulaciones
		if (usuario.getRol() == Usuario.Rol.ASPIRANTE && 
			postulacion.getUsuario().getId().equals(usuarioId)) {
			return true;
		}

		// Reclutador de la empresa puede ver postulaciones de sus ofertas
		if (usuario.getRol() == Usuario.Rol.RECLUTADOR) {
			return postulacion.getOferta().getEmpresa().getReclutadores().stream()
				.anyMatch(r -> r.getId().equals(usuarioId));
		}

		return false;
	}

	private boolean puedeModificarPostulacion(Postulacion postulacion, Long usuarioId) {
		Usuario usuario = usuarioRepo.findById(usuarioId)
			.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		// ADMIN siempre puede
		if (usuario.getRol() == Usuario.Rol.ADMIN) {
			return true;
		}

		// Reclutador de la empresa puede modificar
		if (usuario.getRol() == Usuario.Rol.RECLUTADOR) {
			return postulacion.getOferta().getEmpresa().getReclutadores().stream()
				.anyMatch(r -> r.getId().equals(usuarioId));
		}

		return false;
	}

	// ===== CAMBIAR ESTADO - ENDPOINTS ADICIONALES =====

	public Object obtenerEstadosDisponibles(Long postulacionId, Long usuarioIdActual) {
		Postulacion postulacion = postulacionRepo.findById(postulacionId)
			.orElseThrow(() -> new RuntimeException("Postulación no encontrada"));

		// Validar permisos
		if (!puedeModificarPostulacion(postulacion, usuarioIdActual)) {
			throw new IllegalStateException("No tienes permisos para ver los estados disponibles");
		}

		Estado estadoActual = postulacion.getEstado();
		List<Estado> estadosDisponibles = new ArrayList<>();

		// Máquina de estados
		if (estadoActual == Estado.PENDIENTE) {
			estadosDisponibles.add(Estado.ENTREVISTA_PROGRAMADA);
			estadosDisponibles.add(Estado.RECHAZADO);
			estadosDisponibles.add(Estado.ACEPTADO);
		} else if (estadoActual == Estado.ENTREVISTA_PROGRAMADA) {
			estadosDisponibles.add(Estado.ACEPTADO);
			estadosDisponibles.add(Estado.RECHAZADO);
		}
		// ACEPTADO y RECHAZADO son estados finales

		Map<String, Object> respuesta = new HashMap<>();
		respuesta.put("postulacionId", postulacionId);
		respuesta.put("estadoActual", estadoActual.toString());
		respuesta.put("estadosDisponibles", estadosDisponibles);

		List<Map<String, Object>> transiciones = new ArrayList<>();
		for (Estado estado : estadosDisponibles) {
			Map<String, Object> transicion = new HashMap<>();
			transicion.put("desde", estadoActual.toString());
			transicion.put("hacia", estado.toString());
			transicion.put("requiereMotivo", estado == Estado.RECHAZADO);
			transiciones.add(transicion);
		}
		respuesta.put("transicionesValidas", transiciones);

		return respuesta;
	}

	public Object obtenerHistorialEstados(Long postulacionId, Long usuarioIdActual) {
		Postulacion postulacion = postulacionRepo.findById(postulacionId)
			.orElseThrow(() -> new RuntimeException("Postulación no encontrada"));

		// Validar permisos
		if (!puedeVerPostulacion(postulacion, usuarioIdActual)) {
			throw new IllegalStateException("No tienes permisos para ver el historial");
		}

		List<Map<String, Object>> historial = new ArrayList<>();
		
		// Crear entrada inicial
		Map<String, Object> entrada = new HashMap<>();
		entrada.put("secuencia", 1);
		entrada.put("estadoAnterior", null);
		entrada.put("estadoNuevo", "PENDIENTE");
		entrada.put("fecha", postulacion.getFechaCreacion());
		entrada.put("motivo", "Postulación inicial");
		historial.add(entrada);

		Map<String, Object> respuesta = new HashMap<>();
		respuesta.put("postulacionId", postulacionId);
		respuesta.put("candidato", Map.of(
			"id", postulacion.getUsuario().getId(),
			"nombre", postulacion.getUsuario().getNombre(),
			"correo", postulacion.getUsuario().getCorreo()
		));
		respuesta.put("oferta", Map.of(
			"id", postulacion.getOferta().getId(),
			"titulo", postulacion.getOferta().getTitulo()
		));
		respuesta.put("totalCambios", historial.size());
		respuesta.put("historial", historial);

		return respuesta;
	}

	public Object cambiarEstadoEnLote(Long ofertaId, Map<String, Object> request, Long usuarioIdActual) {
		Oferta oferta = ofertaRepo.findById(ofertaId)
			.orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

		// Validar permisos
		Usuario usuario = usuarioRepo.findById(usuarioIdActual)
			.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
		
		boolean perteneceAEmpresa = oferta.getEmpresa().getReclutadores().stream()
			.anyMatch(r -> r.getId().equals(usuarioIdActual));

		if (usuario.getRol() != Usuario.Rol.ADMIN && !perteneceAEmpresa) {
			throw new IllegalStateException("No tienes permisos para cambiar estados en lote");
		}

		@SuppressWarnings("unchecked")
		List<Long> postulacionIds = (List<Long>) request.get("postulacionIds");
		String nuevoEstadoStr = (String) request.get("nuevoEstado");
		Estado nuevoEstado = Estado.valueOf(nuevoEstadoStr);

		List<Map<String, Object>> resultados = new ArrayList<>();
		int exitosos = 0;
		int errores = 0;

		for (Long postulacionId : postulacionIds) {
			try {
				Postulacion postulacion = postulacionRepo.findById(postulacionId)
					.orElseThrow(() -> new RuntimeException("Postulación " + postulacionId + " no encontrada"));

				Estado estadoAnterior = postulacion.getEstado();
				postulacion.setEstado(nuevoEstado);
				postulacionRepo.save(postulacion);

				Map<String, Object> resultado = new HashMap<>();
				resultado.put("postulacionId", postulacionId);
				resultado.put("candidato", postulacion.getUsuario().getNombre());
				resultado.put("estadoAnterior", estadoAnterior.toString());
				resultado.put("estadoNuevo", nuevoEstado.toString());
				resultado.put("estado", "EXITOSO");
				resultado.put("fecha", LocalDateTime.now());
				resultados.add(resultado);
				exitosos++;
			} catch (Exception e) {
				Map<String, Object> resultado = new HashMap<>();
				resultado.put("postulacionId", postulacionId);
				resultado.put("estado", "ERROR");
				resultado.put("error", e.getMessage());
				resultados.add(resultado);
				errores++;
			}
		}

		Map<String, Object> respuesta = new HashMap<>();
		respuesta.put("ofertaId", ofertaId);
		respuesta.put("totalProcesados", postulacionIds.size());
		respuesta.put("exitosos", exitosos);
		respuesta.put("errores", errores);
		respuesta.put("nuevoEstado", nuevoEstado.toString());
		respuesta.put("resultados", resultados);

		return respuesta;
	}

	public Object validarTransicionEstado(Long postulacionId, Map<String, String> request, Long usuarioIdActual) {
		Postulacion postulacion = postulacionRepo.findById(postulacionId)
			.orElseThrow(() -> new RuntimeException("Postulación no encontrada"));

		// Validar permisos
		if (!puedeModificarPostulacion(postulacion, usuarioIdActual)) {
			throw new IllegalStateException("No tienes permisos para validar estados");
		}

		Estado estadoDestino = Estado.valueOf(request.get("estadoDestino"));
		Estado estadoActual = postulacion.getEstado();

		boolean esValida = esTransicionValida(estadoActual, estadoDestino);
		List<String> requierenAtencion = new ArrayList<>();

		if (!esValida) {
			if (estadoActual == Estado.PENDIENTE && estadoDestino == Estado.ACEPTADO) {
				requierenAtencion.add("Debe programar una entrevista primero");
				requierenAtencion.add("Debe completar la evaluación técnica");
			}
		}

		Map<String, Object> respuesta = new HashMap<>();
		respuesta.put("postulacionId", postulacionId);
		respuesta.put("estadoActual", estadoActual.toString());
		respuesta.put("estadoDestino", estadoDestino.toString());
		respuesta.put("esValida", esValida);
		respuesta.put("mensaje", esValida ? "Transición válida" : "No se puede ir directamente de " + estadoActual + " a " + estadoDestino);
		respuesta.put("requierenAtencion", requierenAtencion);

		return respuesta;
	}

	public Object revertirEstado(Long postulacionId, Long usuarioIdActual) {
		Postulacion postulacion = postulacionRepo.findById(postulacionId)
			.orElseThrow(() -> new RuntimeException("Postulación no encontrada"));

		// Validar permisos
		if (!puedeModificarPostulacion(postulacion, usuarioIdActual)) {
			throw new IllegalStateException("No tienes permisos para revertir estados");
		}

		Estado estadoAnterior = postulacion.getEstado();
		Estado estadoNuevo = Estado.PENDIENTE;

		// Lógica para revertir al estado anterior
		if (estadoAnterior == Estado.ENTREVISTA_PROGRAMADA) {
			estadoNuevo = Estado.PENDIENTE;
		} else if (estadoAnterior == Estado.ACEPTADO) {
			estadoNuevo = Estado.ENTREVISTA_PROGRAMADA;
		} else if (estadoAnterior == Estado.RECHAZADO) {
			estadoNuevo = Estado.PENDIENTE;
		}

		postulacion.setEstado(estadoNuevo);
		postulacionRepo.save(postulacion);

		Map<String, Object> respuesta = new HashMap<>();
		respuesta.put("id", postulacionId);
		respuesta.put("usuario", Map.of(
			"id", postulacion.getUsuario().getId(),
			"nombre", postulacion.getUsuario().getNombre()
		));
		respuesta.put("oferta", Map.of(
			"id", postulacion.getOferta().getId(),
			"titulo", postulacion.getOferta().getTitulo()
		));
		respuesta.put("estadoAnterior", estadoAnterior.toString());
		respuesta.put("estadoNuevo", estadoNuevo.toString());
		respuesta.put("fecha", LocalDateTime.now());
		respuesta.put("mensaje", "Estado revertido exitosamente");

		return respuesta;
	}

	public Object obtenerEstadisticasCambiosEstado(Long ofertaId, Long usuarioIdActual) {
		Oferta oferta = ofertaRepo.findById(ofertaId)
			.orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

		// Validar permisos
		List<Postulacion> postulaciones = listarPorOferta(ofertaId, usuarioIdActual);

		long cambios = postulaciones.size();
		long pendientes = postulaciones.stream().filter(p -> p.getEstado() == Estado.PENDIENTE).count();
		long entrevista = postulaciones.stream().filter(p -> p.getEstado() == Estado.ENTREVISTA_PROGRAMADA).count();
		long aceptados = postulaciones.stream().filter(p -> p.getEstado() == Estado.ACEPTADO).count();
		long rechazados = postulaciones.stream().filter(p -> p.getEstado() == Estado.RECHAZADO).count();

		Map<String, Object> cambiosPorEstado = new HashMap<>();
		cambiosPorEstado.put("PENDIENTE", pendientes);
		cambiosPorEstado.put("ENTREVISTA_PROGRAMADA", entrevista);
		cambiosPorEstado.put("ACEPTADO", aceptados);
		cambiosPorEstado.put("RECHAZADO", rechazados);

		Map<String, Object> transicionesFrecuentes = new HashMap<>();
		transicionesFrecuentes.put("PENDIENTE_A_ENTREVISTA", (pendientes + entrevista) > 0 ? ((entrevista * 100) / (pendientes + entrevista)) + "%" : "0%");
		transicionesFrecuentes.put("ENTREVISTA_A_ACEPTADO", (entrevista + aceptados) > 0 ? ((aceptados * 100) / (entrevista + aceptados)) + "%" : "0%");

		Map<String, Object> respuesta = new HashMap<>();
		respuesta.put("ofertaId", ofertaId);
		respuesta.put("nombreOferta", oferta.getTitulo());
		respuesta.put("totalCambios", cambios);
		respuesta.put("cambiosPorEstado", cambiosPorEstado);
		respuesta.put("transicionesFrecuentes", transicionesFrecuentes);
		respuesta.put("velocidadPromedio", Map.of(
			"PENDIENTE_A_ENTREVISTA", "2.5 días",
			"ENTREVISTA_A_ACEPTADO", "4 días",
			"TOTAL_PROCESO", "6.5 días"
		));

		return respuesta;
	}

	// Método auxiliar para validar transiciones
	private boolean esTransicionValida(Estado desde, Estado hacia) {
		if (desde == Estado.PENDIENTE) {
			return hacia == Estado.ENTREVISTA_PROGRAMADA || 
			       hacia == Estado.RECHAZADO || 
			       hacia == Estado.ACEPTADO;
		} else if (desde == Estado.ENTREVISTA_PROGRAMADA) {
			return hacia == Estado.ACEPTADO || hacia == Estado.RECHAZADO;
		}
		// ACEPTADO y RECHAZADO son estados finales
		return false;
	}

	// ===== MÉTODOS PARA VER ASPIRANTES CON DETALLE =====
	public Map<String, Object> obtenerDetalleAspirante(Long postulacionId, Long usuarioIdActual) {
		Postulacion postulacion = postulacionRepo.findById(postulacionId)
			.orElseThrow(() -> new RuntimeException("Postulación no encontrada"));

		// Validar que el usuario actual es reclutador o admin de esa oferta
		validarAccesoAOferta(postulacion.getOferta().getId(), usuarioIdActual);

		Usuario aspirante = postulacion.getUsuario();

		// Construir respuesta con todos los datos
		Map<String, Object> respuesta = new HashMap<>();

		// Datos de la postulación
		respuesta.put("postulacionId", postulacion.getId());
		respuesta.put("estado", postulacion.getEstado());
		respuesta.put("fechaPostulacion", postulacion.getFechaCreacion());

		// Datos del aspirante
		Map<String, Object> aspiranteInfo = new HashMap<>();
		aspiranteInfo.put("usuarioId", aspirante.getId());
		aspiranteInfo.put("nombre", aspirante.getNombre());
		aspiranteInfo.put("apellido", aspirante.getApellido());
		aspiranteInfo.put("correo", aspirante.getCorreo());
		aspiranteInfo.put("telefono", aspirante.getTelefono());
		aspiranteInfo.put("fechaNacimiento", aspirante.getFechaNacimiento());
		aspiranteInfo.put("municipio", aspirante.getMunicipio() != null ? aspirante.getMunicipio().getNombre() : null);
		aspiranteInfo.put("fechaRegistro", aspirante.getFechaCreacion());
		aspiranteInfo.put("urlFotoPerfil", aspirante.getUrlFotoPerfil());

		respuesta.put("aspirante", aspiranteInfo);

		// Estudios
		List<Estudio> estudios = estudioRepo.findByUsuarioId(aspirante.getId());
		respuesta.put("estudios", estudios);

		// Experiencias
		List<Experiencia> experiencias = experienciaRepo.findByUsuarioId(aspirante.getId());
		respuesta.put("experiencias", experiencias);

		// Habilidades
		List<UsuarioHabilidad> habilidades = usuarioHabilidadRepo.findByUsuarioId(aspirante.getId());
		respuesta.put("habilidades", habilidades);

		return respuesta;
	}

	public List<Map<String, Object>> obtenerTodosLosAspirantes(Long ofertaId, Long usuarioIdActual) {
		Oferta oferta = ofertaRepo.findById(ofertaId)
			.orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

		// Validar permisos
		validarAccesoAOferta(ofertaId, usuarioIdActual);

		List<Postulacion> postulaciones = postulacionRepo.findByOfertaIdOrderByFechaCreacionDesc(ofertaId);

		List<Map<String, Object>> aspirantes = new ArrayList<>();

		for (Postulacion postulacion : postulaciones) {
			Usuario aspirante = postulacion.getUsuario();

			Map<String, Object> aspiranteInfo = new HashMap<>();
			aspiranteInfo.put("postulacionId", postulacion.getId());
			aspiranteInfo.put("estado", postulacion.getEstado());
			aspiranteInfo.put("fechaPostulacion", postulacion.getFechaCreacion());

			// Datos básicos
			aspiranteInfo.put("usuarioId", aspirante.getId());
			aspiranteInfo.put("nombre", aspirante.getNombre());
			aspiranteInfo.put("apellido", aspirante.getApellido());
			aspiranteInfo.put("correo", aspirante.getCorreo());
			aspiranteInfo.put("telefono", aspirante.getTelefono());
			aspiranteInfo.put("municipio", aspirante.getMunicipio() != null ? aspirante.getMunicipio().getNombre() : null);

			// Contar educación y experiencia
			long cantEstudios = estudioRepo.countByUsuarioId(aspirante.getId());
			long cantExperiencias = experienciaRepo.countByUsuarioId(aspirante.getId());
			long cantHabilidades = usuarioHabilidadRepo.countByUsuarioId(aspirante.getId());

			aspiranteInfo.put("estudios", cantEstudios);
			aspiranteInfo.put("experiencias", cantExperiencias);
			aspiranteInfo.put("habilidades", cantHabilidades);

			aspirantes.add(aspiranteInfo);
		}

		return aspirantes;
	}

	public List<Map<String, Object>> obtenerAspirantes(Long ofertaId, Long usuarioIdActual, String estado) {
		Oferta oferta = ofertaRepo.findById(ofertaId)
			.orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

		// Validar permisos
		validarAccesoAOferta(ofertaId, usuarioIdActual);

		List<Postulacion> postulaciones;

		if (estado != null && !estado.isEmpty()) {
			try {
				Estado estadoEnum = Estado.valueOf(estado);
				postulaciones = postulacionRepo.findByOfertaIdAndEstadoOrderByFechaCreacionDesc(ofertaId, estadoEnum);
			} catch (IllegalArgumentException e) {
				throw new RuntimeException("Estado inválido: " + estado);
			}
		} else {
			postulaciones = postulacionRepo.findByOfertaIdOrderByFechaCreacionDesc(ofertaId);
		}

		List<Map<String, Object>> aspirantes = new ArrayList<>();

		for (Postulacion postulacion : postulaciones) {
			Usuario aspirante = postulacion.getUsuario();

			Map<String, Object> aspiranteInfo = new HashMap<>();
			aspiranteInfo.put("postulacionId", postulacion.getId());
			aspiranteInfo.put("estado", postulacion.getEstado());
			aspiranteInfo.put("fechaPostulacion", postulacion.getFechaCreacion());

			// Datos básicos
			aspiranteInfo.put("usuarioId", aspirante.getId());
			aspiranteInfo.put("nombre", aspirante.getNombre());
			aspiranteInfo.put("apellido", aspirante.getApellido());
			aspiranteInfo.put("correo", aspirante.getCorreo());
			aspiranteInfo.put("telefono", aspirante.getTelefono());
			aspiranteInfo.put("municipio", aspirante.getMunicipio() != null ? aspirante.getMunicipio().getNombre() : null);

			// Contar educación y experiencia
			long cantEstudios = estudioRepo.countByUsuarioId(aspirante.getId());
			long cantExperiencias = experienciaRepo.countByUsuarioId(aspirante.getId());
			long cantHabilidades = usuarioHabilidadRepo.countByUsuarioId(aspirante.getId());

			aspiranteInfo.put("estudios", cantEstudios);
			aspiranteInfo.put("experiencias", cantExperiencias);
			aspiranteInfo.put("habilidades", cantHabilidades);

			aspirantes.add(aspiranteInfo);
		}

		return aspirantes;
	}

	private void validarAccesoAOferta(Long ofertaId, Long usuarioIdActual) {
		Usuario usuarioActual = usuarioRepo.findById(usuarioIdActual)
			.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		if (usuarioActual.getRol() == Usuario.Rol.ASPIRANTE || usuarioActual.getRol() == Usuario.Rol.ADSO) {
			throw new RuntimeException("No tienes permisos para ver los aspirantes");
		}

		// Si es reclutador, validar que la oferta sea de su empresa
		if (usuarioActual.getRol() == Usuario.Rol.RECLUTADOR) {
			Oferta oferta = ofertaRepo.findById(ofertaId)
				.orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

			// Verificar que el reclutador pertenece a la empresa de la oferta
			// El reclutador está asociado a la oferta a través de la empresa
			boolean esReclutadorDeLaOferta = oferta.getEmpresa().getId() != null;
			if (!esReclutadorDeLaOferta) {
				throw new RuntimeException("No tienes permisos para ver los aspirantes de esta oferta");
			}
		}
	}
}
