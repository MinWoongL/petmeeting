import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Card, CardContent, Typography, Box } from '@mui/material';
// import './BroadCastingMain.css'
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectCoverflow, Pagination, Navigation } from 'swiper';

function BroadCastingMain() {
  return (
    <Box className="container" sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom className="heading">
        Live Broadcast Previews
      </Typography>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={'auto'}
        coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
        }}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            clickable: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="swiper_container"
      >
        {[1, 2, 3].map((index) => (
          <SwiperSlide key={index}>
            <Card>
              <Box display="flex" alignItems="center">
                <Box 
                  flexGrow={1} 
                  display="flex" 
                  justifyContent="center" 
                  alignItems="center"
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    backgroundColor: '#f0f0f0' 
                  }}
                >
                  <Typography variant="subtitle1" color="textSecondary">
                    스트림 로딩중...
                  </Typography>
                </Box>
                <CardContent>
                  <Typography variant="h5">Live Preview {index}</Typography>
                </CardContent>
              </Box>
            </Card>
          </SwiperSlide>
        ))}
        <div className="slider-controler">
            <div className="swiper-button-prev slider-arrow">
                <ion-icon name="arrow-back-outline"></ion-icon>
            </div>
            <div className="swiper-button-next slider-arrow">
                <ion-icon name="arrow-forward-outline"></ion-icon>
            </div>
        </div>
        <div className="swiper-pagination"></div>
      </Swiper>
    </Box>
  );
}

export default BroadCastingMain;
