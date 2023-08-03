package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Board;
import com.petmeeting.springboot.domain.LikeBoard;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.board.*;
import com.petmeeting.springboot.repository.BoardQueryDslRepository;
import com.petmeeting.springboot.repository.BoardRepository;
import com.petmeeting.springboot.repository.LikeBoardRepository;
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
    private final LikeBoardRepository likeBoardRepository;

    /**
     * 입양후기 작성
     * 입양하지 않은 회원은 작성 불가능
     * @param boardCreateReqDto
     * @param token
     * @return BoardCreateResDto
     */
    @Transactional
    public BoardCreateResDto createBoard(BoardCreateReqDto boardCreateReqDto, String token) {
        log.info("[입양 후기 작성] 입양 후기 작성 요청");

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

        log.info("[입양 후기 작성] 입양 후기 작성 완료. boardNo : {}", board.getBoardNo());

        return BoardCreateResDto.builder()
                .boardNo(board.getBoardNo())
                .build();
    }

    /**
     * 입양후기 상세정보 가져오기
     * BoardNo로 입양후기 조회 / 삭제된 게시글을 조회되지 않음
     * @param boardNo
     * @return BoardResDto
     */
    @Transactional
    public BoardResDto getBoard(Integer boardNo) {
        log.info("[입양후기 상세] 입양후기 가져오기 시작");

        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> {
                    log.error("[입양후기 상세] 입양후기를 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "입양후기를 찾을 수 없습니다.");
                });

        if (board.getDeletedTime() != null) {
            log.error("[입양후기 상세] 삭제된 게시글입니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "삭제된 게시글입니다.");
        }
        log.info("[입양후기 상세] 입양후기 viewCnt 증가");
        board.increaseViewCnt();
        boardRepository.save(board);

        log.info("[입양후기 상세] 입양후기 가져오기 완료. boardTitle : {}", board.getTitle());
        return BoardResDto.entityToDto(board);
    }

    /**
     * 입양후기 목록 조회
     * 검색 조건에 따라 입양후기 목록 조회 / 삭제된 게시글은 조회되지 않음
     * @param searchCondition
     * @return List<BoardResDto>
     */
    @Transactional
    public List<BoardResDto> getBoardList(BoardSearchCondition searchCondition) {
        log.info("[입양후기 목록] 조건에 맞는 입양후기 목록을 가져옵니다.");
        return boardQueryDslRepository.findByCondition(searchCondition).stream()
                .map(board -> BoardResDto.entityToDto(board))
                .collect(Collectors.toList());
    }

    /**
     * 입양후기 수정
     * 작성자와 수정자가 일치하지 않으면 수정 불가능 / 삭제된 게시글일 경우 불가능
     * @param boardUpdateReqDto
     * @param token
     * @return BoardResDto
     */
    @Transactional
    public BoardResDto updateBoard(Integer boardNo, BoardUpdateReqDto boardUpdateReqDto, String token) {
        log.info("[입양후기 수정] 입양후기 수정 요청.");
        Integer userNo = jwtUtils.getUserNo(token);

        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> {
                    log.error("[입양후기 수정] 게시글을 찾을 수 없습니다.");
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "입양후기를 찾을 수 없습니다.");
                });

        if (board.getDeletedTime() != null) {
            log.error("[입양후기 수정] 삭제된 게시글입니다.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제된 게시글입니다.");
        }

        if (!board.getMember().getId().equals(userNo)) {
            log.error("[입양후기 수정] 작성자와 수정자가 일치하지 않습니다. boardUser : {}, requestUser : {}", board.getMember().getId(), userNo);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성자와 수정자가 일치하지 않습니다.");
        }

        board.updateBoard(boardUpdateReqDto);
        boardRepository.save(board);

        log.info("[입양후기 수정] 입양후기 수정 완료. boardId : {}", board.getBoardNo());

        return BoardResDto.entityToDto(board);
    }

    /**
     * 입양후기 삭제
     * 작성자와 삭제자가 일치하지 않으면 삭제 불가능
     * @param boardNo
     * @param token
     */
    @Transactional
    public void deleteBoard(Integer boardNo, String token) {
        log.info("[입양후기 삭제] 입양후기 삭제 요청");

        Integer userNo = jwtUtils.getUserNo(token);

        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> {
                    log.error("[입양후기 삭제] 입양후기를 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "입양후기를 찾을 수 없습니다.");
                });

        if (!board.getMember().getId().equals(userNo)) {
            log.error("[입양후기 삭제] 작성자와 삭제자가 일치하지 않습니다. boardUserId : {}, userId : {}", board.getMember().getId(), userNo);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성자와 삭제자가 일치하지 않습니다.");
        }

        log.info("[입양후기 삭제] 입양후기 삭제. boardId : {}", board.getBoardNo());
        board.deleteBoard();
        boardRepository.save(board);
    }

    /**
     * 입양후기 좋아요 설정
     * 이미 좋아요 체크가 되어있을 경우 불가능
     * @param boardNo
     * @param token
     */
    @Transactional
    public void likeBoard(Integer boardNo, String token) {
        log.info("[입양후기 좋아요] 입양후기 좋아요 요청");

        if (checkLiked(boardNo, token)) {
            log.error("[입양후기 좋아요] 이미 좋아요를 누른 사용자입니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "이미 좋아요를 눌렀습니다.");
        }

        Integer userNo = jwtUtils.getUserNo(token);

        LikeBoard likeBoard = LikeBoard.builder()
                .board(boardRepository.findById(boardNo).orElseThrow(() -> {
                    log.error("[입양후기 좋아요] 입양후기를 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "입양후기를 찾을 수 없습니다.");
                }))
                .user(userRepository.findById(userNo).get())
                .build();

        log.info("[입양후기 좋아요] 입양후기 좋아요 생성. boardNo : {}, userNo : {}", boardNo, userNo);
        likeBoardRepository.save(likeBoard);
    }

    /**
     * 입양후기 좋아요 취소
     * 아직 좋아요 체크가 되어있지 않을 경우 불가능
     * @param boardNo
     * @param token
     */
    @Transactional
    public void dislikeBoard(Integer boardNo, String token) {
        log.info("[입양후기 좋아요 취소] 입양후기 좋아요 취소 요청");

        if (!checkLiked(boardNo, token)) {
            log.error("[입양후기 좋아요 취소] 아직 좋아요를 누르지 않은 사용자입니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "아직 좋아요를 누르지 않았습니다.");
        }

        Integer userNo = jwtUtils.getUserNo(token);

        Integer dislikeCnt = likeBoardRepository.deleteLikeBoardByUserNoAndBoardNo(userNo, boardNo);
        log.info("[입양후기 좋아요 취소] 입양후기 좋아요 취소 완료. {}개", dislikeCnt);
    }

    /**
     * 좋아요 체크
     * 좋아요를 눌렀는지 아닌지 체크
     * @param boardNo
     * @param token
     * @return
     */
    public Boolean checkLiked(Integer boardNo, String token) {
        log.info("[입양후기 좋아요 체크] 입양후기 좋아요 체크 요청");

        Integer userNo = jwtUtils.getUserNo(token);

        log.info("[입양후기 좋아요 체크] 입양후기 좋아요 체크. boardNo : {}, userNo : {}", boardNo, userNo);
        return likeBoardRepository.existsLikeBoardByUserNoAndBoardNo(userNo, boardNo);
    }
}
