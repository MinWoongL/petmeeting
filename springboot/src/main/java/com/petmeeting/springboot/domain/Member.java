package com.petmeeting.springboot.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@SuperBuilder
@NoArgsConstructor
@DiscriminatorColumn(name = "ROLE_MEMBER", length = 10)
public class Member extends Users {
    @Transient
    private Role userGroup = Role.ROLE_MEMBER;

    // 여기서 꺼낸 Board를 List에서 삭제해도 Board의 상태는 변경 X
    @OneToMany(mappedBy = "member")
    private List<Board> boardList;
}
