package com.petmeeting.springboot.domain;

import com.petmeeting.springboot.dto.reply.ReplyUpdateReqDto;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamicInsert
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
    private Long createdTime;

    @Column(name = "modified_time")
    private Long modifiedTime;

    @Column(name = "deleted_time")
    private Long deletedTime;

    @Column(name = "like_cnt", nullable = false)
    @ColumnDefault("0")
    private Integer likeCnt;

    @OneToMany(mappedBy = "reply", fetch = FetchType.LAZY)
    private List<LikeReply> likeReplyList;

    @PrePersist
    public void prePersist() {
        this.createdTime = createdTime == null ? System.currentTimeMillis() / 1000L : createdTime;
    }

    public void updateLikeCnt(Boolean isLike) {
        if(isLike)
            this.likeCnt += 1;
        else
            this.likeCnt -= 1;
    }

    public void updateReply(ReplyUpdateReqDto reqDto) {
        this.content = reqDto.getContent() == null ? this.content : reqDto.getContent();
        this.modifiedTime = System.currentTimeMillis() / 1000L;
    }

    public void deleteReply() {
        this.deletedTime = System.currentTimeMillis() / 1000L;
    }
}
