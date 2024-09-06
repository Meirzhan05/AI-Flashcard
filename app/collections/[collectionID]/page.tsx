"use client"

import React, { useState, useEffect } from "react";
import { 
  Box, 
  IconButton, 
  Typography, 
  ThemeProvider, 
  createTheme,
  CircularProgress,
  Fade
} from "@mui/material";
import { 
  ArrowBack as ArrowBackIcon, 
  ArrowForward as ArrowForwardIcon 
} from '@mui/icons-material';
import Flashcards from "@/components/flashcard";
import db from "@/firebase/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

const FlashcardsDetail = ({ params }: { params: { collectionID: string } }) => {
  const [flashcardsData, setFlashcardsData] = useState([]);
  const { user } = useUser();
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [loading, setLoading] = useState(true);

  const handleNext = () => {
    setDirection('left');
    setCurrentFlashcardIndex((prevIndex) => (prevIndex + 1) % flashcardsData.length);
  };

  const handlePrev = () => {
    setDirection('right');
    setCurrentFlashcardIndex((prevIndex) => (prevIndex - 1 + flashcardsData.length) % flashcardsData.length);
  };

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (user) {
        setLoading(true);
        const collectionRef = doc(db, 'users', user.id, 'collections', params.collectionID);
        const userCollectionsSnapshot = await getDoc(collectionRef);
        setFlashcardsData(userCollectionsSnapshot.get('flashcards'));
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [user, params.collectionID]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: '#080808',
        overflow: "hidden",
        position: "relative",
      }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFlashcardIndex}
                initial={{ x: direction === 'right' ? -300 : 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction === 'right' ? 300 : -300, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
              >
                <Flashcards
                  flashcard={flashcardsData[currentFlashcardIndex] || { front: '', back: '' }}
                />
              </motion.div>
            </AnimatePresence>
            <Fade in={true}>
              <Box sx={{ 
                display: "flex",
                gap: 4, 
                marginTop: 2, 
                alignItems: 'center',
              }}>
                <IconButton 
                  onClick={handlePrev}
                  sx={{
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography sx={{ color: 'white' }}>{currentFlashcardIndex + 1} / {flashcardsData.length}</Typography>
                <IconButton 
                  onClick={handleNext}
                  sx={{
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Fade>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default FlashcardsDetail;