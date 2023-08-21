import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
  styled,
} from "@mui/material";
import {
  EmojiEventsRounded
} from "@mui/icons-material"; // Correct icon imports

const CustomLinearProgress = styled(({ value, ...props }) => (
  <Box {...props}>
    <Box
      sx={{
        width: "100%",
        borderRadius: 4,
        backgroundColor: "#e0e0e0",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: `${value}%`,
          height: 10,
          backgroundColor: "#b9a178",
        }}
      />
    </Box>
  </Box>
))({
  width: "100%",
  marginTop: 8,
});

const UserNameTypography = styled(Typography)({
  fontFamily: "Jua, sans-serif",
});

const MedalIcon = ({ rank }) => {
  let icon;
  switch (rank) {
    case 1:
      icon = <EmojiEventsRounded style={{ color: "gold", width: "50px", height: "auto" }} />;
      break;
    case 2:
      icon = <EmojiEventsRounded style={{ color: "silver", width: "50px", height: "auto"  }} />;
      break;
    case 3:
      icon = <EmojiEventsRounded style={{ color: "brown", width: "50px", height: "auto"  }} />;
      break;
    default:
      icon = <Avatar>{rank}</Avatar>;
  }
  return <ListItemAvatar>{icon}</ListItemAvatar>;
};

const DonationRanking = ({ shelterNo }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`https://i9a203.p.ssafy.io/backapi/api/v1/donation/${shelterNo}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the data:", error);
      });
  }, [shelterNo]);

  if (!data) return <div>Loading...</div>;

  const sortedData = [...data].sort(
    (a, b) => b.donateValue - a.donateValue
  );
  const maxDonation = sortedData[0].donateValue;

  return (
    <div>
      <List>
        {sortedData.map((donation, index) => (
          <ListItem key={donation.userId}>
            <MedalIcon rank={index + 1} />
            <ListItemText
              primary={
                <UserNameTypography variant="h5">
                  {donation.userId}
                </UserNameTypography>
              }
              secondary={
                <Box display="flex" flexDirection="column">
                  <Typography variant="h6">
                    {donation.donateValue.toLocaleString()} 원
                  </Typography>
                  <CustomLinearProgress
                    value={(donation.donateValue / maxDonation) * 100}
                  />
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
