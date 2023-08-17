import * as React from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Grid,
  Container,
  Modal,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useState } from 'react';
import image1 from '../../assets/images/payment/0.png';
import image2 from '../../assets/images/payment/1.png';
import image3 from '../../assets/images/payment/many.png';

const tiers = [
  { title: 'Token 2개', price: '5000', buttonText: '충전하기' },
  { title: 'Token 5개', price: '10000', buttonText: '충전하기' },
];

const customTier = {
  title: 'Token 10개',
  buttonText: '충전하기',
  minPrice: 50000,
};

const PaymentModal = ({ open, onClose }) => {
  const [selectPoint, setSelectPoint] = useState("");
  const [nextRedirectPcUrl, setNextRedirectPcUrl] = useState("");
  const [customPrice, setCustomPrice] = useState(customTier.minPrice);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const images = [image1, image2];
  const [showWarning, setShowWarning] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const baseUrl = window.location.origin;

  const handleCustomPlan = () => {
    const customNumber = Number(customPrice)
    if (customNumber < 50000) {
      setShowWarning(true);
    } else {
      handleSelectPlan(customNumber);
      setShowWarning(false);
    }
  };

  const handleSelectPlan = (price) => {
    setSelectPoint(price);
    setConfirmDialogOpen(true); // 중간 확인 단계를 열기
  };

  const handleCharge = () => {
    const requestBody = {
      selectPoint: selectPoint,
      approvalUrl: `${baseUrl}/payment/success`,
      cancelUrl: `${baseUrl}/mypage`,
      failUrl: `${baseUrl}/mypage`,
    };

    axios({
      method: "post",
      url: "https://i9a203.p.ssafy.io/backapi/api/v1/charge/ready",
      headers: {
        "Content-Type": "application/json",
        AccessToken: `Bearer ${token.accessToken}`,
      },
      data: JSON.stringify(requestBody),
    })
      .then((response) => {
        const url = response.data.nextRedirectPcUrl;
        setNextRedirectPcUrl(url);
        console.log(url)

        window.localStorage.setItem("tid", response.data.tid);
        window.location.href = url; // 해당 경로로 이동
      })
      .catch((error) => {
        console.error("Error occurred during charge initialization:", error);
      });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="payment-modal-title"
      aria-describedby="payment-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md" sx={{ backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4 }}>
        <Box sx={{ pt: 4, pb: 4 }}>
          <Typography component="h1" variant="h4" align="center" color="text.primary" fontFamily="Jua" gutterBottom>
            Petmeeting 충전페이지 입니다
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" fontFamily="Poor Story" component="p">
            원하는 충전금액을 선택해주세요
          </Typography>
        </Box>
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier, index) => (
            <Grid item key={tier.title} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 360 }}>
                <CardHeader title={tier.title} titleTypographyProps={{ align: 'center' }} />
                <CardMedia component="img" image={images[index]} alt={tier.title} height="140" />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2 }}>
                    <Typography component="h2" variant="h5" color="text.primary">
                      ₩{tier.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      원
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button fullWidth variant="outlined" color="primary" onClick={() => handleSelectPlan(tier.price)}>
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 360 }}>
              <CardHeader title={customTier.title} titleTypographyProps={{ align: 'center' }} />
              <CardMedia component="img" image={image3} alt={customTier.title} height="140" />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2 }}>
                    <TextField
                      type="number"
                      label="Enter Price"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(Number(e.target.value))}
                      InputProps={{
                        startAdornment: '₩',
                      }}
                      fullWidth
                    />
                    {showWarning && <Typography color="error">5만원 이상을 충전해주세요</Typography>} {/* 경고 메시지 */}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  disabled={customPrice < customTier.minPrice}
                  onClick={handleCustomPlan}
                >
                  {customTier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
        {/* Confirm Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle>{"선택하신 금액으로 충전하시겠어요?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              선택한 금액: ₩{selectPoint}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
              아니요
            </Button>
            <Button onClick={handleCharge} color="primary">
              예
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Modal>
  );
};

export default PaymentModal;
