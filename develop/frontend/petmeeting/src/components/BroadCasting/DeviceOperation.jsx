import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import axios from 'axios';


function DeviceOperation() {
    const [shelterNo, setshelterNo] = useState(null);

    const commandMapping = {
      "직진": 1,
      "정지": 2,
      "후진": 3,
      "우회전": 4,
      "좌회전": 5,
      "제자리걸음": 6,
      "간식주기": 7
    };

    useEffect(() => {
        // API 호출
        axios.get("https://i9a203.p.ssafy.io/backapi/api/v1/broadcast/shelter")
          .then(response => {
            const shelterNo = response.data.shelterNo;
            
            setshelterNo(shelterNo)
          })
          .catch(error => {
            console.error("API 요청 중 오류 발생:", error);
          });
      }, []);
    
    const handleCommand = (commandText) => {
      const commandValue = commandMapping[commandText];
      if (commandValue === undefined) {
          console.error("알 수 없는 명령:", commandText);
          return;
      }
      console.log('커맨드종류', commandValue)
      const token = JSON.parse(sessionStorage.getItem("token"));
      const accessToken = token.accessToken;
    //   console.log('토큰', accessToken)

      axios.post(`https://i9a203.p.ssafy.io/backapi/api/v1/iot/${shelterNo}`, {
        command: commandValue
      }, {
        headers: {
          AccessToken: `Bearer ${accessToken}`
        }
      })
      .then(response => {
        console.log(`'${commandText}' 명령이 성공적으로 전송되었습니다.`);
      })
      .catch(error => {
        console.error(`'${commandText}' 명령 전송 중 오류 발생:`, error);
      });
    };
    

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
                <Button variant="contained" color="primary" onClick={() => handleCommand("직진")} sx={{ position: 'absolute', top: 15, left: '50%', transform: 'translateX(-50%)' }}>직진</Button>
                <Button variant="contained" color="error" onClick={() => handleCommand("후진")} sx={{ position: 'absolute', bottom: 15, left: '50%', transform: 'translateX(-50%)' }}>후진</Button>
                <Button variant="contained" color="warning" onClick={() => handleCommand("좌회전")} sx={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)' }}>좌회전</Button>
                <Button variant="contained" color="info" onClick={() => handleCommand("우회전")} sx={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)' }}>우회전</Button>
                <Button variant="contained" color="secondary" onClick={() => handleCommand("정지")} sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 80, height: 80, borderRadius: '50%' }}>정지</Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', height: '100%' }}>
                <Button 
                    startIcon={<DirectionsWalkIcon />}
                    variant="outlined" 
                    color="primary" 
                    sx={{ width: 160, height: 80, borderRadius: '20px', fontSize: '1.2rem' }}
                    onClick={() => handleCommand("제자리걸음")}
                >
                    제자리걸음
                </Button>
                <Button 
                    startIcon={<FastfoodIcon />}
                    variant="outlined" 
                    color="success" 
                    sx={{ width: 160, height: 80, borderRadius: '20px', fontSize: '1.2rem' }}
                    onClick={() => handleCommand("간식주기")}
                >
                    간식주기
                </Button>
            </Box>
        </Box>
    );
}

export default DeviceOperation;
