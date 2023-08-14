// components/shelter/shelterDetail 에서 수정버튼만 추가된상태.

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ProfileCard from "../../../components/Shelter/ShelterMypageProfile";
import DogDetail from "../../../components/Shelter/DogDetail"; // Replace with your actual component
import DonationRanking from "../../../components/Shelter/DonationRanking"; // Replace with your actual component
import ShelterAdoptionList from "../../../components/MyPage/ShelterAdoptionList";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

function ShelterMyPage() {
  const { shelterNo } = useParams();
  const [shelterData, setShelterData] = useState(null);
  const [view, setView] = useState("dogs"); // The default view is 'dogs'
  const [isEditing, setEditing] = useState(false); // New state to control the editing mode
  const [editData, setEditData] = useState({}); // To store data to be edited
  const [userNo, setUserNo] = useState(null);

  const handleProfileUpdate = (updatedProfile) => {
    setShelterData(updatedProfile);
  };

  const [newDog, setNewDog] = useState({});

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = JSON.parse(sessionStorage.getItem("token"));

      try {
        //  유저 토큰 던져서 유저 번호 받아오기
        const response = await axios.get(
          "https://i9a203.p.ssafy.io/backapi/api/v1/user",
          {
            headers: { AccessToken: `Bearer ${token.accessToken}` },
          }
        );
        const userNo = response.data.userNo;
        setUserNo(userNo);
        axios
          .get(`https://i9a203.p.ssafy.io/backapi/api/v1/shelter/${userNo}`) // using userNo instead of shelterNo
          .then((res) => {
            setShelterData(res.data);
            console.log(res.data, "쉘터 데이터임");
          })
          .catch((err) => {
            console.log("API get요청 제대로 못받아왔음");
            console.log(err);
          });
      } catch (error) {
        console.error("Failed to get user:", error);
      }
    };

    fetchData();
  }, [shelterNo]);

  if (!shelterData) return <div>Loading...</div>;

  const handleEdit = async () => {
    if (isEditing) {
      // Save the changes
      try {
        const token = JSON.parse(sessionStorage.getItem("token"));
        await axios.put(
          "https://i9a203.p.ssafy.io/backapi/api/v1/user",
          editData,
          { headers: { AccessToken: `Bearer ${token.accessToken}` } }
        );
        // Update the shelter data with the edited data
        setShelterData(editData);
      } catch (error) {
        console.error("Failed to update shelter data:", error);
      }
    } else {
      // Enter edit mode
      // Copy the current shelter data to the edit data
      setEditData(shelterData);
    }
    setEditing(!isEditing);
  };

  return (
    <div>
      <ProfileCard
        profile={shelterData}
        isEditing={isEditing}
        onChange={handleChange}
        onUpdate={handleProfileUpdate} // 새로운 prop을 추가합니다.
        showEditButton={true}
      />
      <div>
        <button onClick={() => setView("dogs")}>강아지 목록</button>
        <button onClick={() => setView("donations")}>후원 랭킹</button>
        <button onClick={() => setView("adoption")}>입양신청내역</button>
        <Button variant="outlined" onClick={handleEdit}>
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>
      {view === "dogs" ? (
        <div>
          <DogDetail shelterNo={userNo} />
          <Link to="/register-dog">
            <Button variant="contained" color="primary">
              유기견 등록하기
            </Button>
          </Link>
        </div>
      ) : (
        <></>
      )}
      {view === "donations" ? (
        <DonationRanking shelterNo={userNo} /> // Pass the shelterNo to the DonationRanking component
      ) : (
        <></>
      )}
      {view === "adoption" ? (
        <ShelterAdoptionList shelterNo={userNo}/>
      ) : (
        <></>
      )}

      {/* 유기견 등록용으로 사용할 버튼 */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpen}
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
      >
        <AddIcon />
      </Fab>
    </div>
  );
}
export { ShelterMyPage as ShelterDetail };
export default ShelterMyPage;
