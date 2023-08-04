import React, { useState } from "react";
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
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("이거 들어왔는데 404야?");
      const response = await axios.post(
        "https://i9a203.p.ssafy.io/backapi/api/v1/dogs",
        form
      );

      if (response.status === 200) {
        navigate(-1);
      }
    } catch (error) {
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Image Path"
            name="imagePath"
            value={form.imagePath}
            onChange={handleChange}
          />
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
          <Button type="submit" fullWidth variant="contained" color="primary">
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterDog;
