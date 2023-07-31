import React, { useState } from 'react';
import { Card, Typography, Box, CardMedia, Avatar, Button } from '@mui/material';
import { useSelector } from 'react-redux';



function BroadCastingSub() {
    const [startIndex, setStartIndex] = useState(0);
    const itemsToShow = 3;
    const cardData = useSelector(state => state.dogs.dogData)

    const handlePrev = () => {
        if (startIndex === 0) {
            setStartIndex(cardData.length - 1);
        } else {
            setStartIndex(startIndex - 1);
        }
    };

    const handleNext = () => {
        if (startIndex === cardData.length-1){
            setStartIndex(0)
        }
        else {
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
