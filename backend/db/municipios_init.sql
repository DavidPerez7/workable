-- Script para insertar municipios básicos
-- Compatible con el modelo Municipio.java que usa enum Departamento

-- Desactivar modo seguro temporalmente
SET SQL_SAFE_UPDATES = 0;

-- Limpiar tabla si existe (usar DELETE en lugar de TRUNCATE por las foreign keys)
DELETE FROM municipio;

-- Reactivar modo seguro
SET SQL_SAFE_UPDATES = 1;

-- Municipios principales de Colombia
INSERT INTO municipio (id, nombre, departamento) VALUES
(1, 'Bogotá D.C.', 'BOGOTA_DC'),
(2, 'Medellín', 'ANTIOQUIA'),
(3, 'Bello', 'ANTIOQUIA'),
(4, 'Itagüí', 'ANTIOQUIA'),
(5, 'Envigado', 'ANTIOQUIA'),
(6, 'Rionegro', 'ANTIOQUIA'),
(7, 'Cali', 'VALLE_DEL_CAUCA'),
(8, 'Barranquilla', 'ATLANTICO'),
(9, 'Bucaramanga', 'SANTANDER'),
(10, 'Cartagena', 'BOLIVAR'),
(11, 'Cúcuta', 'NORTE_DE_SANTANDER'),
(12, 'Pereira', 'RISARALDA'),
(13, 'Manizales', 'CALDAS'),
(14, 'Armenia', 'QUINDIO'),
(15, 'Ibagué', 'TOLIMA'),
(16, 'Villavicencio', 'META'),
(17, 'Pasto', 'NARINO'),
(18, 'Neiva', 'HUILA'),
(19, 'Santa Marta', 'MAGDALENA'),
(20, 'Montería', 'CORDOBA');
