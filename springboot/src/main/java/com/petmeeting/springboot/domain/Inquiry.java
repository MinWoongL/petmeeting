package com.petmeeting.springboot.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;

@Entity
@Getter
@Builder
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
    private Integer createdTime;

    @Column(name = "modified_time")
    private Integer modifiedTime;

    @Column(name = "deleted_time")
    private Integer deletedTime;

    @Column(name = "status")
    @ColumnDefault("false")
    private Boolean status; // 답변이 있을경우 True

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_no")
    private Answer answer;


}
