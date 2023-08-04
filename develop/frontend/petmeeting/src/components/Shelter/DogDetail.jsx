import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShareIcon from "@mui/icons-material/Share";
import { config } from "../../static/config";

const DogDetail = ({ shelterNo }) => {
  const [dogData, setDogData] = useState(null);

  useEffect(() => {
    console.log(shelterNo, "쉘터넘 엑시오스");
    axios
      .get(`${config.baseURL}/api/v1/dog?shelterNo=${shelterNo}`) // Replace 'API_URL' with your actual API URL
      .then((response) => {
        console.log(response.data);
        setDogData(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, [shelterNo]);

  return (
    <div>
      {dogData && (
        <Box display="flex" flexDirection="row" gap={2} flexWrap="wrap">
          {dogData.map((dog, index) => (
            <Card key={index} sx={{ width: 300 }}>
              <CardHeader
                title={dog.name}
                titleTypographyProps={{ style: { fontFamily: "Jua" } }}
              />
              <CardMedia
                component="img"
                height="160"
                image={`${config.baseURL}/api/v1/image/${dog.imagePath}?option=dog`}
                alt={dog.name}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {`Dog Size: ${dog.dogSize}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {`Gender: ${dog.gender}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {`Weight: ${dog.weight}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {`Age: ${dog.age}`}
                </Typography>
                {/* More fields can be added here */}
              </CardContent>
              {/* Additional content... */}
            </Card>
          ))}
        </Box>
      )}
    </div>
  );
};

export default DogDetail;
