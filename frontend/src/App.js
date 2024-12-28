import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import GoogleLoginButton from './components/GoogleLoginButton';
import Dashboard from './components/Dashboard';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, CssBaseline } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const { user, loading } = useContext(AuthContext);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Container>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            flexDirection="column"
          >
            <Typography variant="h3" gutterBottom>
              Speech Record
            </Typography>
            {!user ? (
              <GoogleLoginButton />
            ) : (
              <Button variant="contained" color="primary" component={Link} to="/dashboard">
                Go to Dashboard
              </Button>
            )}
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;


