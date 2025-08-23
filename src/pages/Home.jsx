import React from 'react';
import Sidenav from '../Sidenav';
import Box from '@mui/material/Box';
import Navbar from "../Navbar/Navbar";
import DashboardList from '../Dashboard/DashboardList';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
//  Create a premium dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0C0C0C',
      paper: '#1A1A1A',
    },
    primary: {
      main: '#FF9800',
    },
    secondary: {
      main: '#FFFFFF',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FF9800',
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#FF9800',
    },
    h6: {
      color: '#FFFFFF',
    },
    body1: {
      color: '#DDD',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#0C0C0C',
          color: '#FFFFFF',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 26, 26, 0.9)',
          backdropFilter: 'blur(8px)',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontWeight: 500,
          textTransform: 'none',
          transition: 'all 0.3s ease-in-out',
        },
        contained: {
          backgroundColor: '#FF9800',
          color: '#000',
          '&:hover': {
            backgroundColor: '#ffa726',
            transform: 'scale(1.03)',
            boxShadow: '0 4px 12px rgba(255,152,0,0.4)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#1F1F1F',
          color: '#FF9800',
          fontWeight: 'bold',
        },
        body: {
          color: '#E0E0E0',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          marginBottom: '20px',
        },
      },
    },
  },
});

export default function Home() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top Spacing */}
        <Box height={40} />

        {/* Navbar */}
        <Navbar />

        {/* Layout Body */}
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          {/* Side Navigation */}
          <Sidenav />

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 3, md: 4 },
              backgroundColor: 'background.default',
              color: 'text.primary',
              minHeight: '100vh',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            {/* Welcome Heading */}
            <Typography variant="h1" component="h1">
              Welcome, Admin 
            </Typography>

            {/* Dashboard Table */}
            <DashboardList />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
