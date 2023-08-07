import React, { useState } from "react";

function AdoptionReviewList(props) {
  const [hovered, setHovered] = useState(false);

  const adoptionReviewListStyle = {
    backgroundColor: 'white', // 배경색을 하얀색으로 설정
    border: '1px solid black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // 가운데 정렬
    height: '93%', // 높이를 100%로 설정
    padding: '10px',
    boxSizing: 'border-box', // padding이 높이를 변경하지 않도록 함
    borderRadius: '10px', // 가장자리 부드럽게
    transition: 'transform 0.3s, box-shadow 0.3s', // 트랜지션 효과 추가
    cursor: 'pointer', // 커서 변경
    transform: hovered ? 'scale(1.02)' : 'scale(1)', // 마우스 오버 시 확대 효과
    boxShadow: hovered ? '0px 4px 8px rgba(0, 0, 0, 0.1)' : 'none', // 그림자 효과
  };
  const imageContainerStyle = {
    flex: 1, // 이미지 컨테이너가 나머지 공간을 차지하도록 함
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // 이미지가 컨테이너를 벗어나지 않도록 함
  };
  const imageStyle = {
    width: '100%', // 이미지가 컨테이너 너비에 맞게 표시
    height: '100%', // 이미지가 컨테이너 높이에 맞게 표시
    objectFit: 'cover', // 이미지 비율을 유지하면서 컨테이너에 맞춤
  };
  const titleStyle = {
    fontSize: '1.2rem', // 가독성 좋게 크기 조절
    textAlign: 'center', // 가운데 정렬
    marginBottom: '5px', // 아래쪽 여백 추가
    whiteSpace: 'nowrap', // 텍스트 줄바꿈 방지
    overflow: 'hidden', // 넘치는 부분 감춤
    textOverflow: 'ellipsis', // 넘치는 부분에 ... 표시
    padding: '10px 0 0 0'
  };
  const likeCntStyle = {
    fontSize: '0.8rem', // 작게 크기 조절
    color: 'red', // 빨간 글씨로 변경
    whiteSpace: 'nowrap', // 텍스트 줄바꿈 방지
    overflow: 'hidden', // 넘치는 부분 감춤
    textOverflow: 'ellipsis', // 넘치는 부분에 ... 표시
    padding: '15px 0 0 0',
    textAlign: 'right', // 오른쪽 정렬
  };
  const titleContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '7fr 2fr',
    margin: '0px 0px 0px 0px'
  }

  const imageUrl = "https://i9a203.p.ssafy.io/backapi/api/v1/image/" + props.board.imagePath + "?option=board"
  console.log(props.board)

  return (
    <div
      style={adoptionReviewListStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={imageContainerStyle}>
        <img src={imageUrl} alt="입양후기 사진" style={imageStyle} />
      </div>
      <div style={titleContainerStyle}>
        <span style={titleStyle}>{props.board.title}</span>
        <span style={likeCntStyle}>좋아요 {props.board.likeCnt}개</span>
      </div>
    </div>
  )
}

export default AdoptionReviewList;
