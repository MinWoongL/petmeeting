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
} from "@mui/material";
import ImageUploadButton from "../components/Button/ImageUploadButton";

const RegisterDog = () => {
  const [form, setForm] = useState({
    name: "",
    dogSize: "",
    gender: "",
    weight: 0,
    age: 0,
    personality: "",
    protectionStartDate: "",
    protectionEndDate: "",
    adoptionAvailability: "",
    currentStatus: "",
    dogSpecies: "",
    reasonAbandonment: "",
    isInoculated: false,
    imagePath: "",
  });
  const [imagePath, setImagePath] = useState("");
  useEffect(() => {
    setForm((prevForm) => ({ ...prevForm, imagePath }));
  }, [imagePath]);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    let submitForm = { ...form };
    if (submitForm.protectionStartDate) {
      submitForm.protectionStartDate = new Date(
        submitForm.protectionStartDate
      ).getTime();
    }
    if (submitForm.protectionEndDate) {
      submitForm.protectionEndDate = new Date(
        submitForm.protectionEndDate
      ).getTime();
    }

    const token = JSON.parse(sessionStorage.getItem("token"));
    // Create the header
    const config = {
      headers: { AccessToken: `Bearer ${token.accessToken}` },
    };
    try {
      console.log("레지스터도그 실행");
      let jjinForm = { ...submitForm };
      jjinForm.imagePath = `${form.imagePath}`;
      console.log(form.imagePath, "이건 이미지패스");
      console.log(jjinForm, "이건 찐폼");
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
          Register Dog
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
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Dog Size"
            name="dogSize"
            value={form.dogSize}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
          />
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
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Protection End Date"
            name="protectionEndDate"
            type="date"
            value={form.protectionEndDate}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Adoption Availability"
            name="adoptionAvailability"
            value={form.adoptionAvailability}
            onChange={handleChange}
          />
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
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              Image Path: {form.imagePath}
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                name="isInoculated"
                checked={form.isInoculated}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Is Inoculated"
          />
          <ImageUploadButton option="dog" setImagePath={setImagePath} />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterDog;
