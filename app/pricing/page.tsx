'use client'
import getStripe from "@/utils/get-stripe"
// import { Box, Button, Typography } from "@mui/material"
import PricingCard from '@/components/pricingCard';
import React from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  Box, 
  Typography, 
  Container,
  Grid
} from '@mui/material';
import FAQ from '@/components/FAQ';
import { Check } from '@mui/icons-material';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#000000',
      paper: '#1e1e1e',
    },
  },
});



export default function FlashcardPricingPage() {
  const handleSubmit = async (price: number) => {
    try {
      const checkoutSession = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000' 
        },
        body: JSON.stringify({
          price: price,
        }),
      });

      if (!checkoutSession.ok) {
        throw new Error('Failed to create checkout session');
      }

      const checkoutSessionJson = await checkoutSession.json();
      
      if (!checkoutSessionJson.id) {
        throw new Error('Invalid checkout session response');
      }

      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });

      if (error) {
        console.error('Stripe redirect error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" align="center" color="white" gutterBottom>
            Subscription Plans
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <PricingCard
                handleSubmit={handleSubmit}
                title="Basic"
                price="$4.99"
                description="For casual learners"
                features={[
                  "100 AI-generated flashcards/month",
                  "5 collections",
                  "Basic text-to-flashcard",
                  "Basic PDF to Flashcard",
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <PricingCard
                handleSubmit={handleSubmit}
                title="Pro"
                price="$9.99"
                description="For serious students"
                features={[
                  "Unlimited AI-generated flashcards",
                  "Unlimited decks",
                  "Image and audio support",
                  "Spaced repetition system",
                  "Export to various formats",
                ]}
                popular
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <PricingCard
                handleSubmit={handleSubmit}
                title="Team"
                price="$24.99"
                description="For educators and study groups"
                features={[
                  "All Pro features",
                  "Up to 5 team members",
                  "Collaborative deck creation",
                  "Analytics and progress tracking",
                  "Priority support",
                  "Custom branding",
                ]}
              />
            </Grid>
          </Grid>
          <FAQ />
        </Container>
      </Box>
    </ThemeProvider>
  );
}