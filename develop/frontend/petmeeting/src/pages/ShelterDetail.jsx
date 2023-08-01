import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ProfileCard from "../components/Shelter/ShelterList";
import DogDetail from "../components/Shelter/DogDetail"; // Replace with your actual component
import DonationRanking from "../components/Shelter/DonationRanking"; // Replace with your actual component

function ShelterDetailPage() {
  const { shelterNo } = useParams();
  const [shelterData, setShelterData] = useState(null);
  const [view, setView] = useState("dogs"); // The default view is 'dogs'

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

  return (
    <div>
      <ProfileCard profile={shelterData} />
      <div>
        <button onClick={() => setView("dogs")}>강아지 목록</button>
        <button onClick={() => setView("donations")}>후원 랭킹</button>
      </div>
      {view === "dogs" ? (
        <DogDetail shelterNo={shelterNo} /> // Pass the shelterNo to the DogList component
      ) : (
        <DonationRanking shelterNo={shelterNo} /> // Pass the shelterNo to the DonationRanking component
      )}
    </div>
  );
}

export default ShelterDetailPage;
