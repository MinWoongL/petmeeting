package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Dog;
import com.petmeeting.springboot.dto.dog.DogSearchCondition;
import com.petmeeting.springboot.enums.AdoptionAvailability;
import com.petmeeting.springboot.enums.DogSize;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.petmeeting.springboot.domain.QDog.dog;

@Repository
@RequiredArgsConstructor
public class DogQueryDslRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public List<Dog> findByCondition(DogSearchCondition condition) {
        return jpaQueryFactory.selectFrom(dog)
                .where(dog.isDeleted.eq(false),
                        containsName(condition.getName()),
                        sameDogSize(condition.getDogSize()),
                        containsShelterNo(condition.getShelterNo()))
                .limit(condition.getMax() == null ? 10 : condition.getMax())
                .offset(condition.getOffset() == null ? 0 : condition.getOffset())
                .fetch();
    }

    private BooleanExpression containsName(String name) {
        if(name == null) {
            return null;
        }

        return dog.name.contains(name)
                .or(dog.name.startsWith(name))
                .or(dog.name.endsWith(name));
    }

    private BooleanExpression sameDogSize(DogSize size) {
        if(size == null) {
            return null;
        }

        return dog.dogSize.eq(size);
    }

    // 검색조건에 보호소번호가 있는지에 따라 검색 결과가 달라짐
    private BooleanExpression containsShelterNo(Integer shelterNo) {
        // 보호소 번호가 있으면
        if(shelterNo != null) {
            // 같은 보호소번호를 가진 모든 강아지 검색
            return dog.shelter.id.eq(shelterNo);
        }

        // 보호소 번호가 없으면
        // 입양 가능한 강아지만 나온다.
        return dog.adoptionAvailability.eq(AdoptionAvailability.ADOPT_POSSIBLE);
    }


}
