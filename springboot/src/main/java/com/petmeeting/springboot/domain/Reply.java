package com.petmeeting.springboot.domain;

import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reply {
    @Id
    @GeneratedValue
    @Column(name = "reply_no")
    private Integer replyNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no")
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_no")
    private Board board;

    @Column(name = "content", columnDefinition = "text", nullable = false)
    private String content;

    @Column(name = "created_time", nullable = false)
    private Integer createdTime;

    @Column(name = "modified_time")
    private Integer modifiedTime;

    @Column(name = "deleted_time")
    private Integer deletedTime;


    @OneToMany(mappedBy = "reply", fetch = FetchType.LAZY)
    private List<LikeReply> likeReplyList;




}
