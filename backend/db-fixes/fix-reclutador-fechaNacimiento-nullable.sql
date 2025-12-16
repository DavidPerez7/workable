-- Allow NULL for reclutador.fecha_nacimiento to match entity model
ALTER TABLE reclutador
  MODIFY COLUMN fecha_nacimiento DATE NULL;