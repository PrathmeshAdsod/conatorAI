import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const NotFoundPage = () => (
  <Box
    sx={{
      minHeight: '100vh',
      background: '#e3f2fd',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      animation: `${fadeIn} 1s ease-in-out`
    }}
  >
    <Typography variant="h2" sx={{ color: '#1976d2', fontWeight: 700, mb: 2 }}>
      404 - conatorAI
    </Typography>
    <Typography variant="h5" sx={{ color: '#1976d2', mb: 3 }}>
      Page Not Found on conatorAI
    </Typography>
    <Button
      component={Link}
      to="/"
      variant="contained"
      sx={{
        background: '#1976d2',
        color: '#fff',
        fontWeight: 600,
        '&:hover': { background: '#1565c0' },
        animation: `${fadeIn} 1.5s ease-in-out`
      }}
    >
      Go Home
    </Button>
  </Box>
);

export default NotFoundPage;
