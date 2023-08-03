import React, {useState, useEffect} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'
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
  const [videoDescriptions, setVideoDescriptions] = useState({})

  // 라이브 스트리밍 채널 ID
  const liveBroadcasts = [{id: "BZcu8MK_jfo"}, {id: "zwVAKBO8rJM"}, {id: "uqkhMBJ9yrs"}]

  useEffect(()=> {
    const API_KEY = "AIzaSyB1Wdv8X-6SZJFgtNRh-JD1VkeLjTNCFKc"

    const fetchVideoDetails = async() => {
      const cachedData = localStorage.getItem('videoDetails');
      if (cachedData) {
        const { titles, thumbnails, descriptions } = JSON.parse(cachedData);
        setvideoTitles(titles);
        setVideoThumbnails(thumbnails);
        setVideoDescriptions(descriptions);
        console.log('로컬스토리지에서 받아옴')
        // console.log('제목: ', titles);
        // console.log('썸네일: ', thumbnails);
        // console.log('영상정보: ', descriptions);
        return; // 캐시된 데이터가 있으면 API 호출을 스킵
      }

      try {
        const videoIds = liveBroadcasts.map(broadcast => broadcast.id).join(',');
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoIds}&key=${API_KEY}&part=snippet`);

        let fetchedTitles = {}
        let fetchedThumbnails = {}
        let fetchedDescriptions = {}

        response.data.items.forEach(item => {
          fetchedTitles[item.id] = item.snippet.title;
          fetchedThumbnails[item.id] = item.snippet.thumbnails.high.url;
          fetchedDescriptions[item.id] = item.snippet.description;
        });

        setvideoTitles(fetchedTitles)
        setVideoThumbnails(fetchedThumbnails);
        setVideoDescriptions(fetchedDescriptions);

        // API 호출 후 데이터를 localStorage에 저장
        localStorage.setItem('videoDetails', JSON.stringify({
            titles: fetchedTitles,
            thumbnails: fetchedThumbnails,
            descriptions: fetchedDescriptions
        }));

      } catch (e) {
        console.log('제목 가져오기 에러 : ', e)
      };
    }

    fetchVideoDetails();
  }, [])

  const handleCardClick = (broadcastId) => {
    navigate(`/broadcasting/${broadcastId}`,
     { state: {
      title: videoTitles[broadcastId],
      description: videoDescriptions[broadcastId],
      thumbnail: videoThumbnails[broadcastId]
    } });
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
                
                display="flex" 
                justifyContent="center" 
                alignItems="center"
                style={{ 
                  flexGrow: 5,
                  width: '100%', 
                  backgroundImage: `url(${videoThumbnails[broadcast.id]})`, // 배경 이미지로 썸네일 설정
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
              </Box>
              <CardContent style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="Jua">{videoTitles[broadcast.id] || "Loading..."}</Typography>
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
