import React from 'react'
import Sidenav from '../Sidenav'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Navbar from '../Navbar/Navbar';
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Logout() {

    const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut(auth);
        Swal.fire({
          icon: "success",
          title: "Logged out",
          text: "You have been successfully logged out.",
          timer: 2000,
          showConfirmButton: false,
        });
        setTimeout(() => navigate("/login"), 2000);
      } catch (error) {
        console.error("Logout error:", error);
        Swal.fire({
          icon: "error",
          title: "Logout failed",
          text: "An error occurred during logout.",
        });
      }
    };
    performLogout();
  }, [navigate]);

  
  return (
    <>
    <Navbar/>
      <Box sx={{ display: 'flex' }}>
        <Sidenav/>
        <h1>Logging you out...</h1>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

        </Box>
      </Box>
      
    </>
    
  )
}
