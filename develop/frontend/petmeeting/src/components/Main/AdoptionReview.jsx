import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom/dist";



function AdoptionReview() {
  const [expandedIds, setExpandedIds] = useState([]);
  const [likedReviews, setLikedReviews] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsToShow = 3;
  const [reviews, setReviews] = useState([]);
  const accessToken = JSON.parse(sessionStorage.getItem("token"))?.accessToken;
  
  const navigate = useNavigate(); // useNavigate 사용

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

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
  
  function unixTimestampToDateString(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  }
  
  function handleCardClick(boardNo) {
    navigate(`/board/adoption-review/${boardNo}`); // navigate 함수 사용
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    try {
      axios.get("https://i9a203.p.ssafy.io/backapi/api/v1/board?option=all")
      .then((response) => {
        setReviews(response.data);
      })
    } catch (error) {
      console.log(error);
    }
  }, [])

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
    const visibleReviews = [...reviews];
    const remainingSpace = itemsToShow - visibleReviews.length % itemsToShow;

    for (let i = 0; i < remainingSpace; i++) {
      visibleReviews.push(...reviews);
    }

    const startIndexInList = startIndex % reviews.length;
    return visibleReviews.slice(startIndexInList, startIndexInList + itemsToShow);
  };

  return (
    <Box sx={{ mt: 5, mb: 4 }}>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <img src={reviewIcon} alt="입양후기" style={{ maxHeight: '34px' }}/>
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
        {getVisibleReviews().map((review, index) => (
          <Card key={index} sx={{ width: 300, cursor: 'pointer', }}
          onClick={() => handleCardClick(review.boardNo)}
          >
            <CardHeader
              title={truncateText(review.title, 14)}
              subheader={unixTimestampToDateString(review.createdTime)}
              titleTypographyProps={{ style: { fontFamily: "Jua" } }}
              subheaderTypographyProps={{ style: { fontFamily: "Arial" } }}
            />
            <CardMedia
              component="img"
              height="160"
              image={`https://i9a203.p.ssafy.io/backapi/api/v1/image/${review.imagePath}?option=board`}
              alt={review.title}
            />
              <CardContent>
                <Typography paragraph>
                  {truncateText(review.content, 40)}
                </Typography>
              </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default AdoptionReview;
