import React from 'react';
import { Box, Button } from '@mui/material';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import FastfoodIcon from '@mui/icons-material/Fastfood';

function DeviceOperation() {
    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-evenly', 
                width: "80%", 
                height: 280, 
                borderRadius: 4, 
                border: '3px solid black', 
                position: 'relative', 
                backgroundColor: 'rgba(220, 220, 220, 0.7)', 
                padding: '0 20px',
                mt: 2
            }}
            
        >
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: 280, 
                    height: 200, 
                    borderRadius: 4, 
                    position: 'relative',
                    backgroundColor: 'rgba(240, 240, 240, 0.9)',
                    border: '2px solid gray',
                    padding: '10px'
                }}
            >
                <Button variant="contained" color="primary" sx={{ position: 'absolute', top: 15, left: '50%', transform: 'translateX(-50%)' }}>직진</Button>
                <Button variant="contained" color="error" sx={{ position: 'absolute', bottom: 15, left: '50%', transform: 'translateX(-50%)' }}>후진</Button>
                <Button variant="contained" color="warning" sx={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)' }}>좌회전</Button>
                <Button variant="contained" color="info" sx={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)' }}>우회전</Button>
                <Button variant="contained" color="secondary" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 80, height: 80, borderRadius: '50%' }}>정지</Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', height: '100%' }}>
                <Button 
                    startIcon={<DirectionsWalkIcon />}
                    variant="outlined" 
                    color="primary" 
                    sx={{ width: 160, height: 80, borderRadius: '20px', fontSize: '1.2rem' }}
                >
                    제자리걸음
                </Button>
                <Button 
                    startIcon={<FastfoodIcon />}
                    variant="outlined" 
                    color="success" 
                    sx={{ width: 160, height: 80, borderRadius: '20px', fontSize: '1.2rem' }}
                >
                    간식주기
                </Button>
            </Box>
        </Box>
    );
}

export default DeviceOperation;
