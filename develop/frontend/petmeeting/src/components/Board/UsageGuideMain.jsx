import React from "react";
import { Box, Typography, Grid, Table, TableBody, TableRow, TableCell, List, ListItem, ListItemText } from "@mui/material";
import PlayWithDog from "../../assets/images/play_with_dog.png";
import GiveMeMoney from "../../assets/images/give_me_money.png";

export default function UsageGuideMain() {
    return ( 
        <Box sx={{ mt: 4 }}>
            {/* 조작방법 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    유기견과 실시간 놀아주기
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                    <img src={PlayWithDog} alt="조작방법" style={{ width: '100%', height: 'auto' }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5">
                            조작방법
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemText primary="1. 실시간 라이브중인 방송을 선택합니다." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="2. 라이브 화면 우측 상단의 '놀아주기' 버튼을 클릭합니다." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="3. '놀아주기'를 선택하면 현재 놀아주고 있는 사용자의 아이디가 좌측 상단에 설정되며, 화면 하단 중앙부에 직/후진, 좌/우회전, 정지, 제자리 걸음 버튼으로 장난감 기기를 조작할 수 있습니다." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="4. 또한 '간식주기' 버튼을 사용하면 라이브중인 강아지에게 간식을 줄 수 있습니다." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="5. 놀아주기는 20초간 진행되며, 도중 중단을 원하실 경우 우측 상단의 '그만놀기'를 선택합니다." />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </Box>

            {/* 후원방법 */}
            <Box>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    유기견에게 후원하기
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                    <img src={GiveMeMoney} alt="후원방법" style={{ width: '100%', height: 'auto' }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5">
                            후원방법
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemText primary="1. 실시간 라이브중인 방송을 선택합니다." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="2. 라이브 화면 우측 하단의 '후원하기' 버튼을 클릭합니다." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="3. 실시간 라이브중인 강아지에게 후원을 할 수 있는 화면으로 이동합니다." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="4. 후원하기 폼 형식에 맞게 입력하여 후원합니다." />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}



