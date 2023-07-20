package com.petmeeting.springboot.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Board {
    @Id @GeneratedValue
    @Column(name = "board_no")
    private Integer boardNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_no")
    private Member member;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "image_no")
    private Image image;

    @OneToMany(mappedBy = "board", fetch = FetchType.LAZY)
    private List<Reply> replyList;

    @OneToMany(mappedBy = "board", fetch = FetchType.LAZY)
    private List<LikeBoard> likeBoardList;
}
