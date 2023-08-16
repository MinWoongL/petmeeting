import React from "react";
import { Button, Container, Typography, Alert } from "@mui/material";
import { Warning } from "@mui/icons-material";

export default function Page_404() {
  const goBack = () => {
    window.history.back();
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Alert
        severity="error"
        icon={<Warning fontSize="inherit" />}
        sx={{ marginBottom: 2 }}
      >
        페이지를 찾을 수 없습니다
      </Alert>
      <Button variant="text" color="error" onClick={goBack}>
        이전 페이지로 돌아가기
      </Button>
    </Container>
  );
}
