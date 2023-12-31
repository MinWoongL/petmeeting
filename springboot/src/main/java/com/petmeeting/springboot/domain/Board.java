package com.petmeeting.springboot.domain;

import com.petmeeting.springboot.dto.board.BoardUpdateReqDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Builder
@DynamicInsert
@NoArgsConstructor
@AllArgsConstructor
public class Board {
    @Id @GeneratedValue
    @Column(name = "board_no")
    private Integer boardNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_no")
    private Member member;

    @Column(name = "image_path")
    private String imagePath;

    @OneToMany(mappedBy = "board", fetch = FetchType.LAZY)
    private List<Reply> replyList;

    @OneToMany(mappedBy = "board", fetch = FetchType.LAZY)
    private List<LikeBoard> likeBoardList;


    @Column(name = "title", length = 100, nullable = false)
    private String title;

    @Column(name = "content", columnDefinition = "text", nullable = false)
    private String content;

    @Column(name = "created_time", nullable = false)
    private Long createdTime;

    @Column(name = "modified_time")
    private Long modifiedTime;

    @Column(name = "deleted_time")
    private Long deletedTime;

    @Column(name = "view_cnt", nullable = false)
    @ColumnDefault("0")
    private Integer viewCnt;

    public void increaseViewCnt() {
        this.viewCnt++;
    }

    public void updateBoard(BoardUpdateReqDto boardUpdateReqDto) {
        this.title = boardUpdateReqDto.getTitle() == null ? this.title : boardUpdateReqDto.getTitle();
        this.content = boardUpdateReqDto.getContent() == null ? this.content : boardUpdateReqDto.getContent();
        this.imagePath = boardUpdateReqDto.getImagePath() == null ? this.imagePath : boardUpdateReqDto.getImagePath();
        this.modifiedTime = System.currentTimeMillis() / 1000L;
    }

    public void deleteBoard() {
        this.deletedTime = System.currentTimeMillis() / 1000L;
    }
}
