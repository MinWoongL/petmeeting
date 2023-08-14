import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dogData: [
        {
            title: "금일동물보호센터(1)",
            description: "갈색 점박이 보러오세요~",
            imageUrl: "https://www.animal.go.kr/front/fileMng/imageView.do?f=/files/shelter/2023/05/202307181707536.jpg"
        },
        {
            title: "칠곡 유기동물보호센터(2)",
            description: "쌍둥이 강아지 첫 걸음마 방송",
            imageUrl: "https://www.animal.go.kr/front/fileMng/imageView.do?f=/files/shelter/2023/07/202307251307624.jpg"
        },
        {
            title: "서산시 동물보호센터(3)",
            description: "2개월 암컷 귀염둥이",
            imageUrl: "https://www.animal.go.kr/front/fileMng/imageView.do?f=/files/shelter/2023/05/202307171707248.jpg"
        },
        {
            title: "네번째 보호센터",
            description: "새로운 친구들이 기다려요",
            imageUrl: "https://www.animal.go.kr/front/fileMng/imageView.do?f=/files/shelter/2023/05/20230717170761.jpg"
        },
        {
            title: "다섯번째 보호센터",
            description: "행복한 하루 보내세요",
            imageUrl: "https://www.animal.go.kr/front/fileMng/imageView.do?f=/files/shelter/2023/05/202307170807165.jpg"
        },
        {
            title: "여섯번째 동물보호센터",
            description: "아름다운 자연 속에서",
            imageUrl: "https://www.animal.go.kr/front/fileMng/imageView.do?f=/files/shelter/2023/05/202307170807663.jpg"
        }
    ],
    
};

const dogSlice = createSlice({
    name: 'dogs',
    initialState,
    reducers: {

    }
})

export default dogSlice.reducer;