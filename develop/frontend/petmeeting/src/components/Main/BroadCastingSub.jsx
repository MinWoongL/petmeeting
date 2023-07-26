import React from 'react';
import { Card, CardContent, Typography, Box, CardMedia } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 더미 데이터
const cardData = [
    {
        title: "금일동물보호센터",
        description: "갈색 점박이 보러오세요~",
        imageUrl: "https://www.animal.go.kr/front/fileMng/imageView.do?f=/files/shelter/2023/05/202307181707536.jpg"
    },
    {
        title: "칠곡 유기동물보호센터",
        description: "쌍둥이 강아지 첫 걸음마 방송",
        imageUrl: "https://www.animal.go.kr/front/fileMng/imageView.do?f=/files/shelter/2023/07/202307251307624.jpg"
    },
    {
        title: "서산시 동물보호센터",
        description: "2개월 암컷 귀염둥이",
        imageUrl: "https://www.animal.go.kr/front/fileMng/imageView.do?f=/files/shelter/2023/05/202307171707248.jpg"
    }
];

function BroadCastingSub() {
    return (
        <Box display="flex" flexDirection="row" gap={2} flexWrap="wrap" sx={{mt:2}}>
            {cardData.map((card, index) => (
                <Card key={index} style={{ width: 300 }}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={card.imageUrl}
                        alt={card.title}
                    />
                    <CardContent>
                        <Typography variant="h6">{card.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {card.description}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}

export default BroadCastingSub;
