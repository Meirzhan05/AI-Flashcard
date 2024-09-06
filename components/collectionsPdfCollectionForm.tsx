'use client'
import { Box, Dialog, TextField, Button, IconButton, Typography } from "@mui/material"
import db from "@/firebase/firebase";
import { setDoc, doc, collection } from "firebase/firestore";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';

interface CreatePdfCollectionFormProps {
    open: boolean;
    handlePdfFormOpen: () => void;
    fetchCollections: () => Promise<{ id: string; [key: string]: any }[]>;
    setCollections: (collections: { id: string; [key: string]: any }[]) => void;
}

const CreatePdfCollectionForm: React.FC<CreatePdfCollectionFormProps> = ({open, handlePdfFormOpen, fetchCollections, setCollections}) => {
    const [collectionName, setCollectionName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const {user} = useUser();
    const [file, setFile] = useState<File | null>(null);

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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
          setFile(event.target.files[0]);
        }
    };
    const handleRemoveFile = () => {
        setFile(null);
    };


    const saveCollection = async () => {
        if (!collectionName || !user) {
            console.error('User is not signed in');
            return;
        }
        try {
            const formData = new FormData();
            if (file) {
                formData.append('file', file);
            }
            formData.append('collectionName', collectionName);
            formData.append('description', description);


            const uploadResponse: Response = await fetch('/api/generatePdfFlashcards', {
                method: 'POST',
                body: formData,  
            });

            const data = await uploadResponse.json();
            console.log(data);

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
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<UploadIcon />}
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                },
                                padding: '10px 20px',
                                borderRadius: '4px',
                                textTransform: 'none',
                            }}
                            >
                            Select File
                            <input
                                type="file"
                                hidden
                                onChange={handleFileChange}
                                accept=".pdf"
                            />
                            </Button>


                            {file && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                <Typography variant="body2" color="white" sx={{ mr: 1 }}>
                                    {file.name}
                                </Typography>
                                <IconButton 
                                    onClick={handleRemoveFile}
                                    size="small"
                                    sx={{ color: 'white' }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                                </Box>
                            )}
                        
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

export default CreatePdfCollectionForm;