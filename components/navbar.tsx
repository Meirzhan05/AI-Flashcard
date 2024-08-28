import { Box, List, ListItem } from "@mui/material";
import Link from 'next/link';

const NavBar = () => {
    const linkStyle = {
        color: 'white', 
        fontWeight: 300, 
        fontSize: 14, 
        textDecoration: 'none',
        transition: 'color 0.4s',
        "&:hover": {
            color: '#737B78',
            cursor: 'pointer'
        }
    };
      
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-around', p: 1, }}>
      <List sx={{ display: 'flex', flexDirection: 'row'}}>
        <ListItem>
          <Link href="/" style={{textDecoration: 'none'}}>
            <Box sx={linkStyle}>
                Home
            </Box>
          </Link>
        </ListItem>
        {/* <ListItem>
          <Link href="/about" style={{textDecoration: 'none'}}>
            <Box sx={linkStyle}>
                About
            </Box>
          </Link>
        </ListItem> */}
        <ListItem>
          <Link href="/pricing" style={{textDecoration: 'none'}}>
            <Box sx={linkStyle}>
                Pricing
            </Box>
          </Link>
        </ListItem>
        <ListItem>
          <Link href="/contact" style={{textDecoration: 'none'}}>
            <Box sx={linkStyle}>
                Contact
            </Box>
          </Link>
        </ListItem>
      </List>
    </Box>
  );
};

export default NavBar;