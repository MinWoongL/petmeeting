import React, { useState } from 'react';
import { Card, Typography, Box, CardMedia, Avatar, Button } from '@mui/material';

const cardData = [
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
];

function BroadCastingSub() {
    const [startIndex, setStartIndex] = useState(0);
    const itemsToShow = 3;

    const handlePrev = () => {
        if (startIndex === 0) {
            setStartIndex(cardData.length - 1);
        } else {
            setStartIndex(startIndex - 1);
        }
    };

    const handleNext = () => {
        if (startIndex + itemsToShow - 1 === cardData.length - 1) {
            setStartIndex(0);
        } else {
            setStartIndex(startIndex + 1);
        }
    };

    const getVisibleCards = () => {
        let visibleCards = cardData.slice(startIndex, startIndex + itemsToShow);
        while (visibleCards.length < itemsToShow) {
            visibleCards = [...visibleCards, ...cardData.slice(0, itemsToShow - visibleCards.length)];
        }
        return visibleCards;
    };

    return (
        <Box sx={{ mt: 1 }}>
            {/* Title and Description */}
            <Box sx={{ mb: 1 }}>
                <Typography variant="h5" gutterBottom>
                    보호소 방송국 채널
                </Typography>
            </Box>
            <Button onClick={handlePrev}>Prev</Button>
            <Button onClick={handleNext}>Next</Button>
            <Box display="flex" flexDirection="row" gap={2} flexWrap="wrap">
                {getVisibleCards().map((card, index) => (
                    <Card key={index} style={{ width: 300 }}>
                        <CardMedia
                            component="img"
                            height="160"
                            image={card.imageUrl}
                            alt={card.title}
                        />
                        <Box display="flex" alignItems="center" sx={{ p: 2 }}>
                            <Avatar src={card.imageUrl} alt={card.title} />
                            <Box sx={{ ml: 3 }} style={{ height: 45 }}>
                                <Typography variant="h6" style={{ fontFamily: 'Jua' }}>{card.title}</Typography>
                                <Typography variant="body2" color="textSecondary" style={{ fontFamily: 'Poor Story' }}>
                                    {card.description}
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}

export default BroadCastingSub;
