package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Adoption;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.adoption.AdoptionSearchCondition;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.petmeeting.springboot.domain.QAdoption.adoption;

@Repository
@RequiredArgsConstructor
public class AdoptionQueryDslRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public List<Adoption> findByCondition(AdoptionSearchCondition condition, Users user) {

        return jpaQueryFactory.selectFrom(adoption)
                .where(findUserGroup(user),
                        containsDogNo(condition.getDogNo()))
                .limit(condition.getMax() == 0 ? 10 : condition.getMax())
                .offset(condition.getOffset() == null ? 0 : condition.getOffset())
                .orderBy(adoption.adoptionNo.desc())
                .fetch();
    }

    /**
     * 로그인한 사용자(파라미터)에 따라 조건이 달라진다.
     * @param user
     * @return
     */
    private BooleanExpression findUserGroup(Users user) {
        if(user instanceof Member)
            return adoption.member.id.eq(user.getId());

        if(user instanceof Shelter)
            return adoption.shelter.id.eq(user.getId());

        return null;
    }

    /**
     * 검색 조건에 강아지번호를 입력했는지에 따라 조건이 달라진다.
     * @param dogNo
     * @return
     */
    private BooleanExpression containsDogNo(Integer dogNo) {
        if(dogNo == null || dogNo == 0)
            return null;

        return adoption.dog.dogNo.eq(dogNo);
    }


}
