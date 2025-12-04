-- ============================================================
-- INSERCIONES DE ENTIDADES FUERTES
-- ============================================================

-- Municipios (entidad fuerte - 10 registros)
INSERT INTO municipio (id, nombre, departamento) VALUES
(1, 'BOGOTA D.C', 'BOGOTA_DC'),
(2, 'MEDELLIN', 'ANTIOQUIA'),
(3, 'BELLO', 'ANTIOQUIA'),
(4, 'ITAGUI', 'ANTIOQUIA'),
(5, 'ENVIGADO', 'ANTIOQUIA'),
(6, 'CALI', 'VALLE_DEL_CAUCA'),
(7, 'BARRANQUILLA', 'ATLANTICO'),
(8, 'BUCARAMANGA', 'SANTANDER'),
(9, 'CARTAGENA', 'BOLIVAR'),
(10, 'PEREIRA', 'RISARALDA');

-- Habilidades (entidad fuerte - 10 registros)
INSERT INTO habilidad (id, nombre, tipo, is_active) VALUES
(1, 'Java', 'TECNICA', true),
(2, 'Python', 'TECNICA', true),
(3, 'JavaScript', 'TECNICA', true),
(4, 'React', 'TECNICA', true),
(5, 'Spring Boot', 'TECNICA', true),
(6, 'SQL', 'TECNICA', true),
(7, 'Docker', 'TECNICA', true),
(8, 'AWS', 'TECNICA', true),
(9, 'Inglés', 'IDIOMA', true),
(10, 'Liderazgo', 'BLANDA', true);

-- ============================================================
-- FIN DE INSERCIONES
-- ============================================================
