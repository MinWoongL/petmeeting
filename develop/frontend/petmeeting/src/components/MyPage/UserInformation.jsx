import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Avatar,
  Divider,
} from "@mui/material";
import axios from "axios";
import PaymentModal from "./PaymentModal";

const UserInformation = ({
  profile,
  isEditing,
  onChange,
  onUpdate,
  showEditButton = true,
}) => {
  const [editData, setEditData] = useState(profile);
  const [pgToken, setPgToken] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const token = JSON.parse(sessionStorage.getItem("token"));

  const handleEdit = () => {
    setEditData(profile);
    onChange(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://i9a203.p.ssafy.io/backapi/api/v1/user`,
        editData,
        { headers: { AccessToken: `Bearer ${token.accessToken}` } }
      );

      if (typeof onUpdate === "function") {
        onUpdate(response.data);
      }

      onChange(false);
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  };

  const handleChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  const handleCharge = () => {
    setPaymentModalOpen(true);
  };

  useEffect(() => {
    if (pgToken) {
      console.log(pgToken);
    }
  }, [pgToken]);

  return (
    <Box sx={{ padding: 2 }}>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ mr: 2 }} src={profile.avatar} />
              <Typography variant="h5">{profile.name}</Typography>
            </Box>
            {showEditButton && (
              <Button variant="outlined" color="primary" onClick={handleEdit}>
                Edit
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleCharge}
              style={{
                backgroundColor: "var(--yellow5)",
                color: "var(--dark)",
              }}
            >
              충전하기
            </Button>
          </Box>
          <Divider sx={{ my: 2 }} />
          {isEditing ? (
            <>
              <TextField
                fullWidth
                label="Name"
                value={editData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={editData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
              />

              <TextField
                fullWidth
                label="Email"
                value={editData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <TextField
                fullWidth
                type="password"
                label="Password"
                onChange={(e) => handleChange("password", e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            </>
          ) : (
            <>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                연락처: {profile.phoneNumber}
              </Typography>

              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                보유 포인트1: {profile.holdingPoint}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                보유 멍코인: {profile.holdingToken}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                입양여부: {profile.adopted ? "Y" : "N"}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
      />
    </Box>
  );
};

export default UserInformation;
