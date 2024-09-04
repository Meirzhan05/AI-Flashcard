'use client'
import { Box, Button, Typography } from "@mui/material";
import {
  SignInButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs'

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const linkStyle = {
    color: 'black',
    backgroundColor: 'white',
    "&:hover": {
        color: '#737B78',
        cursor: 'pointer'
    }
  };

  const handleClick = () => {
    router.push('/collections');
  }
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
    }}>
      <Box sx={{
        bgcolor: "#171717",
        padding: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
        width: '95%',
        borderRadius: 2,
        flexDirection: 'column',
        gap: 5, 
      }}>
        <Typography sx={{
          color: '#FFFFFF',
          fontSize: 50,
          fontWeight: 400,
        }}>
          Learn Anything
        </Typography>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 4,
          justifyContent: 'center',
          alignItems: 'center',
        }}>

          <SignedIn>
              <Button variant="contained" sx={linkStyle} onClick={handleClick}>
                    Get Started
              </Button>
          </SignedIn>
          <SignedOut>
              <SignInButton signUpForceRedirectUrl={'/generate'}>
                <Button variant="contained" sx={linkStyle}>
                    Get Started
                </Button>
              </SignInButton>
          </SignedOut>
        </Box>

      </Box>

    </Box>

  );
}
