package com.workable_sb.workable.repository.dataestudio;

import com.workable_sb.workable.models.DataEstudio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DataEstudioRepository extends JpaRepository<DataEstudio, Integer> {
    List<DataEstudio> findByUsuarioId(Integer usuarioId);
    List<DataEstudio> findByEstado(DataEstudio.EstadoType estado);
}
