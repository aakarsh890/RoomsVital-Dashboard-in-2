// Login.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  Link as MuiLink,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../Logo/roomsvitalLogo.jpg";

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire({
        icon: "success",
        title: "Logged in!",
        text: "Welcome back.",
        timer: 1500,
        showConfirmButton: false,
      });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          px: 4,
          py: 5,
          width: "100%",
          maxWidth: 420,
          backgroundColor: "rgba(26, 26, 26, 0.9)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          textAlign: "center",
        }}
      >
        {/* Logo + Text */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 3,
          }}
        >
          <Avatar
            src={logo}
            alt="RoomsVital logo"
            sx={{
              width: 32,
              height: 32,
              bgcolor: "transparent",
              boxShadow: "none",
            }}
          />
          <Typography
            variant="h5"
            component="div"
            sx={{ color: "white", fontWeight: 600 }}
          >
            RoomsVital
          </Typography>
        </Box>

        {/* Form */}
        <form onSubmit={handleSignIn}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              input: { color: "#fff" },
              label: { color: "#aaa" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#FF9800" },
                "&.Mui-focused fieldset": { borderColor: "#FF9800" },
              },
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              input: { color: "#fff" },
              label: { color: "#aaa" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#FF9800" },
                "&.Mui-focused fieldset": { borderColor: "#FF9800" },
              },
            }}
          />

          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.3,
              fontWeight: "bold",
              fontSize: "1rem",
              backgroundColor: "#FF9800",
              color: "#000",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "#ffa726",
                transform: "scale(1.03)",
              },
            }}
          >
            Sign In
          </Button>

          <Typography variant="body2" mt={3} sx={{ color: "#ccc" }}>
            Don’t have an account?{" "}
            <MuiLink component={Link} to="/signup" underline="hover" sx={{ color: "#FF9800" }}>
              Sign up
            </MuiLink>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
