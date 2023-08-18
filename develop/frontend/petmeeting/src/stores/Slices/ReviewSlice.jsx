import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reviewData: [
        {
            id: 1,
            title: "전라광주본점",
            shortDescription: "쫑이를 소개합니다",
            fullDescription: "첫 번째로 입양한 강아지 쫑이는 정말 특별했어요. 우리 가족과 함께 보낸 시간은 너무나도 소중했습니다.",
            date: "2023-07-01",
            image: "https://cdn.imweb.me/upload/S201711105a050488bde89/ab10531553b32.jpg"
        },
        {
            id: 2,
            title: "부산본점",
            shortDescription: "볶음이가 가족이 되어주었어요",
            fullDescription: "볶음이는 매우 영리하고, 때론 우리를 놀라게 했지만, 그럼에도 불구하고 너무 사랑스러웠습니다.",
            date: "2023-07-15",
            image: "https://cdn.imweb.me/upload/S201711105a050488bde89/8c1432695d10b.jpg"
        },
        {
            id: 3,
            title: "김해창원점",
            shortDescription: "이탈리안 그레이하운드 '바오'!",
            fullDescription: "바오의 매력에 가족 모두가 너무 행복해하고있어요. 바오의 친구를 만들어주고 싶어서 다른 강아지를 또 입양할까해요!",
            date: "2023-07-15",
            image: "https://cdn.imweb.me/upload/S201711105a050488bde89/aa55b11369403.jpg"
        },
    ]

}


const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {

    }
})

export default reviewSlice.reducer