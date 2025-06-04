import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Paper, TextField, CircularProgress, Fade, Chip, FormControlLabel, Checkbox, MenuItem, Select, InputLabel, FormControl, Divider, Alert, Grid, Card, CardContent, CardMedia, IconButton, Tabs, Tab, Stepper, Step, StepLabel
} from '@mui/material';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useNavigate } from 'react-router-dom';

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

const typeOptions = [
  'story', 'novel', 'fantasy', 'article', 'poem', 'hybrid'
];
const lengthOptions = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Big', value: 'big' }
];
const toneOptions = [
  'serious', 'funny', 'dramatic', 'inspirational', 'mysterious'
];
const styleOptions = [
  'realistic', 'cartoon', 'sketch', 'watercolor'
];

// Dummy data for development
const dummyContent = `Once upon a time in a land of adventure, a brave hero set out to find dragons. The journey was filled with mystery and excitement. The mountains loomed large on the horizon, their peaks shrouded in mist and legend. 

Our hero, armed with nothing but courage and a small dagger, ventured forth into the unknown. The villagers had warned of the dangers, but the call of adventure was too strong to resist.

As night fell, the first signs of dragons appeared - scorched earth and massive footprints that told of creatures of immense power. The hero made camp, knowing that tomorrow would bring challenges unlike any faced before.`;

const dummyRefined = `Once upon a time in a land of adventure, a brave hero named Elian set out to find the legendary fire dragons of the Mistpeak Mountains. The journey was filled with mystery and excitement, as ancient scrolls had foretold of both danger and treasure.

The mountains loomed large on the horizon, their jagged peaks shrouded in magical mist and legend. Locals spoke of dragons with scales that shimmered like rubies and eyes that burned with the wisdom of centuries.

Our hero, armed with nothing but unwavering courage and an enchanted dagger passed down through generations, ventured forth into the unknown wilderness. The village elders had warned of the mortal dangers, but the call of adventure and the promise of becoming a legend was too strong for Elian to resist.

As night fell on the first day of the journey, the undeniable signs of dragons appeared - scorched earth that still smoldered with heat, massive three-toed footprints that filled with water, and the distinct smell of sulfur that hung heavy in the air. These were creatures of immense power and ancient magic.

Elian made camp beneath a rocky overhang, carefully building a small fire that wouldn't attract unwanted attention. Tomorrow would bring challenges unlike any faced before, but also the possibility of becoming the first dragon-friend in five centuries.`;

const dummyImages = [
  { url: 'https://placehold.co/600x400?text=Dragon+Mountain+Scene', style: 'realistic' },
  { url: 'https://placehold.co/600x400?text=Hero+Adventure', style: 'cartoon' }
];

const feedbackSuggestions = [
  "Make it longer",
  "Add more detail",
  "Change the tone",
  "Add more characters",
  "Make it more dramatic",
  "Simplify the language"
];

const GenerateContentPage = () => {
  const navigate = useNavigate();
  
  // User authentication state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Agent 1: Query Handler
  const [query, setQuery] = useState('');
  const [generateImages, setGenerateImages] = useState(false);
  const [type, setType] = useState('story');
  const [length, setLength] = useState('medium');
  const [themes, setThemes] = useState('adventure');
  const [tone, setTone] = useState('serious');
  const [customElements, setCustomElements] = useState('include dragons');
  const [imageStyle, setImageStyle] = useState('realistic');
  const [inputError, setInputError] = useState('');

  // Agent 2: Content Generator
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [images, setImages] = useState([]);

  // Agent 3: Feedback Collector
  const [feedback, setFeedback] = useState('');
  const [feedbackOptions, setFeedbackOptions] = useState(feedbackSuggestions);
  const [sectionComment, setSectionComment] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState([]);

  // Agent 4: Content Refiner
  const [refinedResponse, setRefinedResponse] = useState('');
  const [changelog, setChangelog] = useState([]);
  const [iteration, setIteration] = useState(0);
  const [status, setStatus] = useState('idle');
  const [activeTab, setActiveTab] = useState(0);

  // Agent 6: Output Formatter
  const [analytics, setAnalytics] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  // Check authentication status on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName,
          photo: currentUser.photoURL
        });
      } else {
        // Redirect to landing page if not logged in
        navigate('/');
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  // Validate and simulate content generation
  const handleGenerate = (e) => {
    e.preventDefault();
    setInputError('');
    if (!query.trim()) {
      setInputError('Query cannot be empty.');
      return;
    }
    setIsGenerating(true);
    setStatus('Generating content...');
    
    // Move to content generation step
    setActiveStep(1);
    
    setTimeout(() => {
      setAiResponse(dummyContent);
      setImages(generateImages ? dummyImages : []);
      setStatus('Content generated.');
      setIsGenerating(false);
      setAnalytics({ 
        wordCount: 124, 
        readability: 'Easy', 
        sentiment: 'Adventurous',
        characters: 3,
        paragraphs: 4,
        readingTime: '1 min'
      });
      
      // Move to feedback step
      setActiveStep(2);
    }, 1500);
  };

  // Handle feedback selection
  const handleFeedbackSelect = (option) => {
    if (selectedFeedback.includes(option)) {
      setSelectedFeedback(selectedFeedback.filter(item => item !== option));
    } else {
      setSelectedFeedback([...selectedFeedback, option]);
    }
  };

  // Simulate feedback and refinement
  const handleRefine = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setStatus('Refining content...');
    
    const combinedFeedback = [
      ...selectedFeedback,
      feedback ? feedback : null
    ].filter(Boolean).join(', ');
    
    setTimeout(() => {
      setRefinedResponse(dummyRefined);
      setChangelog([...changelog, `Refinement #${iteration + 1}: ${combinedFeedback || 'General improvements'}`]);
      setIteration(iteration + 1);
      setStatus('Content refined.');
      setIsGenerating(false);
      setActiveTab(1);
      
      // Update analytics for refined content
      setAnalytics({ 
        wordCount: 248, 
        readability: 'Medium', 
        sentiment: 'Adventurous',
        characters: 5,
        paragraphs: 5,
        readingTime: '2 min'
      });
      
      // Move to final step
      setActiveStep(3);
    }, 1500);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Download content
  const handleDownload = () => {
    const content = activeTab === 0 ? aiResponse : refinedResponse;
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `conatorAI_${type}_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Steps for the content generation process
  const steps = [
    'Input Query',
    'Generate Content',
    'Provide Feedback',
    'Final Output'
  ];

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#ffffff'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '100%',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: { xs: 2, md: 4 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          pb: 2,
          width: '100%'
        }}>
          <Typography variant="h3" sx={{ 
            color: '#000000', 
            fontWeight: 700, 
            letterSpacing: 1.2
          }}>
            conatorAI Content Studio
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <img src={user.photo} alt={user.name} style={{ width: 45, height: 45, borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
              <Box>
                <Typography variant="subtitle1" className="user-name" sx={{ fontWeight: 600, color: '#000000' }}>{user.name}</Typography>
                <Button size="small" variant="contained" color="secondary" onClick={handleSignOut}>Sign Out</Button>
              </Box>
            </Box>
          )}
        </Box>

        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            mb: 5,
            width: '100%',
            '& .MuiStepLabel-label': {
              color: '#0000ff',
              fontSize: '1.1rem',
              mt: 1
            },
            '& .MuiStepIcon-root': {
              fontSize: 32,
              '&.Mui-active': {
                color: '#0000ff'
              },
              '&.Mui-completed': {
                color: '#000000'
              }
            }
          }} 
          alternativeLabel
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <form onSubmit={handleGenerate} style={{ width: '100%', maxWidth: '800px' }}>
            <Grid container spacing={3} sx={{ justifyContent: 'center', alignItems: 'center' }}>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#000000', mb: 1, fontWeight: 500 }}>
                  What would you like to create today?
                </Typography>
                <TextField
                  placeholder="Describe your content idea in detail..."
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={5}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '1.1rem',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.15)',
                        borderWidth: '1px'
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 0, 255, 0.3)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#0000ff',
                        borderWidth: '2px'
                      },
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)'
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 8px 24px rgba(0, 0, 255, 0.15)'
                      }
                    }
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Content Type</InputLabel>
                  <Select value={type} label="Content Type" onChange={e => setType(e.target.value)}>
                    {typeOptions.map(opt => (
                      <MenuItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Length</InputLabel>
                  <Select value={length} label="Length" onChange={e => setLength(e.target.value)}>
                    {lengthOptions.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Themes (comma separated)"
                  variant="outlined"
                  fullWidth
                  value={themes}
                  onChange={e => setThemes(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tone</InputLabel>
                  <Select value={tone} label="Tone" onChange={e => setTone(e.target.value)}>
                    {toneOptions.map(opt => (
                      <MenuItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Custom Elements (e.g., include dragons, set in future)"
                  variant="outlined"
                  fullWidth
                  value={customElements}
                  onChange={e => setCustomElements(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox checked={generateImages} onChange={e => setGenerateImages(e.target.checked)} />}
                  label="Generate Images"
                />
              </Grid>
              {generateImages && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Image Style</InputLabel>
                    <Select value={imageStyle} label="Image Style" onChange={e => setImageStyle(e.target.value)}>
                      {styleOptions.map(opt => (
                        <MenuItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              {inputError && (
                <Grid item xs={12}>
                  <Alert severity="error">{inputError}</Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large" 
                  fullWidth
                  disabled={isGenerating}
                  sx={{ 
                    mt: 3, 
                    py: 2, 
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    borderRadius: 2,
                    backgroundColor: '#0000ff',
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#0000cc'
                    }
                  }}
                >
                  {isGenerating ? <CircularProgress size={28} /> : 'Generate Content'}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}

        {activeStep >= 1 && aiResponse && (
          <Box sx={{ mt: 4 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              sx={{ 
                mb: 3,
                width: '100%',
                maxWidth: '800px',
                '& .MuiTab-root': {
                  color: '#000000',
                  fontSize: '1rem',
                  fontWeight: 500,
                  py: 1.5
                },
                '& .Mui-selected': {
                  color: '#0000ff !important'
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#0000ff',
                  height: 3
                }
              }}
            >
              <Tab label="Original Content" />
              {refinedResponse && <Tab label="Refined Content" />}
            </Tabs>
            
            <Box sx={{ 
              p: 3, 
              borderRadius: 2, 
              mb: 4, 
              bgcolor: '#ffffff',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              maxHeight: '60vh',
              overflow: 'auto',
              width: '100%',
              maxWidth: '800px'
            }}>
              <Typography variant="body1" sx={{ 
                whiteSpace: 'pre-wrap', 
                lineHeight: 1.9,
                fontSize: '1.05rem',
                color: '#000000',
                textAlign: 'center'
              }}>
                {activeTab === 0 ? aiResponse : refinedResponse}
              </Typography>
            </Box>
            
            {images.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#fff', fontWeight: 500 }}>Generated Images</Typography>
                <Grid container spacing={3}>
                  {images.map((image, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card sx={{ 
                        borderRadius: 2, 
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)'
                        }
                      }}>
                        <CardMedia
                          component="img"
                          height="250"
                          image={image.url}
                          alt={`Generated image ${index + 1}`}
                        />
                        <CardContent sx={{ bgcolor: 'rgba(255, 255, 255, 0.95)' }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Style: {image.style.charAt(0).toUpperCase() + image.style.slice(1)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {analytics && (
              <Box sx={{ 
                mb: 4, 
                p: 3, 
                bgcolor: '#ffffff', 
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                width: '100%',
                maxWidth: '800px'
              }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#0000ff', fontWeight: 500, textAlign: 'center' }}>Content Analytics</Typography>
                <Grid container spacing={3}>
                  {[
                    { label: 'Word Count', value: analytics.wordCount },
                    { label: 'Readability', value: analytics.readability },
                    { label: 'Sentiment', value: analytics.sentiment },
                    { label: 'Characters', value: analytics.characters },
                    { label: 'Paragraphs', value: analytics.paragraphs },
                    { label: 'Reading Time', value: analytics.readingTime }
                  ].map((item, index) => (
                    <Grid item xs={6} sm={4} key={index}>
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{item.label}</Typography>
                        <Typography variant="h6" fontWeight={600} color="primary">{item.value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
              >
                Download
              </Button>
              
              {activeStep === 3 && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => {
                    setActiveStep(0);
                    setAiResponse('');
                    setRefinedResponse('');
                    setImages([]);
                    setChangelog([]);
                    setIteration(0);
                  }}
                >
                  Create New Content
                </Button>
              )}
            </Box>
          </Box>
        )}
        
        {activeStep === 2 && aiResponse && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, color: '#000000', fontWeight: 500, textAlign: 'center' }}>
              How would you like to improve your content?
            </Typography>
            
            <Box sx={{ mb: 4, p: 3, bgcolor: '#ffffff', borderRadius: 2, width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: '#0000ff', textAlign: 'center' }}>Quick Feedback Options:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
                {feedbackOptions.map((option, index) => (
                  <Chip 
                    key={index} 
                    label={option} 
                    clickable
                    sx={{
                      fontSize: '0.95rem',
                      py: 2.5,
                      px: 1,
                      bgcolor: selectedFeedback.includes(option) ? 'rgba(0, 0, 255, 0.1)' : '#ffffff',
                      color: selectedFeedback.includes(option) ? '#0000ff' : '#000000',
                      border: selectedFeedback.includes(option) ? '1px solid #0000ff' : '1px solid rgba(0, 0, 0, 0.2)',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 255, 0.05)',
                      }
                    }}
                    onClick={() => handleFeedbackSelect(option)}
                  />
                ))}
              </Box>
            </Box>
            
            <TextField
              placeholder="Describe any specific changes you'd like to see in your content..."
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              sx={{ 
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.15)',
                    borderWidth: '1px'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 0, 255, 0.3)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0000ff',
                    borderWidth: '2px'
                  },
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 8px 24px rgba(0, 0, 255, 0.15)'
                  }
                }
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Button 
                variant="contained" 
                onClick={handleRefine}
                disabled={isGenerating || (selectedFeedback.length === 0 && !feedback)}
                sx={{ 
                  py: 2,
                  px: 4, 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  backgroundColor: '#0000ff',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#0000cc',
                  }
                }}
              >
                {isGenerating ? <CircularProgress size={24} /> : 'Refine Content'}
              </Button>
            </Box>
          </Box>
        )}
        
        {changelog.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#000000', fontWeight: 500, textAlign: 'center' }}>Revision History</Typography>
            <Box sx={{ 
              borderRadius: 2, 
              p: 3,
              bgcolor: '#ffffff',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              width: '100%',
              maxWidth: '800px'
            }}>
              {changelog.map((log, index) => (
                <Box key={index} sx={{ 
                  mb: 1.5, 
                  pb: 1.5, 
                  borderBottom: index < changelog.length - 1 ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main', 
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </Box>
                  <Typography variant="body1">{log}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
      
      <Button 
        variant="text" 
        onClick={() => navigate('/')}
        sx={{ 
          mt: 3,
          mb: 2,
          color: '#0000ff',
          fontSize: '1rem',
          '&:hover': {
            color: '#0000cc',
            bgcolor: 'rgba(0, 0, 255, 0.05)'
          }
        }}
        startIcon={<Box sx={{ fontSize: '1.5rem' }}>←</Box>}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default GenerateContentPage;