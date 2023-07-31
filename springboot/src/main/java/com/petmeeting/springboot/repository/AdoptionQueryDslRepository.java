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

    public List<Adoption> findByCondition(AdoptionSearchCondition condition) {
        Users user = condition.getUser();

        return jpaQueryFactory.selectFrom(adoption)
                .where(findUserGroup(user),
                        containsDogNo(condition.getDogNo()))
                .limit(condition.getMax() == 0 ? 10 : condition.getMax())
                .offset(condition.getOffset() == 0 ? 1 : condition.getOffset())
                .fetch();
    }

    /**
     * 로그인한 사용자(파라미터)에 따라 조건이 달라진다.
     * @param user
     * @return
     */
    private BooleanExpression findUserGroup(Users user) {
        if(user instanceof Member) {
            return adoption.member.id.eq(user.getId());
        }

        else if(user instanceof Shelter) {
            return adoption.shelter.id.eq(user.getId());
        }

        return null;
    }

    private BooleanExpression containsDogNo(Integer dogNo) {
        if(dogNo == 0 || dogNo == null)
            return null;

        return adoption.dog.dogNo.eq(dogNo);
    }


}
