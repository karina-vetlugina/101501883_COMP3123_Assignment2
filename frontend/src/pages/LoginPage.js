import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!identifier || !password) {
      setErrorMsg("Please fill in both fields.");
      return;
    }

    try {
      const response = await apiClient.post("/user/login", {
        identifier,
        password,
      });
      login(response.data.token, response.data.user);
      navigate("/employees", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setErrorMsg(msg);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%" }}>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Login
          </Typography>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email or Username"
              fullWidth
              margin="normal"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }} align="center">
            Don&apos;t have an account?{" "}
            <RouterLink to="/signup">Sign up</RouterLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}