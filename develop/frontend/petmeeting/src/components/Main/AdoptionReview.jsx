import React, { useState } from "react";
import { Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, Typography, IconButton, Box, Button } from "@mui/material";
import { useSelector } from "react-redux";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import heartOn from "../../assets/images/pet_heart_on.png";
import heartOff from "../../assets/images/pet_heart_off.png";
import axios from "axios";
import { BorderTop } from "@mui/icons-material";
import reviewIcon from "./ReviewIcon.png";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function AdoptionReview() {
  const [expandedIds, setExpandedIds] = useState([]);
  const [likedReviews, setLikedReviews] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsToShow = 3;
  const reviews = useSelector((state) => state.reviews.reviewData);

  const handleLikeClick = (id) => {
    if (likedReviews.includes(id)) {
      setLikedReviews((prev) => prev.filter((likeId) => likeId !== id));
    } else {
      setLikedReviews((prev) => [...prev, id]);
    }
  };

  const checkLikeAPI = async (reviewId, userId) => {
    try {
      const response = await axios.get(
        `http://api.example.com/check_like/${reviewId}/${userId}`
      );
      return response.data.isLiked; // API response의 isLiked 값을 반환한다고 가정
    } catch (error) {
      console.error(error);
    }
  };

  const requestLikeAPI = async (reviewId, userId) => {
    try {
      const response = await axios.post(
        `http://api.example.com/request_like/`,
        {
          reviewId,
          userId,
        }
      );
      return response.data.success; // API response의 success 값을 반환한다고 가정
    } catch (error) {
      console.error(error);
    }
  };

  const handleExpandClick = (id) => {
    const isExpanded = expandedIds.includes(id);
    if (isExpanded) {
      setExpandedIds((prev) => prev.filter((itemId) => itemId !== id));
    } else {
      setExpandedIds((prev) => [...prev, id]);
    }
  };

  const handlePrev = () => {
    if (startIndex === 0) {
      setStartIndex(reviews.length - 1);
    } else {
      setStartIndex(startIndex - 1);
    }
  };

  const handleNext = () => {
    if (startIndex === reviews.length - 1) {
      setStartIndex(0);
    } else {
      setStartIndex(startIndex + 1);
    }
  };

  const getVisibleReviews = () => {
    let visibleReviews = reviews.slice(startIndex, startIndex + itemsToShow);
    while (visibleReviews.length < itemsToShow) {
      visibleReviews = [
        ...visibleReviews,
        ...reviews.slice(0, itemsToShow - visibleReviews.length),
      ];
    }
    return visibleReviews;
  };

  return (
    <Box sx={{ mt: 5, mb: 4 }}>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <img src={reviewIcon} alt="입양후기" style={{ maxHeight: '35px' }}/>
        <IconButton
          variant="contained" 
          style={{
            backgroundColor: 'var(--yellow1)', 
            marginBottom: '10px',
            marginLeft: '63px'
          }} 
          onClick={handlePrev}>
            <ChevronLeftIcon />
        </IconButton>
        <IconButton
          variant="contained" 
          onClick={handleNext}
          style={{
            backgroundColor: 'var(--yellow1)',
            marginBottom: '10px',
            marginLeft: '10px'
          }}>
            <ChevronRightIcon />
        </IconButton>
      </span>
      <Box display="flex" flexDirection="row" gap={2} flexWrap="wrap">
        {getVisibleReviews().map((review) => (
          <Card key={review.id} sx={{ width: 300 }}>
            <CardHeader
              title={review.title}
              subheader={review.date}
              titleTypographyProps={{ style: { fontFamily: "Jua" } }}
              subheaderTypographyProps={{ style: { fontFamily: "Arial" } }}
            />
            <CardMedia
              component="img"
              height="160"
              image={review.image}
              alt={review.title}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {review.shortDescription}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton
                aria-label="add to favorites"
                onClick={() => handleLikeClick(review.id)}
              >
                <img
                  src={likedReviews.includes(review.id) ? heartOn : heartOff}
                  alt="like"
                  style={{ width: 24, height: 24 }}
                />
              </IconButton>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
              <ExpandMore
                expand={expandedIds.includes(review.id)}
                onClick={() => handleExpandClick(review.id)}
                aria-expanded={expandedIds.includes(review.id)}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse
              in={expandedIds.includes(review.id)}
              timeout="auto"
              unmountOnExit
            >
              <CardContent>
                <Typography paragraph>{review.fullDescription}</Typography>
              </CardContent>
            </Collapse>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default AdoptionReview;
