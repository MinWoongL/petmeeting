import * as React from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Container,
  Modal,
  Box,
  TextField,
} from '@mui/material';
import { useState, useEffect } from 'react';

const tiers = [
  { title: 'Token 2개', price: '5000', buttonText: 'Choose Plan A' },
  { title: 'Token 5개', price: '10000', buttonText: 'Choose Plan B' },
  // Add more plans if needed
];

const customTier = {
  title: 'Token 10개',
  buttonText: 'Choose Custom Plan',
  minPrice: '100000', // Minimum price for custom plan
};

const PaymentModal = ({ open, onClose }) => {
  const [selectPoint, setSelectPoint] = useState("");
  const [nextRedirectPcUrl, setNextRedirectPcUrl] = useState("");
  const [customPrice, setCustomPrice] = useState(customTier.minPrice);
  const token = JSON.parse(sessionStorage.getItem("token"));

  const handleSelectPlan = (price) => {
    setSelectPoint(price);

    const requestBody = {
      selectPoint: price,
      approvalUrl: "https://localhost:5442/payment/success",
      cancelUrl: "https://localhost:5442/payment/cancel",
      failUrl: "https://localhost:5442/payment/fail",
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
        window.localStorage.setItem("tid", response.data.tid);
      })
      .catch((error) => {
        console.error("Error occurred during charge initialization:", error);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Container maxWidth="md">
        <Box sx={{ pt: 8, pb: 6 }}>
          <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
            Select a Plan
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" component="p">
            Choose the plan that suits your needs.
          </Typography>
        </Box>
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            <Grid item key={tier.title} xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  title={tier.title}
                  titleTypographyProps={{ align: 'center' }}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[700],
                  }}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2 }}>
                    <Typography component="h2" variant="h3" color="text.primary">
                      ${tier.price}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      /mo
                    </Typography>
                  </Box>
                  <ul>
                    {/* Add custom features related to the plan */}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleSelectPlan(tier.price)}
                  >
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {/* Custom Tier */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardHeader
                title={customTier.title}
                titleTypographyProps={{ align: 'center' }}
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[200]
                      : theme.palette.grey[700],
                }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2 }}>
                  <TextField
                    type="number"
                    label="Enter Price"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    InputProps={{
                      startAdornment: '$',
                    }}
                    fullWidth
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={customPrice < customTier.minPrice}
                  onClick={() => handleSelectPlan(customPrice)}
                >
                  {customTier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
        <a href={nextRedirectPcUrl}>{nextRedirectPcUrl}</a>
      </Container>
    </Modal>
  );
};

export default PaymentModal;
