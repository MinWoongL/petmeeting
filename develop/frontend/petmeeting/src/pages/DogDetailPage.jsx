import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  Grid,
  Button,
  Modal,
  TextField
} from "@mui/material";
import { config } from "../static/config";
import { Snackbar, Alert } from "@mui/material";
import DogDonationImage from "../assets/images/dogmoney.png";
import { useDispatch } from "react-redux";
import { setPoint } from "../stores/Slices/pointSlice";
const modalStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const DogDetailPage = () => {
  const dispatch = useDispatch();
  const { dogId } = useParams();
  const [dogDetails, setDogDetails] = useState(null);
  const [donationAmount, setDonationAmount] = useState(""); // State for donation amount input
  const [error, setError] = useState(""); // State for error messages
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = JSON.parse(sessionStorage.getItem("token"));
      try {
        const response = await axios.get(
          `${config.baseURL}/api/v1/user`, // Replace with the correct endpoint to get the user data
          {
            headers: { AccessToken: `Bearer ${token.accessToken}` },
          }
        );

        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, []);

  const handleDonate = async () => {
    if (!donationAmount || isNaN(donationAmount)) {
      setError("Please enter a valid donation amount.");
      return;
    }

    if (parseInt(donationAmount) <= 0) {
      setError("0보다 큰 값을 입력해주세요");

      setTimeout(() => {
        setError("");
      }, 1000);
      return;
    }

    if (!window.confirm(`${dogDetails.name}에게 ${donationAmount} 포인트를 후원할까요?`)) {
      return;
    }

    const token = JSON.parse(sessionStorage.getItem("token"));

    const requestBody = {
      dogNo: dogDetails.dogNo,
      donationValue: parseInt(donationAmount), // You can adjust the donation value as needed
    };

    try {
      const response = await axios.post(
        `${config.baseURL}/api/v1/donation`,
        requestBody,
        {
          headers: { AccessToken: `Bearer ${token.accessToken}` },
        }
      );

      setDonationAmount(0);
      setError(""); // Clear any previous error messages
      setSnackbarMessage("후원에 성공했습니다!");
      setSnackbarOpen(true);
      dispatch(setPoint(response.data.holdingPoint));
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

  useEffect(() => {
    const fetchData = async () => {
      const token = JSON.parse(sessionStorage.getItem("token"));
      setIsLoggedIn(token !== null);
      try {
        const response = await axios.get(
          `${config.baseURL}/api/v1/dog/${dogId}`,
          {
            headers: { AccessToken: `Bearer ${token.accessToken}` },
          }
        );

        setDogDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch dog details:", error);
        alert("로그인이 필요한 페이지 입니다.");
        navigate("/login");
      }
    };

    fetchData();
  }, [dogId]);

  if (!dogDetails) return <div>Loading...</div>;

  return (
    <Container sx={{ display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: "70%", maxWidth: "100%" }}>
        <CardMedia
          component="img"
          height="500px"
          sx={{
            objectFit: "contain",
          }}
          image={
            config.baseURL +
            "/api/v1/image/" +
            dogDetails.imagePath +
            "?option=dog"
          }
          alt={dogDetails.name}
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {dogDetails.name}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                크기: {dogDetails.dogSize}
              </Typography>
              <Typography variant="subtitle1">
                성별: {dogDetails.gender}
              </Typography>
              <Typography variant="subtitle1">
                몸무게: {dogDetails.weight}kg
              </Typography>
              <Typography variant="subtitle1">
                나이: {dogDetails.age} years
              </Typography>
              <Typography variant="subtitle1">
                성향: {dogDetails.personality}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                종: {dogDetails.dogSpecies}
              </Typography>
              <Typography variant="subtitle1">
                입양가능여부: {dogDetails.adoptionAvailability}
              </Typography>
              <Typography variant="subtitle1">
                현재 상태: {dogDetails.currentStatus}
              </Typography>
              <Typography variant="subtitle1">
                접종여부: {dogDetails.isInoculated ? "Yes" : "No"}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body1" paragraph>
            버려진 이유: {dogDetails.reasonAbandonment}
          </Typography>
          {isLoggedIn && user && user.userGroup !== "보호소" ? (
            <div>
              <TextField
                type="number"
                value={donationAmount}
                onChange={(e) => {
                  e.target.value = e.target.value < 0 ? 0 : e.target.value;
                  setDonationAmount(e.target.value)
                }
                }
                label="후원 할 금액을 입력하세요"
                variant="outlined"
                size="small"
                sx={{
                  width: "200px",
                  margin: "15px 15px 0 0",
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--yellow8)",
                  },
                  "& .MuiInput-input[type='number']::-webkit-inner-spin-button, .MuiInput-input[type='number']::-webkit-outer-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                  "& .MuiInput-input[type='number']": {
                    "-moz-appearance": "textfield",
                  },
                  "& input[type='number']": {
                    color: "var(--yellow9)",
                  },
                }}
                InputLabelProps={{
                  style: { color: "var(--yellow9)" },
                }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleDonate}
                style={{ marginTop: "15px", backgroundColor: "#b9a178" }}
              >
                후원하기
              </Button>
              {error && <Typography color="error">{error}</Typography>}
            </div>
          ) : null}
        </CardContent>
      </Card>
      <Modal
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        style={modalStyle}
      >
        <div>
          <img
            src={DogDonationImage}
            alt="후원 완료"
            style={{ width: "300px", height: "auto" }}
          />
          <Typography
            variant="h4"
            component="div"
            style={{ marginTop: "10px", color: "white", textAlign: "center" }}
          >
            후원 감사합니다
          </Typography>
        </div>
      </Modal>
    </Container>
  );
};

export default DogDetailPage;
