// components/shelter/shelterDetail 에서 수정버튼만 추가된상태.

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ProfileCard from "../../../components/Shelter/ShelterList";
import DogDetail from "../../../components/Shelter/DogDetail"; // Replace with your actual component
import DonationRanking from "../../../components/Shelter/DonationRanking"; // Replace with your actual component
import Button from "@mui/material/Button";

function ShelterMyPage() {
  const { shelterNo } = useParams();
  const [shelterData, setShelterData] = useState(null);
  const [view, setView] = useState("dogs"); // The default view is 'dogs'
  const [isEditing, setEditing] = useState(false); // New state to control the editing mode

  useEffect(() => {
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

  const handleEdit = () => {
    // Handle editing logic here
    // This could involve making the fields editable and saving the changes when the 'Save' button is clicked
  };

  return (
    <div>
      <ProfileCard profile={shelterData} isEditing={isEditing} />
      <div>
        <button onClick={() => setView("dogs")}>강아지 목록</button>
        <button onClick={() => setView("donations")}>후원 랭킹</button>
        <Button variant="outlined" onClick={() => setEditing(!isEditing)}>
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>
      {view === "dogs" ? (
        <DogDetail shelterNo={shelterNo} /> // Pass the shelterNo to the DogList component
      ) : (
        <DonationRanking shelterNo={shelterNo} /> // Pass the shelterNo to the DonationRanking component
      )}
    </div>
  );
}
export { ShelterMyPage as ShelterDetail };
export default ShelterMyPage;
