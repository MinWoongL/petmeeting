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
} from "@mui/material";
import { config } from "../static/config";

const DogDetailPage = () => {
  const { dogId } = useParams();
  const [dogDetails, setDogDetails] = useState(null);
  const [donationAmount, setDonationAmount] = useState(""); // State for donation amount input
  const [error, setError] = useState(""); // State for error messages

  const handleDonate = async () => {
    if (!donationAmount || isNaN(donationAmount)) {
      setError("Please enter a valid donation amount.");
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
    } catch (error) {
      if (error.response.status === 400) {
        setError("Insufficient points for donation.");
      } else if (error.response.status === 401) {
        setError("Login required for donation.");
      } else {
        setError("Failed to donate.");
      }

      console.error("Failed to donate:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = JSON.parse(sessionStorage.getItem("token"));

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
    <Container>
      <Card sx={{ maxWidth: "100%" }}>
        <CardMedia
          component="img"
          height="400"
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
            Reason for Abandonment: {dogDetails.reasonAbandonment}
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <input
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            placeholder="Enter donation amount"
            style={{ marginTop: "10px", marginRight: "10px" }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleDonate}
            style={{ marginTop: "15px" }}
          >
            Donate
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DogDetailPage;
