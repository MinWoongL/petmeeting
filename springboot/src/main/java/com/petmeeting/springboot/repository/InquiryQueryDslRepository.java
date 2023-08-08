package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Inquiry;
import com.petmeeting.springboot.dto.inquiry.InquirySearchCondition;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.petmeeting.springboot.domain.QInquiry.inquiry;

@Repository
@RequiredArgsConstructor
public class InquiryQueryDslRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public List<Inquiry> findByCondition(InquirySearchCondition inquirySearchCondition) {
        if (inquirySearchCondition.getOption() != null && inquirySearchCondition.getOption().contains("all")) {
            return jpaQueryFactory.selectFrom(inquiry)
                    .where(inquiry.deletedTime.isNull(),
                            containsTitle(inquirySearchCondition.getTitle()))
                    .orderBy(inquiry.createdTime.desc())
                    .fetch();
        }

        return jpaQueryFactory.selectFrom(inquiry)
                .where(inquiry.deletedTime.isNull(),
                        containsTitle(inquirySearchCondition.getTitle()))
                .limit(inquirySearchCondition.getMax())
                .offset(inquirySearchCondition.getOffset())
                .orderBy(inquiry.createdTime.desc())
                .fetch();
    }

    private BooleanExpression containsTitle(String title) {
        if (title == null)
            return null;

        return inquiry.title.contains(title)
                .or(inquiry.title.startsWith(title))
                .or(inquiry.title.endsWith(title));
    }
}
