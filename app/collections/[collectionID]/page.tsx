"use client"

import { Box, Button, IconButton, Typography } from "@mui/material"
import Flashcards from "@/components/flashcard"
import { useState, useEffect } from "react"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import db from "@/firebase/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc } from "firebase/firestore";
const FlashcardsDetail = ({ params }: {
    params: { collectionID: string }
}) => {
    const [flashcardsData, setFlashcardsData] = useState([]);
    const { user } = useUser();

    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
    const [direction, setDirection] = useState<'left' | 'right' | null>(null);

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
                const collectionRef = doc(db, 'users', user.id, 'collections', params.collectionID);
                const userCollectionsSnapshot = await getDoc(collectionRef);
                setFlashcardsData(userCollectionsSnapshot.get('flashcards'));
            }
        }
        fetchFlashcards()
    }, [user, params.collectionID]);

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            overflow: "hidden",
            position: "relative",
        }}>

            <Flashcards
                key={currentFlashcardIndex}
                flashcard={flashcardsData[currentFlashcardIndex] || { front: '', back: '' }}
            />
            <Box sx={{ 
                    display: "flex",
                    gap: 10, 
                    marginTop: 2, 
                    alignItems: 'center',
                }}>
                <IconButton onClick={handlePrev}sx={{
                    '&:hover': {
                        backgroundColor: "#171717"
                    },
                }}>
                    <ArrowBackIcon sx={{
                        color: "white",
                    }}/>
                </IconButton>
                <Typography sx={{ color: "white" }}>{currentFlashcardIndex + 1} / {flashcardsData.length}</Typography>
                <IconButton onClick={handleNext} sx={{
                    '&:hover': {
                        backgroundColor: "#171717"
                    },
                }}>
                    <ArrowForwardIcon sx={{
                        color: "white",
                    }}/>
                </IconButton>
            </Box>
        </Box>
    )
}

export default FlashcardsDetail