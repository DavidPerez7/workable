-- Fix wrong foreign key from empresa.reclutador_owner_id to usuario(id)
-- Should reference reclutador(id)

ALTER TABLE empresa
  DROP FOREIGN KEY FK_empresa_owner;

ALTER TABLE empresa
  MODIFY COLUMN reclutador_owner_id BIGINT NULL;

ALTER TABLE empresa
  ADD CONSTRAINT FK_empresa_owner
  FOREIGN KEY (reclutador_owner_id)
  REFERENCES reclutador(id)
  ON DELETE SET NULL
  ON UPDATE CASCADE;
