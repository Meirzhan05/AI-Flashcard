import React, { useEffect, useState } from "react";
import { 
  Box, 
  Button, 
  IconButton, 
  Menu, 
  Typography, 
  MenuItem, 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  Grid,
  Paper,
  Tooltip
} from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import db from "@/firebase/firebase";
import CreateCollectionForm from "./createCollectionForm";
import CreatePdfCollectionForm from "./collectionsPdfCollectionForm";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export const CollectionsDashboard = () => {
  const [menuState, setMenuState] = useState<{ anchorEl: HTMLElement | null, collectionId: string | null }>({ anchorEl: null, collectionId: null });
  const [openTextForm, setOpenTextForm] = useState(false);
  const [openPdfForm, setOpenPdfForm] = useState(false);
  const { user } = useUser();
  const [pdfAnchorEl, setPdfAnchorEl] = useState<null | HTMLElement>(null);
  const [collections, setCollections] = useState<{ id: string; [key: string]: any }[]>([]);
  const router = useRouter();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, collectionId: string) => {
    setMenuState({ anchorEl: event.currentTarget as HTMLElement, collectionId });
  };

  const handleMenuClose = () => {
    setMenuState({ anchorEl: null, collectionId: null });
  };

  const handlePdfButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPdfAnchorEl(event.currentTarget);
  };

  const handlePdfMenuClose = () => {
    setPdfAnchorEl(null);
  };

  const handleCollectionClick = (collectionID: string) => {
    router.push(`/collections/${collectionID}`);
  };

  const handleTextFormOpen = () => {
    setOpenTextForm(!openTextForm);
    handlePdfMenuClose();
  };

  const handlePdfFormOpen = () => {
    setOpenPdfForm(!openPdfForm);
    handlePdfMenuClose();
  };

  const fetchCollections = async () => {
    if (!user) {
      console.error('User is not signed in');
      return [];
    }

    const userCollectionsRef = collection(db, 'users', user.id, 'collections');
    const userCollectionsSnapshot = await getDocs(userCollectionsRef);

    const userCollections = userCollectionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return userCollections;
  };

  const deleteCollection = async (event: React.MouseEvent<HTMLElement>, collectionId: string | null) => {
    event.stopPropagation();
    if (collectionId === null || !user) {
      console.error('User is not signed in');
      return;
    }

    try {
      const collectionRef = doc(db, 'users', user.id, 'collections', collectionId);
      await deleteDoc(collectionRef);
      handleMenuClose();
      setCollections(prevCollections => 
        prevCollections.filter(collection => collection.id !== collectionId)
      );
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  useEffect(() => {
    const fetchAndSetCollections = async () => {
      const fetchedCollections = await fetchCollections();
      setCollections(fetchedCollections);
    };

    fetchAndSetCollections();
  }, [user]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
        <Paper elevation={3} sx={{ width: '100%', maxWidth: 1200, borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" component="h1">
                Collections
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handlePdfButtonClick}
                sx={{ backgroundColor: 'white', color: 'black' }}
              >
                Create New Collection
              </Button>
            </Box>
            <Grid container spacing={2}>
              {collections.map((collection: any) => (
                <Grid item xs={12} sm={6} md={4} key={collection.id}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer', 
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                    }}
                    onClick={() => handleCollectionClick(collection.id)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                        {collection.collectionName}
                      </Typography>
                      <Tooltip title="More options">
                        <IconButton 
                          size="small" 
                          onClick={(event) => {
                            event.stopPropagation();
                            handleMenuOpen(event, collection.id);
                          }}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Box>

      <Menu
        anchorEl={pdfAnchorEl}
        open={Boolean(pdfAnchorEl)}
        onClose={handlePdfMenuClose}
      >
        <MenuItem onClick={handlePdfFormOpen}>
          <EventNoteOutlinedIcon sx={{ mr: 1 }} />
          Upload from PDF
        </MenuItem>
        <MenuItem onClick={handleTextFormOpen}>
          <DescriptionOutlinedIcon sx={{ mr: 1 }} />
          Upload from Text
        </MenuItem>
      </Menu>

      <Menu 
        anchorEl={menuState.anchorEl}
        open={Boolean(menuState.anchorEl)}
        onClose={handleMenuClose}
        onClick={(event) => event.stopPropagation()}
      >
        <MenuItem onClick={(event) => deleteCollection(event, menuState.collectionId)}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {openTextForm && <CreateCollectionForm open={openTextForm} handlePdfFormOpen={handleTextFormOpen} setCollections={setCollections} fetchCollections={fetchCollections}/>}
      {openPdfForm && <CreatePdfCollectionForm open={openPdfForm} handlePdfFormOpen={handlePdfFormOpen} setCollections={setCollections} fetchCollections={fetchCollections}/>}
    </ThemeProvider>
  );
};