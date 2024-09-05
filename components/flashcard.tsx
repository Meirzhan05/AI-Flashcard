import { Box, Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";
interface FlashcardProps {
    flashcard: {
        front: string;
        back: string;
    }
}

const Flashcards: React.FC<FlashcardProps> = ({ flashcard}: {
    flashcard: {
        front: string;
        back: string;
    }
}) => {
    const [flipped, setFlipped] = useState(false);
    const handleFlip = () => {;
        setFlipped(!flipped);
    }
    return (
        <Card onClick={handleFlip} sx={{
            bgcolor: "#080808",
            width: {
                xs: "100%", // width on extra small screens
                sm: "90%", // width on small screens
                md: "80%", // width on medium screens
                lg: "70%", // width on large screens
                xl: "60%", // width on extra large screens
            },
            height: "60vh",

        }}>
            <Box sx={{
                bgcolor: "#202123",
                width: "100%",
                height: "100%",
                position: "relative",
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transition: "transform 0.8s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                borderRadius: "10px",
            }}>
                <CardContent sx={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <Typography variant="h5">{flashcard.front}</Typography>
                    </Box>
                </CardContent>
                <CardContent sx={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <Typography variant="h5">{flashcard.back}</Typography>
                    </Box>
                </CardContent>
            </Box>
        </Card>
    )
}

export default Flashcards;