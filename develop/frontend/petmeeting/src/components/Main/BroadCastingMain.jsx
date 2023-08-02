import React, {useState, useEffect} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'
// import './BroadCastingMain.css'
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectCoverflow, Pagination, Navigation } from 'swiper';
import axios from 'axios'

function BroadCastingMain() {
  const navigate = useNavigate()

  const [videoTitles, setvideoTitles] = useState({})
  const [videoThumbnails, setVideoThumbnails] = useState({})

  // 라이브 스트리밍 채널 ID
  const liveBroadcasts = [{id: "jfKfPfyJRdk"}, {id: "FJfwehhzIhw"}, {id: "36YnV9STBqc"}]

  useEffect(()=> {
    const API_KEY = "AIzaSyCQ8_N0tJG0HpTwE4AUys0Tjf-0HWhqPZY"
    const fetchVideoTitles = async() => {
      try {
        var fetchedTitles = {}
        var fetchedThumbnails = {}
        for (let broadcast of liveBroadcasts) {
          const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${broadcast.id}&key=${API_KEY}&part=snippet`);
          fetchedTitles[broadcast.id] = response.data.items[0].snippet.title;
          fetchedThumbnails[broadcast.id] = response.data.items[0].snippet.thumbnails.high.url; // high 해상도 썸네일 URL 가져오기

        }
        setvideoTitles(fetchedTitles)
        setVideoThumbnails(fetchedThumbnails);
      } catch (e) {
        console.log('제목 가져오기 에러 : ', e)
      };

    }
    fetchVideoTitles();
  }, [])

  const handleCardClick = (broadcastId) => {
    navigate(`/broadcasting/${broadcastId}`)
  }
  return (
    <Box className="container" sx={{ mt: 1 }} style={{ maxWidth: '932px' }}>
      <Typography variant="h6" gutterBottom className="heading">
        Live Broadcast Previews
      </Typography>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={false}
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
        {liveBroadcasts.map((broadcast) => (
          <SwiperSlide key={broadcast.id} style={{ width: '500px', height: '350px' }}>
            <Card onClick={() => handleCardClick(broadcast.id)} style={{ height: '100%' }}>
              <Box display="flex" flexDirection="column" height="100%">
              <Box 
                flexGrow={2} 
                display="flex" 
                justifyContent="center" 
                alignItems="center"
                style={{ 
                  width: '100%', 
                  backgroundImage: `url(${videoThumbnails[broadcast.id]})`, // 배경 이미지로 썸네일 설정
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
              </Box>
                <CardContent flexGrow={1}>
                  <Typography variant="h6">{videoTitles[broadcast.id] || "Loading..."}</Typography>
                </CardContent>
              </Box>
            </Card>
          </SwiperSlide>
        ))}
        <div className="slider-controler">
            <div className="swiper-button-prev slider-arrow" style={{ top: '50%', left: '10px' }}>
                <ion-icon name="arrow-back-outline"></ion-icon>
            </div>
            <div className="swiper-button-next slider-arrow" style={{ top: '50%', right: '10px' }}>
                <ion-icon name="arrow-forward-outline"></ion-icon>
            </div>
        </div>
        <div className="swiper-pagination"></div>
      </Swiper>
    </Box>
  );
}

export default BroadCastingMain;
