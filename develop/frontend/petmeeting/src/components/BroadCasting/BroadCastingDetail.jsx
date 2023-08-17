import { useState, useEffect } from 'react';
import { Avatar, Typography, Button, Box, Card, CardContent, CardMedia, Grid, Modal, TextField } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';  // 보호소 가기 아이콘
import PaymentIcon from '@mui/icons-material/Payment';  // 후원하기 아이콘
import { Snackbar } from '@mui/material';
import axios from 'axios';
import { config } from '../../static/config';
import { Link } from 'react-router-dom';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";


const buttonStyles = {
  marginBottom: '10px',
  borderRadius: '50px',
  boxShadow: '2px 2px 5px rgba(0,0,0,0.2)'
};

const modalStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function BroadCastingDetail() {
    const location = useLocation();
    const title = location.state?.title;
    const description = location.state?.description;
    const thumbnail = location.state?.thumbnail;
    const isLiveSession = location.state?.isLiveSession;

    const [shelterNo, setShelterNo] = useState(null);
    const [dogNo, setDogNo] = useState(null);
    const [dogData, setDogData] = useState(null);
    const [shelterData, setShelterData] = useState(null);
    const [donationAmount, setDonationAmount] = useState("");
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [donationSuccessMessage, setDonationSuccessMessage] = useState("");
    const [showSnackbar, setShowSnackbar] = useState(false);
    const { broadcastId } = useParams();

    const userType = JSON.parse(localStorage.getItem('user'))?.userType;

    useEffect(() => {
      axios.get("https://i9a203.p.ssafy.io/backapi/api/v1/broadcast/shelter")
        .then(response => {
          const matchedData = response.data.find(item => item.shelterNo.toString() === broadcastId);
    
          if (matchedData) {
            setShelterNo(matchedData.shelterNo);
            setDogNo(matchedData.dogNo);
          } else {
            console.error(`broadcastId(${broadcastId})와 일치하는 shelterNo를 찾을 수 없습니다.`);
          }
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

    const handleDonate = async () => {
      if (!donationAmount || isNaN(donationAmount)) {
        setError("Please enter a valid donation amount.");
        return;
      }
  
      if (parseInt(donationAmount) <= 0) {
        setError("0보다 큰 값을 입력해주세요");
        return;
      }
  
      const token = JSON.parse(sessionStorage.getItem("token"));
  
      const requestBody = {
        dogNo: dogNo,
        donationValue: parseInt(donationAmount),
      };
  
      try {
        const response = await axios.post(
          `${config.baseURL}/api/v1/donation`,
          requestBody,
          {
            headers: { AccessToken: `Bearer ${token.accessToken}` },
          }
        );
  
        console.log("Donation successful:", response.data);
        setDonationSuccessMessage(`'${donationAmount}' 원을 '${dogData?.name}' 에게 후원했어요`);
        setShowSnackbar(true);
        setError("");
        setModalOpen(false);
      } catch (error) {
        if (error.response.status === 403) {
          setError("후원 할 포인트가 충분하지 않습니다.");
        } else if (error.response.status === 401) {
          setError("후원 하기 위해서는 로그인 해야 합니다.");
        } else {
          setError("Failed to donate.");
        }
  
        console.error("Failed to donate:", error);
      }
    };

    if (!isLiveSession) {
      return (
          <Box sx={{ padding: 3, width: '80%', margin: 'auto', mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar src={thumbnail} sx={{ width: 65, height: 65, mr: 2 }} />
                  <Typography variant="h5">{title}</Typography>
              </Box>
              <Typography variant="body1" style={{ minHeight: '100px' }}>{description}</Typography>
          </Box>
      );
    }
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
          <Link to={`/shelter/${shelterNo}`} style={{ textDecoration: 'none' }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<HomeIcon />} 
              sx={{ ...buttonStyles, backgroundColor: 'var(--yellow7)', color: 'var(--yellow1)' }}
            >
              보호소 가기
            </Button>
          </Link>
          {userType !== "보호소" && (
            <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<PaymentIcon />} 
                onClick={() => setModalOpen(true)} 
                sx={{ ...buttonStyles, backgroundColor: 'var(--yellow8)', color: 'var(--yellow1)' }}
            >
                후원하기
            </Button>
          )}
          {/* <Button variant="outlined" startIcon={<FavoriteIcon />} sx={{ ...buttonStyles, backgroundColor: 'var(--yellow9)', color: 'var(--yellow1)' }}>좋아요</Button>
          <Button variant="outlined" startIcon={<BookmarkIcon />} sx={{ ...buttonStyles, backgroundColor: 'var(--yellow9)', color: 'var(--yellow1)' }}>찜하기</Button> */}
        </Box>

        <Snackbar
            open={showSnackbar}
            autoHideDuration={6000}
            onClose={() => setShowSnackbar(false)}
            message={donationSuccessMessage}
            action={
                <Button color="inherit" size="small" onClick={() => setShowSnackbar(false)}>
                    Close
                </Button>
            }
        />

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
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          style={modalStyle}
        >
          <Card sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              후원 금액 입력
            </Typography>
            <TextField
              type="number"
              label="후원 금액"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              fullWidth
              variant="outlined"
              error={!!error}
              helperText={error}
            />
            <Button 
              variant="contained"
              sx={{ ...buttonStyles, backgroundColor: '#948060', marginTop: 2 }}
              fullWidth
              onClick={handleDonate}
            >
              후원하기
            </Button>
          </Card>
        </Modal>
      </Box>
    );     
}

export default BroadCastingDetail;
