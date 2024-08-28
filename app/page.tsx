import { Box, Button, Typography } from "@mui/material";

export default function Home() {
  const linkStyle = {
    color: 'black',
    backgroundColor: 'white',
    "&:hover": {
        color: '#737B78',
        cursor: 'pointer'
    }
};
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
          <Button variant="contained" sx={linkStyle}>
            Get Started
          </Button>
          <Button variant="contained" sx={linkStyle}>
            Sign In
          </Button>
        </Box>

      </Box>

    </Box>

  );
}
