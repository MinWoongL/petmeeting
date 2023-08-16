import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Container,
  Box,
  Typography,
  MenuItem
} from "@mui/material";
import ImageUploadButton from "../components/Button/ImageUploadButton";
import { config } from "../static/config";
const RegisterDog = () => {
  const [form, setForm] = useState({
    name: "",
    dogSize: "",
    gender: "",
    weight: 0,
    age: 0,
    personality: "",
    protectionStartDate: "",
    currentStatus: "",
    dogSpecies: "",
    reasonAbandonment: "",
    isInoculated: null,
    imagePath: "",
  });
  const [imagePath, setImagePath] = useState("");
  const [ableToSelectDate, setAbleToSelectDate] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async () => {
    if (!selectedImage) {
      alert("강아지 사진을 선택해주세요");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(
        `${config.baseURL}/api/v1/image?option=dog`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setImagePath(response.data);
      setImageUrl(response.data);
      console.log(response.data)
      console.log(imageUrl, '이미지 유알엘임')
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

    
  
  


  useEffect(() => {
    setForm((prevForm) => ({ ...prevForm, imagePath }));
  }, [imagePath]);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const newImageUrl = await handleImageUpload();
    let submitForm = { ...form };
    if (submitForm.protectionStartDate) {
      submitForm.protectionStartDate = new Date(
        submitForm.protectionStartDate
      ).getTime();
    }
    

    const token = JSON.parse(sessionStorage.getItem("token"));
    // Create the header
    const config = {
      headers: { AccessToken: `Bearer ${token.accessToken}` },
    };
    try {
      console.log("레지스터도그 실행");
      console.log(submitForm);
      console.log(newImageUrl)
      let jjinForm = { ...submitForm };
      jjinForm.imagePath = `${newImageUrl}`;

      const response = await axios.post(
        "https://i9a203.p.ssafy.io/backapi/api/v1/dog",

        jjinForm,
        config
      );

      if (response.status === 201) {
        console.log("갈거지?");
        navigate(-1);
        console.log("성공했는데 네비게이트 안됨...?");
      }
    } catch (error) {
      console.log(error.data);
      console.error("Failed to register the dog:", error);
    }
  };

  const handleChange = (event) => {
    if(event.target.name === "protectionStartDate") {
      setAbleToSelectDate(true);
    }

    setForm({
      ...form,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, mb: 2 }}>
        <Typography component="h1" variant="h5">
          유기견 등록하기
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            select
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Dog Size"
            name="dogSize"
            value={form.dogSize}
            onChange={handleChange}
          >
            <MenuItem value="소형">소형견</MenuItem>
            <MenuItem value="중형">중형견</MenuItem>
            <MenuItem value="대형견">대형견</MenuItem>
          </TextField>
          <TextField
            select
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <MenuItem value="M">남</MenuItem>
            <MenuItem value="F">여</MenuItem>
          </TextField>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Weight"
            name="weight"
            type="number"
            value={form.weight}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Personality"
            name="personality"
            value={form.personality}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Protection Start Date"
            name="protectionStartDate"
            type="date"
            value={form.protectionStartDate}
            onChange={handleChange}
            InputProps={{
              inputProps: {
                max: form.protectionEndDate,
              },
            }}
          />
          <TextField
            select
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="isInoculated"
            name="isInoculated"
            value={form.isInoculated}
            onChange={handleChange}
          >
            <MenuItem value="true">접종완료</MenuItem>
            <MenuItem value="false">미접종</MenuItem>
          </TextField>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Current Status"
            name="currentStatus"
            value={form.currentStatus}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Dog Species"
            name="dogSpecies"
            value={form.dogSpecies}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Reason for Abandonment"
            name="reasonAbandonment"
            value={form.reasonAbandonment}
            onChange={handleChange}
          />
          
          <ImageUploadButton
        setSelectedImage={setSelectedImage}
        imageUrl={imageUrl}
        option="dog"
      />
      <Button type="submit" fullWidth variant="contained" color="primary">
        등록하기
      </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterDog;
