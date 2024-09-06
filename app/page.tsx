'use client'

import React from 'react';
import { Box, Button, Typography, ThemeProvider, createTheme, Grid, Paper } from "@mui/material";
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { useRouter } from "next/navigation";
import { ArrowForward, AutoAwesome, Speed, Psychology } from '@mui/icons-material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// Create a custom theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF',
    },
    background: {
      default: '#000000',
      paper: '#171717',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.00833em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          padding: '12px 24px',
          fontSize: '1rem',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 6px 12px rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  },
});

const FeatureItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
    {icon}
    <Typography variant="h6" component="h3" sx={{ my: 2 }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Paper>
);

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/collections');
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        padding: 3,
      }}>
        <Box sx={{
          bgcolor: 'background.paper',
          padding: { xs: 4, sm: 6, md: 8 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 'lg',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
        }}>
          <Typography variant="h1" component="h1" align="center" gutterBottom sx={{
            color: 'primary.main',
            marginBottom: 4,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}>
            FlashAI
          </Typography>
          <Typography variant="h5" align="center" sx={{ color: 'text.secondary', marginBottom: 6 }}>
            Unlock your potential with AI-powered learning
          </Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: '100%',
            maxWidth: 400,
            justifyContent: 'center',
            marginBottom: 8,
          }}>
            <SignedIn>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleClick}
                endIcon={<ArrowForward />}
                fullWidth
              >
                Get Started
              </Button>
            </SignedIn>
            <SignedOut>
              <SignInButton signUpForceRedirectUrl={'/generate'} mode="modal">
                <Button 
                  variant="contained" 
                  color="primary"
                  endIcon={<ArrowForward />}
                  fullWidth
                >
                  Get Started
                </Button>
              </SignInButton>
            </SignedOut>
          </Box>

          <Typography variant="h2" component="h2" align="center" sx={{ mb: 4, color: 'primary.main' }}>
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureItem 
                icon={<AutoAwesome sx={{ fontSize: 40, color: 'primary.main' }} />}
                title="AI-Powered Learning"
                description="Harness the power of artificial intelligence to create personalized learning experiences tailored to your needs."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureItem 
                icon={<Speed sx={{ fontSize: 40, color: 'primary.main' }} />}
                title="Accelerated Progress"
                description="Learn faster and more efficiently with our adaptive learning algorithms that focus on your areas for improvement."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureItem 
                icon={<Psychology sx={{ fontSize: 40, color: 'primary.main' }} />}
                title="Cognitive Enhancement"
                description="Boost your cognitive abilities through scientifically-designed exercises and challenges."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureItem 
                icon={<AttachMoneyIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
                title="Affordable Pricing"
                description="Access our AI-powered flashcards for a fraction of the cost of other learning platforms."
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}