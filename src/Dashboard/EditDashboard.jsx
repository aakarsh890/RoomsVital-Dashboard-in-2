import React, { useEffect, useState } from "react";
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
import { doc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";

const genders = [
  { value: "MALE", label: "MALE :)" },
  { value: "FEMALE", label: "FEMALE :)" },
  { value: "LGBTQ", label: "LGBTQ :)" },
];

export default function EditDashboard({ onClose, onDone, initial }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [roomNo, setRoomNo] = useState("");

  useEffect(() => {
    if (initial) {
      setName(initial.name ?? "");
      setGender(initial.gender ?? "");
      setRoomNo(initial.roomNo ?? initial.id ?? "");
    }
  }, [initial]);

  const updateRoom = async () => {
    if (!name.trim() || !gender || !roomNo) {
      Swal.fire("Missing info", "Please fill all fields.", "warning");
      return;
    }
    try {
      // We keep the document ID fixed (original room number).
      // If you want to allow changing the room number (doc id), you'd need a copy+delete flow.
      const ref = doc(db, "rooms", String(initial.id));
      await updateDoc(ref, {
        name: name.trim(),
        gender,
        roomNo: Number(roomNo),
        date: new Date().toISOString(),
      });
      Swal.fire("Updated!", "The record has been updated.", "success");
      onDone?.();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not update the room.", "error");
    }
  };

  return (
    <>
      <Box sx={{ mb: 1 }} />
      <Typography variant="h6" align="center">
        Edit Room
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
            helperText="Changing this only updates the field; the doc id remains the original room number."
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" onClick={updateRoom} fullWidth>
            Save
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 1 }} />
    </>
  );
}
