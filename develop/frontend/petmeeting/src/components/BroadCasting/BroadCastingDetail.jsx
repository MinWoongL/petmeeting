import { useState, useEffect } from 'react';
import { Avatar, Typography, Button, Box, Card, CardContent, CardMedia, Grid } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';  // 보호소 가기 아이콘
import FavoriteIcon from '@mui/icons-material/Favorite';  // 좋아요 아이콘
import BookmarkIcon from '@mui/icons-material/Bookmark';  // 찜하기 아이콘
import PaymentIcon from '@mui/icons-material/Payment';  // 후원하기 아이콘
import axios from 'axios';
import { config } from '../../static/config';


function BroadCastingDetail() {

    const [shelterNo, setShelterNo] = useState(null);
    const [dogNo, setDogNo] = useState(null);
    const [dogData, setDogData] = useState(null);
    const [shelterData, setShelterData] = useState(null);


    useEffect(() => {
      axios.get("https://i9a203.p.ssafy.io/backapi/api/v1/broadcast/shelter")
        .then(response => {
          const fetchedShelterNo = response.data.shelterNo;
          const fetchedDogNo = response.data.dogNo;
          setShelterNo(fetchedShelterNo);
          setDogNo(fetchedDogNo);
        })
        .catch(error => {
          console.error("shelterNo를 가져오는 중 오류 발생:", error);
        });
    }, []);

    useEffect(() => {
      if (dogNo) {
          const token = JSON.parse(sessionStorage.getItem("token"));
          const accessToken = token.accessToken;

          axios.get(`https://i9a203.p.ssafy.io/backapi/api/v1/dog/${dogNo}`, {
              headers: {
                  AccessToken: `Bearer ${accessToken}`
              }
          })
          .then(response => {
              setDogData(response.data);
          })
          .catch(error => {
              console.error("강아지 데이터를 가져오는 중 오류 발생:", error);
          });
      }
    }, [dogNo])

    useEffect(() => {
      if (shelterNo) {
        axios.get(`https://i9a203.p.ssafy.io/backapi/api/v1/shelter/${shelterNo}`
        )
        .then(response => {
          setShelterData(response.data)
        })
        .catch(error => {
          console.error("쉘터 데이터 가져오기 실패", error);
        })
      }
    }, [shelterNo])

    return (
      <Box sx={{ padding: 3, width: '80%', margin: 'auto', mt: 1, fontFamily: 'Jua' }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar src={`${config.baseURL}/api/v1/image/${dogData?.imagePath}?option=dog`} sx={{ width: 65, height: 65 }} />
          </Grid>
          <Grid item>
            <Typography variant="h4">{shelterData?.name}</Typography>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          <Button variant="contained" color="primary" startIcon={<HomeIcon />} sx={{ borderRadius: '50px', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)' }}>보호소 가기</Button>
          <Button variant="contained" color="secondary" startIcon={<PaymentIcon />} sx={{ borderRadius: '50px', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)' }}>후원하기</Button>
          <Button variant="outlined" startIcon={<FavoriteIcon />} sx={{ borderColor: 'gray', boxShadow: '1px 1px 3px rgba(0,0,0,0.1)', borderRadius: '50px' }}>좋아요</Button>
          <Button variant="outlined" startIcon={<BookmarkIcon />} sx={{ borderColor: 'gray', boxShadow: '1px 1px 3px rgba(0,0,0,0.1)', borderRadius: '50px' }}>찜하기</Button>
        </Box>
        <Card sx={{ mb: 3, boxShadow: '0 4px 8px rgba(0,0,0,0.2)', border: '1px solid var(--yellow8)' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <CardMedia
                component="img"
                height="300"
                image={`${config.baseURL}/api/v1/image/${dogData?.imagePath}?option=dog`}
                alt={dogData?.name}
                sx={{ borderRadius: '4px' }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <CardContent>
                <Typography variant="h4" gutterBottom sx={{ border: '0px solid #ccc', padding: '0.5rem', borderRadius: '4px', fontFamily: 'Jua' }}>
                  {dogData?.name}
                </Typography>
                <Grid container spacing={2} sx={{ border: '1px solid #ccc', padding: '0.5rem', borderRadius: '4px' }}>
                  <Grid item xs={6} sx={{ border: '0px solid #ccc', padding: '0.5rem', borderRadius: '4px' }}>
                    <Box sx={{ border: '0px solid #ccc', padding: '0.5rem', borderRadius: '4px' }}>
                      <Typography sx={{ fontSize: '1.5rem', fontFamily: 'Poor Story' }}>종류: {dogData?.dogSpecies}</Typography>
                      <Typography sx={{ fontSize: '1.5rem', fontFamily: 'Poor Story' }}>성별: {dogData?.gender === 'M' ? '남자' : '여자'}</Typography>
                      <Typography sx={{ fontSize: '1.5rem', fontFamily: 'Poor Story' }}>나이: {dogData?.age}세</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ border: '0px solid #ccc', padding: '0.5rem', borderRadius: '4px' }}>
                      <Typography sx={{ fontSize: '1.5rem', fontFamily: 'Poor Story' }}>성격: {dogData?.personality}</Typography>
                      <Typography sx={{ fontSize: '1.5rem', fontFamily: 'Poor Story' }}>입양 가능 여부: {dogData?.adoptionAvailability}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Box>
    );     
}

export default BroadCastingDetail;
