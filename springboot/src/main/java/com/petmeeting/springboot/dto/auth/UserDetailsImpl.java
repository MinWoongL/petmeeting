package com.petmeeting.springboot.dto.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.petmeeting.springboot.domain.Admin;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Shelter;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Arrays;
import java.util.Collection;
import java.util.Objects;

@Getter
public class UserDetailsImpl implements UserDetails {
    private Integer id;
    private String userId;
    @JsonIgnore
    private String password;
    private String authority;

    public UserDetailsImpl(Integer id, String userId, String password, String authority) {
        this.id = id;
        this.userId = userId;
        this.password = password;
        this.authority = authority;
    }

    public static BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public static String encoding(String userId) {
        return passwordEncoder.encode(userId);
    }

    public static UserDetailsImpl buildFromMember(Member member){

        return new UserDetailsImpl(
                member.getId(),
                member.getUserId(),
                encoding(member.getName()),
                member.getUserGroup().name()
        );
    }

    public static UserDetailsImpl buildFromShelter(Shelter shelter){
        return new UserDetailsImpl(
                shelter.getId(),
                shelter.getUserId(),
                encoding(shelter.getName()),
                shelter.getUserGroup().name()
        );
    }

    public static UserDetails buildFromAdmin(Admin admin) {
        return new UserDetailsImpl(
                admin.getId(),
                admin.getUserId(),
                encoding(admin.getName()),
                admin.getUserGroup().name()
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Arrays.asList(new SimpleGrantedAuthority(authority));
    }

    @Override
    public String getUsername() {
        return userId;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}