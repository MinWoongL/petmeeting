// import * as React from "react";
// import AppBar from "@mui/material/AppBar";
// import Button from "@mui/material/Button";
// import CameraIcon from "@mui/icons-material/PhotoCamera";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import CssBaseline from "@mui/material/CssBaseline";
// import Grid from "@mui/material/Grid";
// import Stack from "@mui/material/Stack";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Container from "@mui/material/Container";
// import Link from "@mui/material/Link";
// import { createTheme, ThemeProvider } from "@mui/material/styles";

// function Copyright() {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center">
//       {"Copyright © "}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{" "}
//       {new Date().getFullYear()}
//       {"."}
//     </Typography>
//   );
// }

// const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// // TODO remove, this demo shouldn't need to reset the theme.
// const defaultTheme = createTheme();

// export default function Album() {
//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <CssBaseline />
//       <AppBar position="relative">
//         <Toolbar>
//           <CameraIcon sx={{ mr: 2 }} />
//           <Typography variant="h6" color="inherit" noWrap>
//             Album layout
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       <main>
//         {/* Hero unit */}
//         <Box
//           sx={{
//             bgcolor: "background.paper",
//             pt: 8,
//             pb: 6,
//           }}
//         >
//           <Container maxWidth="sm">
//             <Typography
//               component="h1"
//               variant="h2"
//               align="center"
//               color="text.primary"
//               gutterBottom
//             >
//               Album layout
//             </Typography>
//             <Typography
//               variant="h5"
//               align="center"
//               color="text.secondary"
//               paragraph
//             >
//               Something short and leading about the collection below—its
//               contents, the creator, etc. Make it short and sweet, but not too
//               short so folks don&apos;t simply skip over it entirely.
//             </Typography>
//             <Stack
//               sx={{ pt: 4 }}
//               direction="row"
//               spacing={2}
//               justifyContent="center"
//             >
//               <Button variant="contained">Main call to action</Button>
//               <Button variant="outlined">Secondary action</Button>
//             </Stack>
//           </Container>
//         </Box>
//         <Container sx={{ py: 8 }} maxWidth="md">
//           {/* End hero unit */}
//           <Grid container spacing={4}>
//             {cards.map((card) => (
//               <Grid item key={card} xs={12} sm={6} md={4}>
//                 <Card
//                   sx={{
//                     height: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <CardMedia
//                     component="div"
//                     sx={{
//                       // 16:9
//                       pt: "56.25%",
//                     }}
//                     image="https://source.unsplash.com/random?wallpapers"
//                   />
//                   <CardContent sx={{ flexGrow: 1 }}>
//                     <Typography gutterBottom variant="h5" component="h2">
//                       Heading
//                     </Typography>
//                     <Typography>
//                       This is a media card. You can use this section to describe
//                       the content.
//                     </Typography>
//                   </CardContent>
//                   <CardActions>
//                     <Button size="small">View</Button>
//                     <Button size="small">Edit</Button>
//                   </CardActions>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </main>
//       {/* Footer */}
//       <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
//         <Typography variant="h6" align="center" gutterBottom>
//           Footer
//         </Typography>
//         <Typography
//           variant="subtitle1"
//           align="center"
//           color="text.secondary"
//           component="p"
//         >
//           Something here to give the footer a purpose!
//         </Typography>
//         <Copyright />
//       </Box>
//       {/* End footer */}
//     </ThemeProvider>
//   );
// }

<div
  style={{
    width: 1512,
    height: 982,
    position: "relative",
    background: "white",
  }}
>
  <div
    style={{
      width: 930,
      height: 353,
      left: 541,
      top: 187,
      position: "absolute",
      background: "#D9D9D9",
    }}
  />
  <div
    style={{
      width: 1515,
      height: 61,
      left: -3,
      top: 0,
      position: "absolute",
      background: "#D9D9D9",
    }}
  />
  <div
    style={{
      width: 293,
      height: 54,
      left: 577.03,
      top: 6.86,
      position: "absolute",
      textAlign: "center",
      color: "black",
      fontSize: 40,
      fontFamily: "Inter",
      fontWeight: "400",
      wordWrap: "break-word",
    }}
  >
    헤더
  </div>
  <div
    style={{
      width: 496,
      height: 264,
      left: 899,
      top: 231,
      position: "absolute",
    }}
  >
    <span style="color: 'black', fontSize: 64, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word'">
      ㅇㅇㅇ님
      <br />
    </span>
    <span style="color: 'black', fontSize: 40, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word'">
      현재 포인트 10,000원
      <br />
      현재 멍코인 1개
      <br />
      연락처 : 000-1234-1234
      <br />
      입양여부
    </span>
  </div>
  <div
    style={{
      width: 308,
      height: 47,
      left: 1181,
      top: 140,
      position: "absolute",
      color: "black",
      fontSize: 36,
      fontFamily: "Inter",
      fontWeight: "400",
      wordWrap: "break-word",
    }}
  >
    함께한지 00일 째
  </div>
  <div
    style={{
      width: 308,
      height: 47,
      left: 577,
      top: 580,
      position: "absolute",
      color: "black",
      fontSize: 36,
      fontFamily: "Inter",
      fontWeight: "400",
      wordWrap: "break-word",
    }}
  >
    찜한 강아지
  </div>
  <div
    style={{
      width: 218,
      height: 218,
      left: 614,
      top: 254,
      position: "absolute",
      background:
        "linear-gradient(0deg, #A59F9F 0%, #A59F9F 100%), linear-gradient(0deg, #A59F9F 0%, #A59F9F 100%), linear-gradient(0deg, #A59F9F 0%, #A59F9F 100%)",
      borderRadius: 100,
    }}
  ></div>
  <div
    style={{
      width: 503,
      height: 891,
      left: -5,
      top: 95,
      position: "absolute",
      background: "#D9D9D9",
    }}
  />
  <div
    style={{
      width: 366,
      height: 64,
      left: 64,
      top: 436,
      position: "absolute",
      textAlign: "center",
      color: "black",
      fontSize: 48,
      fontFamily: "Inter",
      fontWeight: "400",
      wordWrap: "break-word",
    }}
  >
    이쪽은 메인과 동일
  </div>
  <div
    style={{
      width: 243,
      height: 64,
      left: 1219,
      top: 463,
      position: "absolute",
      background: "white",
      borderRadius: 20,
    }}
  />
  <div
    style={{
      width: 88,
      height: 58,
      left: 1307,
      top: 298,
      position: "absolute",
      background: "white",
      borderRadius: 20,
    }}
  />
  <div
    style={{
      width: 308,
      height: 47,
      left: 1241,
      top: 472,
      position: "absolute",
      color: "black",
      fontSize: 36,
      fontFamily: "Inter",
      fontWeight: "400",
      wordWrap: "break-word",
    }}
  >
    회원정보 수정
  </div>
  <div
    style={{
      width: 93,
      height: 39,
      left: 1304,
      top: 308,
      position: "absolute",
      textAlign: "center",
      color: "black",
      fontSize: 32,
      fontFamily: "Inter",
      fontWeight: "400",
      wordWrap: "break-word",
    }}
  >
    충전
  </div>
</div>;
