import React, { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";

const genders = [
  { value: "MALE", label: "MALE :)" },
  { value: "FEMALE", label: "FEMALE :)" },
  { value: "LGBTQ", label: "LGBTQ :)" },
];

export default function AddDashboard({ onClose, onDone }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [roomNo, setRoomNo] = useState("");

  const createRoom = async () => {
    // Basic validation
    if (!name.trim() || !gender || !roomNo) {
      Swal.fire("Missing info", "Please fill all fields.", "warning");
      return;
    }
    const roomId = String(roomNo);

    try {
      // Prevent accidental overwrite if room already exists
      const ref = doc(db, "rooms", roomId);
      const existing = await getDoc(ref);
      if (existing.exists()) {
        const res = await Swal.fire({
          title: `Room ${roomId} exists`,
          text: "Do you want to overwrite the record?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Overwrite",
        });
        if (!res.isConfirmed) return;
      }

      await setDoc(ref, {
        name: name.trim(),
        gender,
        roomNo: Number(roomNo),
        date: new Date().toISOString(),
        isLocked: false,
      });

      Swal.fire("Submitted!", "Room has been saved.", "success");
      onDone?.();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not save the room.", "error");
    }
  };

  return (
    <>
      <Box sx={{ mb: 1 }} />
      <Typography variant="h6" align="center">
        Add Room
      </Typography>

      <IconButton
        sx={{ position: "absolute", top: 8, right: 8 }}
        onClick={onClose}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>

      <Box height={12} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Gender"
            select
            size="small"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            fullWidth
          >
            {genders.map((g) => (
              <MenuItem key={g.value} value={g.value}>
                {g.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Room No"
            size="small"
            type="number"
            value={roomNo}
            onChange={(e) => setRoomNo(e.target.value)}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" onClick={createRoom} fullWidth>
            Submit
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 1 }} />
    </>
  );
}
