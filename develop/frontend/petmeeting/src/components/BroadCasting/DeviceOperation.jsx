import React from 'react';
import { Box, Button } from '@mui/material';

function DeviceOperation() {
    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: 200, 
                height: 200, 
                borderRadius: '50%', 
                border: '3px solid black', 
                position: 'relative' 
            }}
        >
            <Button 
                variant="contained" 
                color="primary" 
                sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%' 
                }}
            >
                O
            </Button>
        </Box>
    );
}

export default DeviceOperation;
