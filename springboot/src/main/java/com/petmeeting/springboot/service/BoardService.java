package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Board;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.board.BoardCreateReqDto;
import com.petmeeting.springboot.dto.board.BoardCreateResDto;
import com.petmeeting.springboot.dto.board.BoardResDto;
import com.petmeeting.springboot.dto.board.BoardSearchCondition;
import com.petmeeting.springboot.repository.BoardQueryDslRepository;
import com.petmeeting.springboot.repository.BoardRepository;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BoardService {
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final BoardQueryDslRepository boardQueryDslRepository;

    @Transactional
    public BoardCreateResDto createBoard(BoardCreateReqDto boardCreateReqDto, String token) {
        Integer userNo = jwtUtils.getUserNo(token);
        Users user = userRepository.findById(userNo).get();

        if (!((Member) user).getAdopted()) {
            log.error("[입양 후기 작성] 입양하지 않은 회원입니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "입양하지 않은 회원입니다.");
        }

        log.info("[입양 후기 작성] userId : {}", user.getUserId());

        Board board = Board.builder()
                .member((Member) user)
                .title(boardCreateReqDto.getTitle())
                .content(boardCreateReqDto.getContent())
                .createdTime(System.currentTimeMillis() / 1000L)
                .imagePath(boardCreateReqDto.getImagePath())
                .build();

        boardRepository.save(board);

        log.info("[입양 후기 작성] boardNo : {}", board.getBoardNo());

        return BoardCreateResDto.builder()
                .boardNo(board.getBoardNo())
                .build();
    }

    @Transactional
    public BoardResDto getBoard(Integer boardNo) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> {
                    log.error("[입양후기 가져오기] 입양후기를 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "입양후기를 찾을 수 없습니다.");
                });

        if (board.getDeletedTime() != null) {
            log.error("[입양후기 가져오기] 삭제된 게시글입니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "삭제된 게시글입니다.");
        }

        board.increaseViewCnt();
        boardRepository.save(board);

        log.info("[입양후기 가져오기] boardTitle : {}", board.getTitle());
        return BoardResDto.builder().build().entityToDto(board);
    }

    @Transactional
    public List<BoardResDto> getBoardList(BoardSearchCondition searchCondition) {
        return boardQueryDslRepository.findByCondition(searchCondition).stream()
                .map(board -> {
                    Member member = board.getMember();
                    return BoardResDto.builder()
                            .userNo(member.getId())
                            .writer(member.getUserId())
                            .title(board.getTitle())
                            .content(board.getContent())
                            .viewCnt(board.getViewCnt())
                            .createdTime(board.getCreatedTime())
                            .modifiedTime(board.getModifiedTime())
                            .build();
                })
                .collect(Collectors.toList());
    }
}
