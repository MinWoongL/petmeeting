import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';  // Importing useSelector hook
import { Box, Typography, Avatar, Button, Dialog, DialogTitle } from '@mui/material';

function BroadCastingView({ timerLimit = 10 }) {
    const [seconds, setSeconds] = useState(timerLimit);
    const [isPlaying, setIsPlaying] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    // Using the useSelector hook to get user state from the Redux store
    const currentUser = useSelector((state) => state.user);
    const isLoggedIn = currentUser.isLoggedIn;
    const currentUserId = currentUser.userId;

    useEffect(() => {
        let interval;
        if (isPlaying && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds - 1);
            }, 1000);
        }

        if (isPlaying && seconds === 0) {
            setIsPlaying(false);
            setOpenDialog(true);
        }

        return () => clearInterval(interval);
    }, [isPlaying, seconds]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handlePlayClick = () => {
        setIsPlaying(true);
        setSeconds(timerLimit);
    };

    const handleStopClick = () => {
        setIsPlaying(false);
        setSeconds(timerLimit);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Box sx={{ padding: 3, border: '2px solid black', borderRadius: 2, width: '80%', margin: 'auto', mt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isPlaying ? (
                        <>
                            <Avatar src={currentUser.avatarUrl} />
                            <Typography variant="h6" sx={{ ml: 2 }}>
                                {currentUserId} 님과 놀고있어요
                            </Typography>
                        </>
                    ) : (
                        isLoggedIn && (
                            <Button variant="contained" color="primary" onClick={handlePlayClick}>
                                놀아주기
                            </Button>
                        )
                    )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isPlaying && <Button variant="contained" color="secondary" sx={{ mr: 2 }} onClick={handleStopClick}>그만놀기</Button>}
                    <Typography variant="h6">
                        {formatTime(seconds)}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', border: '1px solid gray', height: 400 }}>
                <Typography variant="body1">
                    [Live Streaming 영상 출력 부분]
                </Typography>
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>저와 놀아주셔서 감사해요! 다음에 또 놀아주세요</DialogTitle>
            </Dialog>
        </Box>
    );
}

export default BroadCastingView;
