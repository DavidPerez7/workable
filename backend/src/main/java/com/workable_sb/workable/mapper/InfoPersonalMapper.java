package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.InfoPersonalDto;
import com.workable_sb.workable.models.InfoPersonal;

public interface InfoPersonalMapper {
    InfoPersonal consult(InfoPersonalDto infoPersonalDto);
    InfoPersonalDto consultDto(InfoPersonal entity); 
}
