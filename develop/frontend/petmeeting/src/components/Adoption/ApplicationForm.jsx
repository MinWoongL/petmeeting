import React, { useState } from "react";

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    callTime: "",
    residence: "",
    job: "",
    petExperience: "",
    additional: "",
  });

  const [selectedShelter, setSelectedShelter] = useState("");
  const [selectedDog, setSelectedDog] = useState("");
  const [shelterList, setShelterList] = useState([]);

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
    height: "780px",
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

  const handleShelterChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedShelter(selectedValue);
    setSelectedDog(""); // 보호소 선택 변경 시 강아지 선택 초기화

    if (selectedValue === "") {
      setSelectedDog(""); // 보호소를 선택하지 않았을 때 강아지 선택 초기화
    }
  };

  const handleDogChange = (event) => {
    setSelectedDog(event.target.value);
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: 폼 데이터를 서버로 전송하는 로직을 추가하세요
    console.log("Form data submitted:", formData);
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
                <option key={shelter.id} value={shelter.id}>
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
              <option value="" disabled={!selectedShelter}>선택</option>
              {/* TODO: 선택한 보호소에 따라 강아지 리스트를 표시 */}
            </select>
          </label>
          <br />
          <label>
            이름:
            <input
              type="text"
              name="name"
              value={formData.name}
              style={inputStyle}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            성별:
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              style={inputStyle}
            >
              <option value="">선택</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </label>
          <br />
          <label>
            나이:
            <input
              type="number"
              name="age"
              value={formData.age}
              style={inputStyle}
              onChange={handleInputChange}
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
            />
          </label>
          <br />
          <label>
            반려동물 경험:
            <input
              type="text"
              name="petExperience"
              value={formData.petExperience}
              style={inputStyle}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            추가사항:
            <textarea
              name="additional"
              value={formData.additional}
              style={inputStyle}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button type="button" style={cancelButtonStyle} onClick={handleCancel}>
              취소
            </button>
            <button type="submit" style={buttonStyle}>
              신청 제출
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
