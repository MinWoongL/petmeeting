import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function UserDonationList({ userNo }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    try {
      axios
        .get(`https://i9a203.p.ssafy.io/backapi/api/v1/donation/${userNo}`)
        .then((response) => {
          setData(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatUnixTimeStamp = (unixTimeStamp) => {
    const date = new Date(unixTimeStamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const slicedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      {data.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>보호소 명</TableCell>
                <TableCell>강아지 이름</TableCell>
                <TableCell>후원 날짜</TableCell>
                <TableCell>후원 금액</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slicedData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.shelterName}</TableCell>
                  <TableCell>{row.dogName}</TableCell>
                  <TableCell>
                    {formatUnixTimeStamp(row.donationTime)}
                  </TableCell>
                  <TableCell>{row.donationValue} 원</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      ) : (
        <>
          <Typography variant="h5" align="center" style={{ marginTop: '20px', padding: '10px', borderRadius: '5px', border: '0px solid #e0e0e0', fontFamily: 'Jua' }}>
            후원한 내역이 없습니다. <br />
            <Link to="/adoption" style={{ fontSize: "17px", textDecoration: "none" }}>
              강아지 보러 가기
            </Link>
          </Typography>
        </>
      )}
    </>
  );
}
