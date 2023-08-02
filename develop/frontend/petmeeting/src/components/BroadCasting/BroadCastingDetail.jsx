import React from 'react';
import { Avatar, Typography, Button, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';  // 보호소 가기 아이콘
import FavoriteIcon from '@mui/icons-material/Favorite';  // 좋아요 아이콘
import BookmarkIcon from '@mui/icons-material/Bookmark';  // 찜하기 아이콘
import PaymentIcon from '@mui/icons-material/Payment';  // 후원하기 아이콘
import { useLocation } from 'react-router-dom';

function BroadCastingDetail() {
    const location = useLocation();
    const title = location.state?.title;
    const description = location.state?.description;
    const thumbnail = location.state?.thumbnail;

    return (
        <Box sx={{ padding: 3, width: '80%', margin: 'auto', mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar src={thumbnail} sx={{ width: 65, height: 65, mr: 2 }} />
              <Typography variant="h5">{title}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1 }}>
              <Button variant="contained" color="primary" startIcon={<HomeIcon />} sx={{ borderRadius: '50px', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)' }}>보호소 가기</Button>
              <Button variant="contained" color="secondary" startIcon={<PaymentIcon />} sx={{ borderRadius: '50px', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)' }}>후원하기</Button>
              <Button variant="outlined" startIcon={<FavoriteIcon />} sx={{ borderColor: 'gray', boxShadow: '1px 1px 3px rgba(0,0,0,0.1)', borderRadius: '50px' }}>좋아요</Button>
              <Button variant="outlined" startIcon={<BookmarkIcon />} sx={{ borderColor: 'gray', boxShadow: '1px 1px 3px rgba(0,0,0,0.1)', borderRadius: '50px' }}>찜하기</Button>
            </Box>

            <Typography variant="body1" style={{ minHeight: '100px' }}>{description}</Typography>
        </Box>
    );
}

export default BroadCastingDetail;
