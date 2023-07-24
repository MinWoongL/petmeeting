// src/components/Home.js
import React, { useState } from 'react';
import { Typography, Box, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setMessage } from '../stores/Slices/MessageSlice';

function Home() {
  const message = useSelector(state => state.message.text)

  const dispatch = useDispatch()

  const [inputValue, setInputValue] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(setMessage(inputValue))
  }

  const handleChange = (event) => {
    setInputValue(event.target.value)
  }

  return (
    <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5">
        Home
      </Typography>
      <Box component="div" noValidate sx={{ mt: 1 }}>
        <Typography component="p">
          { message }
        </Typography> 
      </Box>
      <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Update Message"
            value={inputValue}
            onChange={handleChange}
          />
          <button type="submit">Update</button>
        </form>
    </Box>
  );
}

export default Home;
