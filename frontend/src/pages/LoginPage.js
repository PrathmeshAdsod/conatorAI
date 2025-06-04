import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Paper 
        elevation={12} 
        className="login-paper"
        sx={{ 
          p: 6, 
          borderRadius: 4, 
          textAlign: 'center', 
          background: '#fff',
          minWidth: 320,
          animation: 'fadeIn 0.5s ease-in-out'
        }}
      >
        <Typography 
          variant="h4" 
          className="login-title"
          sx={{ 
            mb: 4, 
            color: '#1976d2', 
            fontWeight: 700,
            fontSize: '1.8rem'
          }}
        >
          Welcome Back
        </Typography>
        
        <Box sx={{ mb: 3, opacity: 0.8 }}>
          <Typography variant="body1" sx={{ color: '#333', mb: 2 }}>
            Sign in to continue to your account
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          className="login-button"
          sx={{
            background: '#1976d2',
            color: '#fff',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)',
            '&:hover': {
              background: '#1565c0',
              boxShadow: '0 6px 16px rgba(25, 118, 210, 0.35)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Login with Google
        </Button>
        
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #eee' }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Box>
      </Paper>
      
      {/* Add animation keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
};

export default LoginPage;
