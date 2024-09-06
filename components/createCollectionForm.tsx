'use client'
import { Box, Dialog, TextField, Button, Typography } from "@mui/material"
import db from "@/firebase/firebase";
import { setDoc, doc, collection } from "firebase/firestore";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
interface CreateCollectionFormProps {
    open: boolean;
    handlePdfFormOpen: () => void;
    fetchCollections: () => Promise<{ id: string; [key: string]: any }[]>;
    setCollections: (collections: { id: string; [key: string]: any }[]) => void;
}

const CreateCollectionForm: React.FC<CreateCollectionFormProps> = ({open, handlePdfFormOpen, fetchCollections, setCollections}) => {
    const [collectionName, setCollectionName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const {user} = useUser();
    const inputStyles = {
        width: '100%',
        color: 'white',
        "& .MuiOutlinedInput-root": {
            color: "white",
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
                borderWidth: "0.5px",
            },
            "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                  borderWidth: "2px",
                },
            },
              "&:hover:not(.Mui-focused)": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ccc",
                },
            },
        },
        "& .MuiInputLabel-outlined": {
            color: "white",
            "&.Mui-focused": {
              color: "primary.main",
            },
        },
    }

    const saveCollection = async () => {
        if (!description || !collectionName || !user) {
            console.error('User is not signed in');
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
            if (response !== undefined && !response.ok) {
                throw new Error('Failed to generate flashcards')
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

            // Fetch the updated list of collections
            const updatedCollections = await fetchCollections();
            setCollections(updatedCollections);
            handlePdfFormOpen();
        } catch (error) {
            alert('An error occurred while generating flashcards. Please try again.')
        }
    }

    return (
        <Box>
            <Dialog open={open} fullWidth PaperProps={{
                style: {
                    backgroundColor: '#202123',

                }
            }}>
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: 4,
                        gap: 5,
                        color: 'white',
                }}
                >
                    <Box>
                        <Typography variant="h5">
                            Create Collection
                        </Typography>
                    </Box>
                    <Box component="form" sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 5,
                    }}>

                        <TextField label="Name" variant="outlined" required onChange={(e) => setCollectionName(e.target.value)} sx={inputStyles}/>
                        <TextField label="Flashcards Description" required rows={4} multiline onChange={(e) => setDescription(e.target.value)} variant="outlined" sx={inputStyles}/>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 2,
                            }}>
                            <Button variant="contained" onClick={() => handlePdfFormOpen()} sx={{
                                mt: 2,
                                width: '18%',
                                height: '85%',
                                color: 'white',
                                bgcolor: '#383942',
                                '&:hover': {
                                    bgcolor: '#777886'
                                },
                                transition: '.6s',
                            }}>
                                Cancel    
                            </Button>
                            <Button variant="contained" onClick={saveCollection} sx={{
                                mt: 2,
                                width: '18%',
                                height: '85%',
                                bgcolor: 'white',
                                color: '#383942',
                                '&:hover': {
                                    bgcolor: '#777886'
                                },
                                transition: '.6s',
                            }}>
                                Create
                            </Button>
                        </Box>
                    </Box>
                </Box>

            </Dialog>
        </Box>
    )
}

export default CreateCollectionForm;