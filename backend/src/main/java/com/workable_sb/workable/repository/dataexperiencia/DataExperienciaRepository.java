package com.workable_sb.workable.repository.dataexperiencia;

import com.workable_sb.workable.models.DataExperiencia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DataExperienciaRepository extends JpaRepository<DataExperiencia, Integer> {
    // Métodos custom si se requieren
}
