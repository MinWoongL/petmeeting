import React, { useState, useRef } from "react";
import axios from "axios";

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    phoneNumber: "",
    callTime: "",
    residence: "",
    job: "",
    petExperience: "",
    additional: "",
  });

  const accessToken = JSON.parse(sessionStorage.getItem("token"))?.accessToken;

  if (!accessToken) {
    alert("로그인이 필요합니다.");
    window.history.back();
  }

  const [selectedShelter, setSelectedShelter] = useState(0);
  const [selectedDog, setSelectedDog] = useState("");
  const [shelterList, setShelterList] = useState([]);
  const [dogList, setDogList] = useState([]);

  useState(() => {
    axios
      .get("https://i9a203.p.ssafy.io/backapi/api/v1/shelter?option=all")
      .then((response) => {
        setShelterList(response.data);
      });
  });

  const formContainerStyle = {
    display: "flex",
    justifyContent: "center",
    height: "100vh",
  };

  const formStyle = {
    backgroundColor: "#f4f4f4",
    border: "1px solid #ccc",
    padding: "20px",
    width: "400px",
    height: "840px",
    margin: "10px",
    borderRadius: "5px",
  };

  const inputStyle = {
    width: "380px",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "3px",
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "3px",
  };

  const cancelButtonStyle = {
    backgroundColor: "red", // 빨간색 배경색
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "3px",
    marginRight: "10px",
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleShelterChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedShelter(selectedValue);
    setSelectedDog("");

    if (selectedValue === "") {
      setDogList([]); // 강아지 목록 초기화
    } else {
      try {
        const response = await axios.get(
          `https://i9a203.p.ssafy.io/backapi/api/v1/dog?shelterNo=${selectedValue}`
        );

        setDogList(
          response.data.filter((dog) => dog.adoptionAvailability === "입양가능")
        );

        console.log(dogList);
      } catch (error) {
        console.error("강아지 목록을 가져오는 중 오류 발생:", error);
      }
    }
  };

  const handleDogChange = (event) => {
    setSelectedDog(event.target.value);
  };

  const handleCancel = () => {
    window.history.back();
  };

  const nameInputRef = useRef();
  const genderInputRef = useRef();
  const ageInputRef = useRef();
  const phoneNumberInputRef = useRef();
  const callTimeInputRef = useRef();
  const residenceInputRef = useRef();
  const jobInputRef = useRef();
  const petExperienceInputRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      dogNo: selectedDog,
      additional: event.target.additional.value,
      age: event.target.age.value,
      phoneNumber: event.target.phoneNumber.value,
      callTime: event.target.callTime.value,
      gender: event.target.gender.value,
      job: event.target.job.value,
      name: event.target.name.value,
      petExperience: event.target.petExperience.value,
      residence: event.target.residence.value,
    };

    for (const key in formData) {
      if (
        key !== "additional" &&
        (formData[key] === null || formData[key].trim() === "")
      ) {
        alert("모든 항목을 입력해주세요.");
        return;
      }
    }

    await axios
      .post("https://i9a203.p.ssafy.io/backapi/api/v1/adoption", formData, {
        headers: {
          AccessToken: "Bearer " + accessToken,
        },
      })
      .then(() => {
        window.history.back();
        alert("신청이 완료되었습니다.");
      });
  };

  const handleEmptyField = (ref) => {
    if (ref.current && !ref.current.value.trim()) {
      ref.current.focus();
      ref.current.scrollIntoView();
    }
  };

  return (
    <div style={formContainerStyle}>
      <div style={formStyle}>
        <h1>입양신청폼</h1>
        <form onSubmit={handleSubmit}>
          <label>
            보호소:
            <select
              name="shelter"
              value={selectedShelter}
              onChange={handleShelterChange}
              style={inputStyle}
            >
              <option value="">선택</option>
              {shelterList.map((shelter) => (
                <option key={shelter.shelterNo} value={shelter.shelterNo}>
                  {shelter.name}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            강아지:
            <select
              name="dog"
              value={selectedDog}
              onChange={handleDogChange}
              style={inputStyle}
              disabled={selectedShelter === ""}
            >
              {/* 강아지 목록 */}
              <option value="" disabled={!selectedShelter}>
                선택
              </option>
              {dogList.map((dog) => (
                <option key={dog.dogNo} value={dog.dogNo}>
                  {dog.name}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            신청자 이름:
            <input
              type="text"
              name="name"
              value={formData.name}
              style={inputStyle}
              onChange={handleInputChange}
              placeholder="ex) 홍길동"
              ref={nameInputRef}
              inputProps={{
                maxLength: 10,
              }}
            />
          </label>
          <br />
          <label>
            신청자 성별:
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              style={inputStyle}
              ref={genderInputRef}
            >
              <option value="">선택</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </label>
          <br />
          <label>
            신청자 나이:
            <input
              type="number"
              name="age"
              value={formData.age}
              style={inputStyle}
              onChange={handleInputChange}
              placeholder="ex) 28"
              ref={ageInputRef}
              min={0}
              max={100}
              step={1}
            />
          </label>
          <br />
          <label>
            연락처:
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              style={inputStyle}
              onChange={handleInputChange}
              placeholder="ex) 010-1234-5678"
              ref={phoneNumberInputRef}
              inputProps={{
                maxLength: 13,
              }}
            />
          </label>
          <br />
          <label>
            연락 가능시간:
            <input
              type="text"
              name="callTime"
              value={formData.callTime}
              style={inputStyle}
              onChange={handleInputChange}
              placeholder="ex) 오후 5시"
              ref={callTimeInputRef}
              inputProps={{
                maxLength: 20,
              }}
            />
          </label>
          <br />
          <label>
            소재지:
            <input
              type="text"
              name="residence"
              value={formData.residence}
              style={inputStyle}
              onChange={handleInputChange}
              placeholder="ex) 경기, 서울 등"
              ref={residenceInputRef}
              inputProps={{
                maxLength: 15,
              }}
            />
          </label>
          <br />
          <label>
            직업:
            <input
              type="text"
              name="job"
              value={formData.job}
              style={inputStyle}
              onChange={handleInputChange}
              placeholder="ex) 무직, 자영업 등"
              ref={jobInputRef}
              inputProps={{
                maxLength: 15,
              }}
            />
          </label>
          <br />
          <label>
            반려동물 경험:
            <select
              name="petExperience"
              value={formData.petExperience}
              onChange={handleInputChange}
              style={inputStyle}
              ref={petExperienceInputRef}
            >
              <option value="">선택</option>
              <option value="false">없음</option>
              <option value="true">있음</option>
            </select>
          </label>
          <br />
          <label>
            추가사항:
            <textarea
              name="additional"
              value={formData.additional}
              style={{
                ...inputStyle,
                resize: "none",
                width: "95%",
                height: "30px",
                overflowY: "auto",
              }}
              onChange={handleInputChange}
              placeholder="자유롭게 입력해주세요"
              
            />
          </label>
          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              type="button"
              style={cancelButtonStyle}
              onClick={handleCancel}
            >
              취소
            </button>
            <button
              type="submit"
              style={buttonStyle}
              onClick={() => {
                handleEmptyField(petExperienceInputRef);
                handleEmptyField(jobInputRef);
                handleEmptyField(residenceInputRef);
                handleEmptyField(callTimeInputRef);
                handleEmptyField(phoneNumberInputRef);
                handleEmptyField(ageInputRef);
                handleEmptyField(genderInputRef);
                handleEmptyField(nameInputRef);
              }}
            >
              신청서 제출
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
