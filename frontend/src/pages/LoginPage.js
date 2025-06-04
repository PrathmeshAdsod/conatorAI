import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ p: 6, borderRadius: 4, textAlign: 'center', background: '#fff', minWidth: 320 }}>
        <Typography variant="h4" sx={{ mb: 3, color: '#1976d2', fontWeight: 700 }}>
          Login to Continue
        </Typography>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          sx={{
            background: '#1976d2',
            color: '#fff',
            fontWeight: 600,
            px: 4,
            '&:hover': {
              background: '#1565c0'
            }
          }}
        >
          Login with Google
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;
