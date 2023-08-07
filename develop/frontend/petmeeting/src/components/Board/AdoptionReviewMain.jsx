import React from "react";
import { useParams } from "react-router-dom"; // useParams 추가

export default function AdoptionReviewMain() {
    const { boardNo } = useParams(); // URL에서 boardNo 파라미터 추출

    return (
        <h1>
            하이, 게시글 번호: {boardNo}
        </h1>
    )
}
