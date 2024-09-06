import { Box, Button, Icon, IconButton, Menu, Typography, MenuItem } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useEffect, useState } from "react";
import CreateCollectionForm from "./createCollectionForm";
import CreatePdfCollectionForm from "./collectionsPdfCollectionForm";
import db from "@/firebase/firebase";
import { collection, getDocs, deleteDoc, doc} from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
export const CollectionsDashboard = () => {
    const [menuState, setMenuState] = useState<{ anchorEl: HTMLElement | null, collectionId: string | null }>({ anchorEl: null, collectionId: null });
    const [openTextForm, setOpenTextForm] = useState(false);
    const [openPdfForm, setOpenPdfForm] = useState(false);
    const {user} = useUser();
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
    }


    const handleCollectionClick = (collectionID: string) => {
        router.push(`/collections/${collectionID}`)
    }
    
    // Add these handler functions
    const handleTextFormOpen = () => {
        setOpenTextForm(!openTextForm);
        console.log("text form open")
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
    }


    const deleteCollection = async (event: React.MouseEvent<HTMLElement>, collectionId: string | null) => {
        event.stopPropagation();
        if (collectionId === null || !user) {
            console.error('User is not signed in');
            return;
        }
    
        try {
            const collectionRef = doc(db, 'users', user.id, 'collections', collectionId);
            await deleteDoc(collectionRef);
            handleMenuClose()
            setCollections(prevCollections => 
                prevCollections.filter(collection => collection.id !== collectionId)
            );
        } catch (error) {
            console.error("Error deleting collection:", error);
        }
    }

    useEffect(() => {
        const fetchAndSetCollections = async () => {
            const fetchedCollections = await fetchCollections();
            setCollections(fetchedCollections);
        };
    
        fetchAndSetCollections();
    }, []);

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Box sx={{
                bgcolor: "#202123",
                width: '90%',
                height: '90vh',
                borderRadius: 3,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
            }}>
                <Box sx={{
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 3,
                }}>
                    <Typography sx={{
                        fontSize: 27,
                    }}>
                        Collections
                    </Typography>

                    <Button variant="contained" onClick={handlePdfButtonClick}
                     sx={{ 
                        textTransform: "capitalize",
                        bgcolor: "white",
                        color: "#383942",
                        ":hover": {
                            bgcolor: "#818291",
                        }
                    }}>
                        create new collection
                    </Button>
                    <Menu
                        anchorEl={pdfAnchorEl}
                        open={Boolean(pdfAnchorEl)}
                        onClose={handlePdfMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        >
                        <MenuItem onClick={handlePdfFormOpen} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontSize: 14,
                            justifyContent: 'center',
                            alignContent: 'center',
                        }}>
                            <EventNoteOutlinedIcon sx={{
                                color: '',
                                fontSize: 19,
                            }}/>
                            Upload from PDF
                        </MenuItem>
                        <MenuItem onClick={handleTextFormOpen} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontSize: 14,
                            justifyContent: 'center',
                            alignContent: 'center',
                        }}>
                            <DescriptionOutlinedIcon sx={{
                                color: '',
                                fontSize: 19,
                            }}/>
                            Upload from Text
                        </MenuItem>
                    </Menu>
                </Box>

                <Box sx={{
                    pr: 5,
                    pl: 5,
                    pb: 2,
                    overflowY: 'auto',
                }}>
                    {collections.map((collection: any, index) => (
                        <Box key={index} onClick={() => handleCollectionClick(collection.id)}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 3,
                                bgcolor: "#383942",
                                padding: 2,
                                borderRadius: 3,
                                ':hover': {
                                    bgcolor: "#818291",
                                    transition: '0.5s',
                                    cursor: 'pointer',
                                },
                                ':active': {
                                    bgcolor: "#818291",
                                    transition: '0.5s',
                                }
                            }}>
                                <Typography sx={{
                                    color: 'white',
                                    fontSize: 17,
                                }}>{collection.collectionName}</Typography>
                                <Typography sx={{
                                    color: 'white',
                                    fontSize: 17,
                                }}>{collection.dateCreated}</Typography>
                                <IconButton onClick={(event) => {
                                    event.stopPropagation();
                                    handleMenuOpen(event, collection.id);
                                }}>
                                    <MoreHorizIcon sx={{
                                        color: 'white',
                                        fontSize: 30,
                                    }} />
                                </IconButton>
                                <Menu 
                                    anchorEl={menuState.anchorEl}
                                    open={Boolean(menuState.anchorEl)}
                                    onClose={handleMenuClose}
                                    onClick={(event) => event.stopPropagation()}
                                    slotProps={{
                                        paper: {
                                            style: {
                                                backgroundColor: "#383942",
                                                color: "white",
                                            }
                                        }
                                    }}>
                                    <MenuItem onClick={(event) => deleteCollection(event, menuState.collectionId)}>

                                        Delete
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
            {openTextForm && <CreateCollectionForm open={openTextForm} handlePdfFormOpen={handleTextFormOpen} setCollections={setCollections} fetchCollections={fetchCollections}/>}
            {openPdfForm && <CreatePdfCollectionForm open={openPdfForm} handlePdfFormOpen={handlePdfFormOpen} setCollections={setCollections} fetchCollections={fetchCollections}/>}
        </Box>
    );
}