'use client'
import getStripe from "@/utils/get-stripe"
import { Box, Button, Typography } from "@mui/material"


export default function PricingPage() {
    const handleSubmit = async () => {
        const checkoutSession = await fetch('/api/checkout_sessions', {
          method: 'POST',
          headers: { origin: 'http://localhost:3000' },
        })
        const checkoutSessionJson = await checkoutSession.json()
      
        const stripe = await getStripe()
        const {error} = await stripe.redirectToCheckout({
          sessionId: checkoutSessionJson.id,
        })
      
        if (error) {
          console.warn(error.message)
        }
    }
    
    return (
        <Box sx={{my: 6, textAlign: 'center'}}>
            <Button variant="contained" onClick={handleSubmit}>Pricing</Button>

        </Box>
    )
}