'use client'
import React, { useState } from "react";
import { 
  Box, 
  Dialog, 
  TextField, 
  Button, 
  IconButton, 
  Typography, 
  ThemeProvider, 
  createTheme,
  DialogContent,
  DialogActions,
  Chip
} from "@mui/material";
import { 
  Close as CloseIcon, 
  Upload as UploadIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import db from "@/firebase/firebase";
import { setDoc, doc, collection } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";

interface CreatePdfCollectionFormProps {
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

const CreatePdfCollectionForm: React.FC<CreatePdfCollectionFormProps> = ({
  open, 
  handlePdfFormOpen, 
  fetchCollections, 
  setCollections
}) => {
  const [collectionName, setCollectionName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const { user } = useUser();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const saveCollection = async () => {
    if (!collectionName || !user || !file) {
      console.error('User is not signed in or form is incomplete');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('collectionName', collectionName);
      const uploadResponse: Response = await fetch('/api/generatePdfFlashcards', {
        method: 'POST',
        body: formData,  
      });

      const data = await uploadResponse.json();
      
      const userCollectionsRef = collection(db, 'users', user.id, 'collections');
      const newDocRef = doc(userCollectionsRef);
      await setDoc(newDocRef, {
        collectionName: collectionName,
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
              Create PDF Collection
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
          <Box sx={{ mb: 3 }}>
            <input
              accept="application/pdf"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                fullWidth
              >
                {file ? 'Change PDF' : 'Upload PDF'}
              </Button>
            </label>
          </Box>
          {file && (
            <Chip
              icon={<PdfIcon />}
              label={file.name}
              onDelete={handleRemoveFile}
              color="primary"
              variant="outlined"
            />
          )}
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
            disabled={!file || !collectionName}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default CreatePdfCollectionForm;