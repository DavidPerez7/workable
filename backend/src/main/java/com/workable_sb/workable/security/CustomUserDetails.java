package com.workable_sb.workable.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import java.util.Collection;

public class CustomUserDetails extends User {
    
    private final Long usuarioId;
    
    public CustomUserDetails(String username, String password, Collection<? extends GrantedAuthority> authorities, Long usuarioId) {
        super(username, password, authorities);
        this.usuarioId = usuarioId;
    }
    
    public Long getUsuarioId() {
        return usuarioId;
    }
}
