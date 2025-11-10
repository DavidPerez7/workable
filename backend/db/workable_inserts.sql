-- Departamentos
INSERT INTO departamento (id, nombre) VALUES
(1, 'BOGOTA D.C'),
(2, 'ANTIOQUIA'),
(3, 'VALLE DEL CAUCA'),
(4, 'ATLANTICO'),
(5, 'SANTANDER');

-- Municipios (referencia: departamento_id)
INSERT INTO municipio (id, nombre, departamento_id) VALUES
(1, 'BOGOTA D.C', 1),
(2, 'MEDELLIN', 2),
(3, 'BELLO', 2),
(4, 'ITAGUI', 2),
(5, 'ENVIGADO', 2),
(6, 'RIONEGRO', 2),
(7, 'CALI', 3),
(8, 'BARRANQUILLA', 4),
(9, 'BUCARAMANGA', 5);

-- Niveles Educativos
INSERT INTO nivel_educativo (id, nombre) VALUES
(1, 'Bachillerato'),
(2, 'Técnico'),
(3, 'Tecnólogo'),
(4, 'Pregrado'),
(5, 'Postgrado'),
(6, 'Universitario'),
(7, 'Especialización'),
(8, 'Maestría'),
(9, 'Doctorado');

-- Categorías de Empresas
INSERT INTO empresa_categoria (id, nombre, imagen_url, descripcion, estado) VALUES
(1, 'TECNOLOGIA', '', 'Empresas dedicadas a desarrollo de software y servicios TI', 'ACTIVO'),
(2, 'SALUD', '', 'Instituciones de atención médica y servicios de salud', 'ACTIVO'),
(3, 'EDUCACION', '', 'Organizaciones dedicadas a procesos educativos', 'ACTIVO'),
(4, 'FINANZAS', '', 'Entidades bancarias y de servicios financieros', 'ACTIVO'),
(5, 'COMERCIO', '', 'Comercios al por mayor y por menor', 'ACTIVO'),
(6, 'ALIMENTICIOS', '', 'Empresas dedicadas a la producción y distribución de alimentos y bebidas', 'ACTIVO'),
(7, 'CONSTRUCCION', '', 'Empresas del sector de construcción e ingeniería', 'ACTIVO'),
(8, 'TRANSPORTE', '', 'Empresas de logística y transporte', 'ACTIVO');

-- Empresas (referencia: empresa_categoria_id, municipio_id)
-- Nota: nit_id es el NIT público de la empresa, clave primaria ingresada por el usuario
INSERT INTO empresa (nit_id, nombre, descripcion, numero_trabajadores, puntuacion, empresa_categoria_id, municipio_id) VALUES
(9001, 'TechColombia SAS', 'Consultoría en software y ciberseguridad', 150, 4.5, 1, 1),
(9002, 'AgroTech Soluciones', 'Soluciones tecnológicas para el sector agrícola', 80, 4.2, 1, 7),
(9003, 'EduFuture', 'Plataformas educativas innovadoras', 50, 4.8, 3, 8),
(9004, 'HealthCare Plus', 'Centro médico especializado', 200, 4.6, 2, 2),
(9005, 'FinanzCorp', 'Servicios financieros integrales', 120, 4.3, 4, 1);

-- Modalidades de trabajo (tabla: oferta_modalidad)
INSERT INTO oferta_modalidad (id, nombre, estado) VALUES
(1, 'Presencial', 'ACTIVO'),
(2, 'Remoto', 'ACTIVO'),
(3, 'Híbrido', 'ACTIVO');

-- Tipos de Contrato (tabla: oferta_tipo_contrato)
INSERT INTO oferta_tipo_contrato (id, nombre, estado) VALUES
(1, 'Tiempo completo', 'ACTIVO'),
(2, 'Medio tiempo', 'ACTIVO'),
(3, 'Contrato temporal', 'ACTIVO'),
(4, 'Freelance', 'ACTIVO'),
(5, 'Prácticas profesionales', 'ACTIVO'),
(6, 'Contrato indefinido', 'ACTIVO'),
(7, 'Contrato por obra', 'ACTIVO');

-- Estados de Postulación (tabla: estado)
INSERT INTO estado (id, nombre) VALUES
(1, 'Pendiente'),
(2, 'En Revisión'),
(3, 'Preseleccionado'),
(4, 'Rechazado'),
(5, 'Aceptado'),
(6, 'Finalizado');

-- Beneficios (tabla: oferta_beneficio)
INSERT INTO oferta_beneficio (beneficio_id, nombre, estado) VALUES
(1, 'Seguro médico', 'ACTIVO'),
(2, 'Seguro de vida', 'ACTIVO'),
(3, 'Bonificaciones', 'ACTIVO'),
(4, 'Comisiones', 'ACTIVO'),
(5, 'Capacitación', 'ACTIVO'),
(6, 'Días de teletrabajo', 'ACTIVO'),
(7, 'Horario flexible', 'ACTIVO'),
(8, 'Auxilio de transporte', 'ACTIVO'),
(9, 'Auxilio de alimentación', 'ACTIVO'),
(10, 'Primas extralegales', 'ACTIVO');

-- Usuario de tipo ASPIRANTE (referencia: municipio_id)
INSERT INTO usuario (nombre, correo, telefono, clave, rol, municipio_id) VALUES
('Juan Aspirante', 'juan.aspirante@email.com', 3121234567, '$2a$10$hashprueba', 'ASPIRANTE', 1);

-- DataEstudio (referencia: usuario_id, nivelEducativo_id)
INSERT INTO data_estudio (nombre, fecha_inicio, fecha_fin, en_curso, institucion, certificado_url, nivel_educativo_id, usuario_id, estado)
VALUES ('Ingeniería de Sistemas', '2020-01-01', '2024-01-01', false, 'Universidad Nacional', 'https://certificados.unal.edu/123.pdf', 2, 5, 'ACTIVO');

INSERT INTO data_estudio (nombre, fecha_inicio, fecha_fin, en_curso, institucion, certificado_url, nivel_educativo_id, usuario_id, estado)
VALUES ('Ingeniería de Software', '2018-01-01', '2022-01-01', false, 'Universidad de Antioquia', 'https://certificados.udea.edu/456.pdf', 3, 6, 'ACTIVO');


-- Consultas de verificación
-- SELECT * FROM departamento;
-- SELECT * FROM municipio;
-- SELECT * FROM nivel_educativo;
-- SELECT * FROM empresa_categoria;
-- SELECT * FROM empresa;
-- SELECT * FROM oferta_modalidad;
-- SELECT * FROM oferta_tipo_contrato;
-- SELECT * FROM estado;
-- SELECT * FROM oferta_beneficio;
