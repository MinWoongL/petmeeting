package com.petmeeting.springboot.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;

@Entity
@Getter
@SuperBuilder
@NoArgsConstructor
@DiscriminatorColumn(name = "ROLE_MEMBER", length = 10)
public class Member extends Users {
    @Transient
    private Role userGroup = Role.ROLE_MEMBER;
}
