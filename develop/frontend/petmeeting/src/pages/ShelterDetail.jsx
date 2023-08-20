import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfileCard from "../components/Shelter/ShelterList";
import DogDetail from "../components/Shelter/DogDetail";
import DonationRanking from "../components/Shelter/DonationRanking";
import { Button, Container } from "@mui/material";
import { styled } from "@mui/system";

const StyledButtonContainer = styled(Container)`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const StyledButton = styled(Button)`
  background-color: #b9a178;
  color: white;
  &:hover {
    background-color: #6f6048;
  }
  margin-bottom: 10px;
`;

function ShelterDetailPage() {
  const { shelterNo } = useParams();
  const [shelterData, setShelterData] = useState(null);
  const [view, setView] = useState("dogs"); // The default view is 'dogs'

  useEffect(() => {
    window.scrollTo(0, 0);
    
    axios
      .get(`https://i9a203.p.ssafy.io/backapi/api/v1/shelter/${shelterNo}`)
      .then((res) => {
        setShelterData(res.data);
        console.log(res);
      })
      .catch((err) => {
        console.log("API get요청 제대로 못받아왔음");
        console.log(err);
      });
  }, [shelterNo]);

  if (!shelterData) return <div>Loading...</div>;

  return (
    <div>
      <ProfileCard profile={shelterData} />
      <StyledButtonContainer>
        <StyledButton onClick={() => setView("dogs")}>강아지 목록</StyledButton>
        <StyledButton onClick={() => setView("donations")}>후원 랭킹</StyledButton>
      </StyledButtonContainer>
      {view === "dogs" ? (
        <DogDetail shelterNo={shelterNo} />
      ) : (
        <DonationRanking shelterNo={shelterNo} />
      )}
    </div>
  );
}

export default ShelterDetailPage;
