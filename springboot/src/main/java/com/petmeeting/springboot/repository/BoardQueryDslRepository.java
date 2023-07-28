package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Board;
import com.petmeeting.springboot.dto.board.BoardSearchCondition;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.petmeeting.springboot.domain.QBoard.board;

@Repository
@RequiredArgsConstructor
public class BoardQueryDslRepository {
    private final JPAQueryFactory jpaQueryFactory;

    public List<Board> findByCondition(BoardSearchCondition condition) {
        return jpaQueryFactory.selectFrom(board)
                .where(board.boardNo.isNotNull(),
                        board.deletedTime.isNull(),
                        option(condition))
                .limit(condition.getMax() == null ? 10 : condition.getMax())
                .offset(condition.calculateOffset())
                .fetch();
    }

    private BooleanExpression option(BoardSearchCondition condition) {
        if (condition.getOption() != null && condition.getOption().equals("all")) {
            return null;
        }
        if (condition.getTitle() == null)
            return null;

        return board.title.contains(condition.getTitle());
    }
}
