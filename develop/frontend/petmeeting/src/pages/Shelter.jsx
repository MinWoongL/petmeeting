import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ProfileCard from "../components/Shelter/ShelterList";
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useSortBy,
} from "react-table";
import { Link } from "react-router-dom";
import { Table, TableBody, TableContainer } from "@mui/material";

function DataTable() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    axios
      .get("https://i9a203.p.ssafy.io/backapi/api/v1/shelter?option=all")
      .then((res) => {
        setTableData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const data = useMemo(() => tableData, [tableData]);

  const columns = useMemo(
    () => [
      {
        Header: "보호소 이름",
        accessor: "name",
      },
      {
        Header: "주소",
        accessor: "address",
      },
      {
        Header: "전화번호",
        accessor: "phoneNumber",
      },
      {
        Header: "이메일",
        accessor: "email",
      },
      {
        Header: "웹사이트",
        accessor: "website",
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { getTableProps, page, prepareRow } = tableInstance;

  return (
    <TableContainer sx={{ boxShadow: "none" }}>
      <Table {...getTableProps()}>
        <TableBody>
          {page.map((row, i) => {
            prepareRow(row);

            return (
              <Link
                to={`/shelter/${row.original.shelterNo}`}
                style={{ textDecoration: "none" }}
                key={i}
              >
                <ProfileCard profile={row.original} />
              </Link>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
