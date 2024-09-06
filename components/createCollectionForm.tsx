'use client'
import React, { useState } from "react";
import { 
  Box, 
  Dialog, 
  TextField, 
  Button, 
  Typography, 
  ThemeProvider, 
  createTheme,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import { Close as CloseIcon } from '@mui/icons-material';
import db from "@/firebase/firebase";
import { setDoc, doc, collection } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";

interface CreateCollectionFormProps {
  open: boolean;
  handlePdfFormOpen: () => void;
  fetchCollections: () => Promise<{ id: string; [key: string]: any }[]>;
  setCollections: (collections: { id: string; [key: string]: any }[]) => void;
}

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
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#90caf9',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const CreateCollectionForm: React.FC<CreateCollectionFormProps> = ({
  open, 
  handlePdfFormOpen, 
  fetchCollections, 
  setCollections
}) => {
  const [collectionName, setCollectionName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const { user } = useUser();

  const saveCollection = async () => {
    if (!description || !collectionName || !user) {
      console.error('User is not signed in or form is incomplete');
      return;
    }
    try {
      const response: Response = await fetch('/api/generateFlashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({description}),  
      });
      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      const userCollectionsRef = collection(db, 'users', user.id, 'collections');
      const newDocRef = doc(userCollectionsRef);
      await setDoc(newDocRef, {
        collectionName: collectionName,
        DateCreated: new Date(),
        Description: description,
        flashcards: data.flashcards.flashcards,
      });

      const updatedCollections = await fetchCollections();
      setCollections(updatedCollections);
      handlePdfFormOpen();
    } catch (error) {
      alert('An error occurred while generating flashcards. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog 
        open={open} 
        onClose={handlePdfFormOpen}
        fullWidth 
        maxWidth="sm"
      >
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              Create Collection
            </Typography>
            <IconButton onClick={handlePdfFormOpen} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField 
            label="Name" 
            variant="outlined" 
            fullWidth 
            required 
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)} 
            sx={{ mb: 3 }}
          />
          <TextField 
            label="Flashcards Description" 
            variant="outlined"
            fullWidth
            required 
            multiline 
            rows={4} 
            value={description}
            onChange={(e) => setDescription(e.target.value)} 
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handlePdfFormOpen}
            variant="outlined"
            color="inherit"
          >
            Cancel    
          </Button>
          <Button 
            onClick={saveCollection}
            variant="contained"
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default CreateCollectionForm;