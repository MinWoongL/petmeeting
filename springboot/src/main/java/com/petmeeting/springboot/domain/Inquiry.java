package com.petmeeting.springboot.domain;

import com.petmeeting.springboot.dto.inquiry.InquiryReqDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;

@Entity
@Getter
@Builder
@DynamicInsert
@NoArgsConstructor
@AllArgsConstructor
public class Inquiry {

    @Id @GeneratedValue
    @Column(name = "inquiry_no")
    private Integer inquiryNo;

    @JoinColumn(name = "user_no")
    @ManyToOne(fetch = FetchType.LAZY)
    private Users user;

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

    @Column(name = "status")
    @ColumnDefault("false")
    private Boolean status; // 답변이 있을경우 True

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_no")
    private Answer answer;

    public void delete() {
        this.deletedTime = System.currentTimeMillis() / 1000L;
    }

    public void update(InquiryReqDto inquiryReqDto) {
        this.title = inquiryReqDto.getTitle() == null ? this.title : inquiryReqDto.getTitle();
        this.content = inquiryReqDto.getContent() == null ? this.content : inquiryReqDto.getContent();
        this.modifiedTime = System.currentTimeMillis() / 1000L;
    }

    public void makeAnswer(Answer answer) {
        this.answer = answer;
        this.status = true;
    }
}
