"use client"

import { CollectionsDashboard } from "@/components/collectionsDashboard";
// import { useUser } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Box } from "@mui/material";

const GeneratePage = () => {
    const { isLoaded, isSignedIn, user } = useUser()
    if (!isLoaded) {
        return <div>Loading...</div>
    }
    if (!isSignedIn) {
        return <div>Sign in to access this page</div>
    }

    return (
        <Box>
            <CollectionsDashboard />
        </Box>
    );
}

export default GeneratePage;