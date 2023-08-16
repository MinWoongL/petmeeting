import axios from "axios";
import React, { useState, useEffect } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography
} from "@mui/material";
import { Link } from "react-router-dom";

export default function UserAdoptionList() {
    const accessToken = JSON.parse(sessionStorage.getItem("token"))?.accessToken;
    const [adoptionList, setAdoptionList] = useState([]);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedAdoptionNo, setSelectedAdoptionNo] = useState(null);

    useEffect(() => {
        axios.get("https://i9a203.p.ssafy.io/backapi/api/v1/adoption", {
            headers: {
                "AccessToken": "Bearer " + accessToken
            }
        }).then((response) => {
            console.log(response.data)
            setAdoptionList(response.data);
        });
    }, []);

    const handleDeleteClick = (adoptionNo) => {
        setSelectedAdoptionNo(adoptionNo);
        setConfirmDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        axios
            .delete(`https://i9a203.p.ssafy.io/backapi/api/v1/adoption/${selectedAdoptionNo}`, {
                headers: {
                    "AccessToken": "Bearer " + accessToken
                }
            })
            .then(() => {
                setConfirmDialogOpen(false);
                axios.get("https://i9a203.p.ssafy.io/backapi/api/v1/adoption", {
                    headers: {
                        "AccessToken": "Bearer " + accessToken
                    }
                }).then((response) => {
                    alert("삭제가 완료되었습니다.");
                    setAdoptionList(response.data);
                });
            })
            .catch((error) => {
                console.error("Error deleting adoption:", error);
                setConfirmDialogOpen(false);
            });
    };

    const handleCloseConfirmDialog = () => {
        setConfirmDialogOpen(false);
        setSelectedAdoptionNo(null);
    };

    return (
        <Box>
            {adoptionList.length == 0 ? (
                <Typography
                    variant="h5"
                    align="center"
                    style={{
                        marginTop: '20px',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '0px solid #e0e0e0',
                        fontFamily: 'Jua'
                    }}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center">
                    아직 신청한 내역이 없습니다.
                    <Link
                        to="/adoption/form"
                        style={{
                            display: "block",
                            marginTop: "10px",
                            backgroundColor: "#948060",
                            color: "white",
                            padding: "10px 20px",
                            width: "90px",
                            fontSize: "18px",
                            borderRadius: "5px",
                            textDecoration: "none",
                            transition: "background-color 0.3s",
                            fontFamily: 'Jua',
                            textAlign: "center",
                            cursor: "pointer",
                        }}
                    >
                        입양하러가기
                    </Link>
                </Typography>
            ) : (
                // 입양신청목록
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>유기견이름</TableCell>
                                <TableCell>신청자</TableCell>
                                <TableCell>나이</TableCell>
                                <TableCell>성별</TableCell>
                                <TableCell>직업</TableCell>
                                <TableCell>반려동물 경험</TableCell>
                                <TableCell>지역</TableCell>
                                <TableCell>연락처</TableCell>
                                <TableCell>연락가능시간</TableCell>
                                <TableCell>입양신청상태</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {adoptionList.map((adoption) => (
                                <TableRow key={adoption.adoptionNo}>
                                    <TableCell>{adoption.dogName}</TableCell>
                                    <TableCell>{adoption.name}</TableCell>
                                    <TableCell>{adoption.age}</TableCell>
                                    <TableCell>{adoption.gender}</TableCell>
                                    <TableCell>{adoption.job}</TableCell>
                                    <TableCell>{adoption.petExperience ? <>있음</> : <>없음</>}</TableCell>
                                    <TableCell>{adoption.residence}</TableCell>
                                    <TableCell>{adoption.phoneNumber}</TableCell>
                                    <TableCell>{adoption.callTime}</TableCell>
                                    <TableCell>{adoption.adoptionStatus}</TableCell>
                                    <TableCell>
                                        {adoption.adoptionStatus !== "채택" && (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleDeleteClick(adoption.adoptionNo)}
                                            >
                                                삭제
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <Dialog
                open={confirmDialogOpen}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"삭제 확인"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        선택한 입양신청을 삭제하시겠습니까?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary">
                        취소
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                        삭제
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
