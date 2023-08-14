import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import ShareIcon from "@mui/icons-material/Share";
import { config } from "../../static/config";
import { Link } from "react-router-dom";
import LikeButton from "../Button/DogLikeButton";
import BookmarkButton from "../Button/DogBookmarkButton";
import DefaultDogImage from "../../assets/images/dog/DefaultDog.jpg";

export default function DogListItem({ dog, index }) {
  const imageSource = dog.imagePath
    ? `${config.baseURL}/api/v1/image/${dog.imagePath}?option=dog`
    : DefaultDogImage;

  return (
    <Link to={`/dog/${dog.dogNo}`} key={index} style={{ textDecoration: "none" }}>
      <Card key={index} sx={{ width: 300 }}>
        <CardHeader
          title={dog.name}
          titleTypographyProps={{ style: { fontFamily: "Jua" } }}
        />
        <CardMedia
          component="img"
          height="160"
          image={imageSource}
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
        <CardActions disableSpacing>
          <LikeButton dogNo={dog.dogNo} />{" "}
          {/* LikeButton 컴포넌트 사용 */}
          <BookmarkButton dogNo={dog.dogNo}>
            {" "}
            <ShareIcon />
          </BookmarkButton>
        </CardActions>
      </Card>
    </Link>
  );
}
