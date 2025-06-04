import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const features = [
  {
    title: 'Text & Image Generation',
    desc: 'Generate creative stories, articles, poems, and images using AI.'
  },
  {
    title: 'Feedback Loop',
    desc: 'Iterate and refine your content until you are satisfied.'
  },
  {
    title: 'Google Gemini Powered',
    desc: 'All content and images are generated using Google Gemini API.'
  },
  {
    title: 'Easy Integration',
    desc: 'REST API backend ready for your React.js or any frontend.'
  }
];

const FeaturesPage = () => (
  <Box sx={{ minHeight: '100vh', background: '#e3f2fd', p: 4 }}>
    <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', color: '#1976d2', fontWeight: 700 }}>
      Why conatorAI?
    </Typography>
    <Grid container spacing={4}>
      {features.map((feature, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: 'center',
              background: '#fff',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)'
              }
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, color: '#1976d2', fontWeight: 700 }}>
              {feature.title}
            </Typography>
            <Typography variant="body1" sx={{ color: '#1976d2', fontWeight: 500 }}>
              {feature.desc}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default FeaturesPage;
