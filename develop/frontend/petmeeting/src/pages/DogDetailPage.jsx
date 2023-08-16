import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "@mui/material";
import { config } from "../static/config";
import { Snackbar, Alert } from "@mui/material";
import DogDonationImage from "../assets/images/dogmoney.png"

const modalStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};


const DogDetailPage = () => {
  const { dogId } = useParams();
  const [dogDetails, setDogDetails] = useState(null);
  const [donationAmount, setDonationAmount] = useState(""); // State for donation amount input
  const [error, setError] = useState(""); // State for error messages
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [user, setUser] = useState(null);

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

      // Handle success, show a message or perform any other action
      console.log("Donation successful:", response.data);
      setError(""); // Clear any previous error messages
      setSnackbarMessage("후원에 성공했습니다!");
      setSnackbarOpen(true);
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
      }
    };

    fetchData();
  }, [dogId]);

  if (!dogDetails) return <div>Loading...</div>;

  return (
    <Container sx={{display:"flex", justifyContent:"center"}}>
      <Card sx={{ width: "70%", maxWidth: "100%" }}>
        <CardMedia
          component="img"
          height= "500px"
          sx = {{
            objectFit: "contain"
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
          {isLoggedIn && user.userGroup !== "보호소" ? (
            <div>
              {error && <Typography color="error">{error}</Typography>}
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="후원 할 금액을 입력하세요"
                style={{ marginTop: "15px", marginRight: "10px", height: "25px", width:"200px" }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleDonate}
                style={{ marginTop: "15px", backgroundColor: "#b9a178"  }}
              >
                후원하기
              </Button>
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
            style={{ width: "100%", height: "auto" }}
          />
          <Typography variant="h4" component="div" style={{ marginTop: "10px" }}>
            후원 감사합니다
          </Typography>
        </div>
      </Modal>


      {/* <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Adjust the duration as needed
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        sx={{
          backgroundColor: "#efebe9", // Adjust the color code to your desired brownish color
          color: "white", // Text color
        }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          후원이 완료되었습니다!
        </Alert>
      </Snackbar> */}
    </Container>
  );
};

export default DogDetailPage;
