import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography, LinearProgress, Box, styled } from "@mui/material";

const CustomLinearProgress = styled(LinearProgress)({
  backgroundColor: '#e0e0e0', // 배경색
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#b9a178', // 바 색상
  }
});

const UserNameTypography = styled(Typography)({
  fontFamily: 'Jua, sans-serif', // Jua 폰트 적용
});

const DonationRanking = ({ shelterNo }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`https://i9a203.p.ssafy.io/backapi/api/v1/donation/${shelterNo}`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("Error fetching the data:", error);
      });
  }, [shelterNo]);

  if (!data) return <div>Loading...</div>;

  const sortedData = [...data].sort((a, b) => b.donateValue - a.donateValue);
  const maxDonation = sortedData[0].donateValue;

  return (
    <div>
      <List>
        {sortedData.map((donation, index) => (
          <ListItem key={donation.userId}>
            <ListItemAvatar>
              <Avatar>{index + 1}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<UserNameTypography variant="h5">{donation.userId}</UserNameTypography>}
              secondary={
                <Box display="flex" flexDirection="column">
                  <Typography variant="h6">
                    {donation.donateValue.toLocaleString()} 원
                  </Typography>
                  <CustomLinearProgress variant="determinate" value={(donation.donateValue / maxDonation) * 100} />
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default DonationRanking;
