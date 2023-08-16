import React, { useState } from "react";
import axios from "axios";
import { Grid } from "@mui/material";
import { config } from "../../static/config";

function ImageUploadButton({ option, setImagePath }) {
  const [selectedImage, setSelectedImage] = useState();
  const [uploadStatus, setUploadStatus] = useState("");
  const [imageUrl, setimageUrl] = useState("");

  function getImageSource(imageUrl) {
    return `https://i9a203.p.ssafy.io/backapi/api/v1/image/${imageUrl}?option='${option}'`;
  }

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("강아지 사진을 선택해주세요");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      setUploadStatus("Uploading...");
      console.log("이미지 업로드 시작");
      const response = await axios.post(
        `${config.baseURL}/api/v1/image?option=dog`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("이미지 업로드 성공?", response);
      setImagePath(response.data);
      setimageUrl(response.data);

      setUploadStatus("Upload successful!");
    } catch (err) {
      console.error(err);
      setUploadStatus("Upload failed!");
    }
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  return (
    <>
      {imageUrl ? (
        <Grid item xs={12} display="flex" justifyContent="center" marginTop="10px">
          <img src={getImageSource(imageUrl)} alt="등록 이미지" style={{
          width: "200px"
        }}/>
        </Grid>
      ) : (
        <></>
      )}
      <div>
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <button onClick={(e) => handleImageUpload(e)}>이미지 업로드</button>
        <p>{uploadStatus}</p>
      </div>
    </>
  );
}

export default ImageUploadButton;
