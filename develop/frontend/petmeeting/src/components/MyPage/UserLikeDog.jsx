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
import { Link } from "react-router-dom";
import LikeButton from "../Button/DogLikeButton";
import BookmarkButton from "../Button/DogBookmarkButton";

const UserLikeDog = ({ shelterNo }) => {
  const [dogData, setDogData] = useState([]);

  const handleLikeClick = (reviewId, event) => {
    event.stopPropagation(); // 이벤트 전파 중단
    // 좋아요 동작 처리
  };

  useEffect(() => {
    console.log(shelterNo, "쉘터넘 엑시오스");
    const token = sessionStorage.getItem("token");
    axios
      .get(`${config.baseURL}/api/v1/dog/likes`, {
        headers: {
          accessToken: `Bearer ${JSON.parse(token).accessToken}`,
        },
      }) // Replace 'API_URL' with your actual API URL
      .then((response) => {
        console.log(response.data);

        setDogData(response.data);
      })
      .catch((error) => {
        console.error("Like Dog error!", error);
      });
  }, [shelterNo]);

  return (
    <div>
      {dogData.length > 0 ? (
        <Box display="flex" flexDirection="row" gap={2} flexWrap="wrap">
          {dogData.map((dog, index) => (
            <Link
              to={`/dog/${dog.dogNo}`}
              key={index}
              style={{ textDecoration: "none" }}
            >
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
                </CardContent>
                <CardActions disableSpacing>
                  <LikeButton dogNo={dog.dogNo} />
                  <BookmarkButton dogNo={dog.dogNo}>
                    <ShareIcon />
                  </BookmarkButton>
                </CardActions>
              </Card>
            </Link>
          ))}
        </Box>
      ) : (
        <Typography 
          variant="h5" 
          align="center" 
          style={{ 
            marginTop: '20px',
            padding: '10px',
            borderRadius: '5px',
            border: '0px solid #e0e0e0',
            fontFamily: 'Jua'
          }}>
          관심가는 친구들을 등록해주세요!
        </Typography>
      )}
    </div>
  );  
};

export default UserLikeDog;
