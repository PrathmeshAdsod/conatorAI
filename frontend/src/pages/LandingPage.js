import React, { useState } from 'react';
import { Box, Button, Typography, Container, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBqmllKm-opSS8OnmdCKmO28mbH3bvtfGQ",
  authDomain: "conatorai.firebaseapp.com",
  projectId: "conatorai",
  storageBucket: "conatorai.firebasestorage.app",
  messagingSenderId: "631464321678",
  appId: "1:631464321678:web:1d6606e1fe55953a09dfdf",
  measurementId: "G-F81ESZ7XWG"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const gradientText = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/generate');
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1976d2 60%, #fff 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Container maxWidth="md">
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: 'transparent',
            background: 'linear-gradient(90deg, #fff, #90caf9, #1976d2, #fff)',
            backgroundSize: '200% 200%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: `${gradientText} 4s linear infinite alternate`,
            textShadow: '0 2px 8px #1976d2',
          }}
        >
          conatorAI
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, color: '#e3f2fd' }}>
          Multi-Agent Content Platform
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 6, color: '#e3f2fd' }}>
          AI-powered content & image generation with feedback loop
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mb: 6 }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: '#fff',
              color: '#1976d2',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(25, 118, 210, 0.2)',
              transition: 'all 0.3s',
              '&:hover': {
                background: '#1976d2',
                color: '#fff',
                transform: 'scale(1.05)',
                boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
              },
            }}
            onClick={() => setFeaturesOpen(true)}
          >
            Explore Features
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            sx={{
              color: '#fff',
              borderColor: '#fff',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 3,
              transition: 'all 0.3s',
              '&:hover': {
                background: '#fff',
                color: '#1976d2',
                borderColor: '#1976d2',
                transform: 'scale(1.05)',
              },
            }}
            onClick={() => setLoginOpen(true)}
          >
            Get Started
          </Button>
        </Box>
      </Container>
      
      {/* Features Dialog */}
      <Dialog 
        open={featuresOpen} 
        onClose={() => setFeaturesOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#1976d2', color: '#fff', textAlign: 'center' }}>
          conatorAI Features
        </DialogTitle>
        <DialogContent sx={{ py: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>Content Generation</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create stories, articles, poems and more with our advanced AI agents. Customize length, tone, and themes.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>Feedback Loop</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Refine your content with intelligent feedback and suggestions. Iterate until you're satisfied with the results.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>Image Generation</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bring your content to life with AI-generated images in various styles: realistic, cartoon, sketch, and watercolor.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>Analytics</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get insights into your content with analytics on word count, readability, sentiment, and more.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>Export Options</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Download your content in various formats for easy sharing and publishing.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            onClick={() => {
              setFeaturesOpen(false);
              setLoginOpen(true);
            }}
          >
            Get Started Now
          </Button>
          <Button onClick={() => setFeaturesOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Login Dialog */}
      <Dialog 
        open={loginOpen} 
        onClose={() => setLoginOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#1976d2', color: '#fff', textAlign: 'center' }}>
          Sign in to conatorAI
        </DialogTitle>
        <DialogContent sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
            Sign in with your Google account to start creating amazing content with conatorAI
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleGoogleLogin}
            sx={{ 
              py: 1.5, 
              px: 4, 
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            Sign in with Google
          </Button>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
          <Button onClick={() => setLoginOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '120px',
        background: 'linear-gradient(0deg, #fff 0%, transparent 100%)',
      }} />
    </Box>
  );
};

export default LandingPage;