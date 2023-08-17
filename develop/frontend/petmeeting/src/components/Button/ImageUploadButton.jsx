import { useState } from "react";
import { Grid } from "@mui/material";


function ImageUploadButton({ option, setSelectedImage, imageUrl }) {
  const [previewUrl, setPreviewUrl] = useState();

  const getImageSource = (imageUrl) => {
    return `https://i9a203.p.ssafy.io/backapi/api/v1/image/${imageUrl}?option='${option}'`;
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setPreviewUrl(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <>
      {previewUrl ? (
        <Grid item xs={12} display="flex" justifyContent="center" marginTop="10px">
          <img src={previewUrl} alt="Preview" style={{ width: "200px" }} />
        </Grid>
      ) : (
        imageUrl && (
          <Grid item xs={12} display="flex" justifyContent="center" marginTop="10px">
            <img src={getImageSource(imageUrl)} alt="등록 이미지" style={{ width: "200px" }} />
          </Grid>
        )
      )}
      <div>
        <input type="file" onChange={handleImageChange} accept="image/*" />
      </div>
    </>
  );
}

export default ImageUploadButton;
