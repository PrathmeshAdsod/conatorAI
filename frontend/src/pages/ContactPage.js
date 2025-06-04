import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

const ContactPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ p: 6, borderRadius: 4, textAlign: 'center', background: '#fff', minWidth: 320 }}>
        <Typography variant="h4" sx={{ mb: 2, color: '#1976d2', fontWeight: 700 }}>
          Contact conatorAI Team
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 500 }}>
          If you have any queries, suggestions, or need support, feel free to reach out!
        </Typography>
        <form style={{ textAlign: 'left', width: '100%' }}>
          <label>
            Feedback:
            <textarea name="feedback" style={{ width: '100%', height: '100px', marginTop: '10px' }} />
          </label>
          <br />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Submit Feedback</Button>
        </form>
        <Typography variant="body1" sx={{ mt: 2, color: '#1976d2', fontWeight: 600, fontSize: 18 }}>
          Email: <a href="mailto:adsodprathmesh@gmail.com" style={{ color: '#1976d2', textDecoration: 'underline' }}>adsodprathmesh@gmail.com</a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default ContactPage;
