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
        Integer shelterNo = condition.getShelterNo();

        if(shelterNo == 0 || shelterNo == null) {
            return jpaQueryFactory.selectFrom(dog)
                    .where(dog.isDeleted.eq(false),
                            containsName(condition.getName()),
                            sameDogSize(condition.getDogSize()),
                            notContainsShelter())
                    .limit(condition.getMax() == 0 ? 10 : condition.getMax())
                    .offset(condition.getOffset() == 0 ? 1 : condition.getOffset())
                    .fetch();
        }

        return jpaQueryFactory.selectFrom(dog)
                .where(dog.isDeleted.eq(false),
                        containsName(condition.getName()),
                        sameDogSize(condition.getDogSize()),
                        containsShelter(condition.getShelterNo()))
                .limit(condition.getMax() == 0 ? 10 : condition.getMax())
                .offset(condition.getOffset() == null ? 1 : condition.getOffset())
                .fetch();
    }

    private BooleanExpression containsName(String name) {
        if(name == null)
            return null;

        return dog.name.contains(name)
                .or(dog.name.startsWith(name))
                .or(dog.name.endsWith(name));
    }

    private BooleanExpression sameDogSize(DogSize size) {
        if(size == null)
            return null;

        return dog.dogSize.eq(size);
    }

    /**
     * 보호소 번호를 함께 조회하면 입양상태와 무관하게
     * 보호소가 등록했던 모든 유기견 중 현재 조건에 맞는(이름, 사이즈) 리스트가 조회된다.
     * @param shelterNo
     * @return
     */
       private BooleanExpression containsShelter(Integer shelterNo){
        return dog.shelter.id.eq(shelterNo);
       }

    /**
     * 보호소 번호 없이 조회하면
     * 현재 조건에 맞는 리스트 중 입양가능(ADOPT_POSSIBLE)한 리스트만 조회된다.
     * @return
     */
    private BooleanExpression notContainsShelter(){
        return dog.adoptionAvailability.eq(AdoptionAvailability.ADOPT_POSSIBLE);
       }






    //    /**
//     * 보호소 번호를 검색하면 해당 보호소의 모든 유기견이 조회된다.(입양상태 무관)
//     * 보호소 번호가 null이면 입양 가능한 유기견만 조회된다.
//     * @param shelterNo
//     * @return
//     */
//    private BooleanExpression containsShelterNo(Integer shelterNo) {
//        // 보호소 번호가 없으면
//        if(shelterNo == 0 || shelterNo == null) {
//            // 입양 가능한 강아지만 나온다.
//            return dog.adoptionAvailability.eq(AdoptionAvailability.ADOPT_POSSIBLE);
//        }
//
//        // 보호소 번호가 있으면
//        // 같은 보호소번호를 가진 모든 강아지 검색
//        return dog.shelter.id.eq(shelterNo);
//       }

}
