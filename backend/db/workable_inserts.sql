INSERT INTO departamento (departamento_id, nombre) VALUES
(1,'BOGOTA D.C'),(2,'ANTIOQUIA');
INSERT INTO municipio (municipio_id, nombre, departamento_id) VALUES
(1,'BOGOTA D.C', 1),(2,'MEDELLIN', 2),(3, 'BELLO', 2),(4, 'ITAGUI', 2),(5, 'ENVIGADO', 2),(6, 'RIONEGRO', 2);
INSERT INTO tipo_documento (tipo_documento_id, nombre, numero_documento) VALUES
(1, 'C.C', 123456789), (2, 'T.I', 987654321);
INSERT INTO categoria (categoria_id, nombre, imagen, descripcion) VALUES
(1, 'TECNOLOGIA', '', 'Empresas dedicadas a desarrollo de software y servicios TI'),
(2, 'SALUD', '', 'Instituciones de atención médica y servicios de salud'),
(3, 'EDUCACION', '', 'Organizaciones dedicadas a procesos educativos'),
(4, 'FINANZAS', '', 'Entidades bancarias y de servicios financieros'),
(5, 'COMERCIO', '', 'Comercios al por mayor y por menor'),
(6, 'ALIMENTICIOS', '', 'Empresas dedicadas a la producción y distribución de alimentos y bebidas');
INSERT INTO empresa (nombre, ubicacion, descripcion, categoria_id, municipio_id)
VALUES 
('SoftCorp', 'Bogotá, Colombia', 'Consultoría en software y ciberseguridad', 1, 2),
('AgroTech', 'Cali, Colombia', 'Soluciones tecnológicas para el agro', 2, 1),
('EduFuture', 'Barranquilla, Colombia', 'Plataformas educativas innovadoras', 3, 5);
INSERT INTO modalidad (modalidad_id, nombre) VALUES (1, 'Presencial'), (2, 'Remoto'),(3, 'Híbrido');
INSERT INTO tipo_contrato (tipo_contrato_id, nombre) VALUES
(1, 'Tiempo completo'),(2, 'Medio tiempo'),(3, 'Contrato temporal'), (4, 'Freelance'), (5, 'Prácticas profesionales');
INSERT INTO estado (estado_id, nombre) VALUES (1, 'Activo'), (2, 'Inactivo'), (3, 'Pendiente');
INSERT INTO genero (genero_id, nombre) VALUES (1, 'Masculino'), (2, 'Femenino');
-- Consultas de ejemplo
SELECT * FROM departamento;
SELECT * FROM municipio;
SELECT * FROM tipo_documento;
SELECT * FROM categoria;
SELECT * FROM empresa;
SELECT * FROM modalidad;
SELECT * FROM tipo_contrato;
SELECT * FROM estado;
SELECT * FROM genero;
SELECT * FROM aspirante;
-- SELECT * FROM oferta;
-- SELECT * FROM postulacion;
-- SELECT * FROM valoracion;
