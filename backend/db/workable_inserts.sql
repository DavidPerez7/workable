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
INSERT INTO empresa_categoria (id, nombre, imagen, descripcion) VALUES
(1, 'TECNOLOGIA', '', 'Empresas dedicadas a desarrollo de software y servicios TI'),
(2, 'SALUD', '', 'Instituciones de atención médica y servicios de salud'),
(3, 'EDUCACION', '', 'Organizaciones dedicadas a procesos educativos'),
(4, 'FINANZAS', '', 'Entidades bancarias y de servicios financieros'),
(5, 'COMERCIO', '', 'Comercios al por mayor y por menor'),
(6, 'ALIMENTICIOS', '', 'Empresas dedicadas a la producción y distribución de alimentos y bebidas'),
(7, 'CONSTRUCCION', '', 'Empresas del sector de construcción e ingeniería'),
(8, 'TRANSPORTE', '', 'Empresas de logística y transporte');

-- Empresas (referencia: empresa_categoria_id, municipio_id)
-- Nota: nit_id es el NIT público de la empresa, clave primaria ingresada por el usuario
INSERT INTO empresa (nit_id, nombre, descripcion, numero_trabajadores, puntuacion, empresa_categoria_id, municipio_id) VALUES
(9001, 'TechColombia SAS', 'Consultoría en software y ciberseguridad', 150, 4.5, 1, 1),
(9002, 'AgroTech Soluciones', 'Soluciones tecnológicas para el sector agrícola', 80, 4.2, 1, 7),
(9003, 'EduFuture', 'Plataformas educativas innovadoras', 50, 4.8, 3, 8),
(9004, 'HealthCare Plus', 'Centro médico especializado', 200, 4.6, 2, 2),
(9005, 'FinanzCorp', 'Servicios financieros integrales', 120, 4.3, 4, 1);

-- Modalidades de trabajo
INSERT INTO modalidad (id, nombre) VALUES
(1, 'Presencial'),
(2, 'Remoto'),
(3, 'Híbrido');

-- Tipos de Contrato
INSERT INTO tipo_contrato (id, nombre) VALUES
(1, 'Tiempo completo'),
(2, 'Medio tiempo'),
(3, 'Contrato temporal'),
(4, 'Freelance'),
(5, 'Prácticas profesionales'),
(6, 'Contrato indefinido'),
(7, 'Contrato por obra');

-- Estados de Postulación (tabla: estado)
INSERT INTO estado (id, nombre) VALUES
(1, 'Pendiente'),
(2, 'En Revisión'),
(3, 'Preseleccionado'),
(4, 'Rechazado'),
(5, 'Aceptado'),
(6, 'Finalizado');

-- Géneros
INSERT INTO genero (genero_id, nombre) VALUES
(1, 'Masculino'),
(2, 'Femenino'),
(3, 'Prefiero no decir');

-- Beneficios
INSERT INTO beneficio (beneficio_id, nombre) VALUES
(1, 'Seguro médico'),
(2, 'Seguro de vida'),
(3, 'Bonificaciones'),
(4, 'Comisiones'),
(5, 'Capacitación'),
(6, 'Días de teletrabajo'),
(7, 'Horario flexible'),
(8, 'Auxilio de transporte'),
(9, 'Auxilio de alimentación'),
(10, 'Primas extralegales');

-- Consultas de verificación
SELECT * FROM departamento;
SELECT * FROM municipio;
SELECT * FROM nivel_educativo;
SELECT * FROM empresa_categoria;
SELECT * FROM empresa;
SELECT * FROM modalidad;
SELECT * FROM tipo_contrato;
SELECT * FROM estado;
SELECT * FROM genero;
SELECT * FROM beneficio;
