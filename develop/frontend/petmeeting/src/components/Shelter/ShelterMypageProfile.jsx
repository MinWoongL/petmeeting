import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Avatar,
  Divider,
} from "@mui/material";
import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSessionInstance, setSubscribers } from '../../stores/Slices/sessionSlice';

const APPLICATION_SERVER_URL = 'https://i9a203.p.ssafy.io/openvidu/';
const OPENVIDU_PASSWORD = process.env.REACT_APP_OPENVIDU_PASSWORD;

const ProfileCard = ({ profile, onChange, onUpdate, showEditButton = true }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);
  const token = JSON.parse(sessionStorage.getItem("token"));

  const [mainStreamManager, setMainStreamManager] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://i9a203.p.ssafy.io/backapi/api/v1/user`,
        editData,
        { headers: { AccessToken: `Bearer ${token.accessToken}` } }
      );

      if (typeof onUpdate === "function") {
        onUpdate(response.data);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile data:", error);
    }
  };

  const handleBroadcast = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const shelterNo = userData.userNo
    console.log(shelterNo)
    JoinSession(shelterNo)
  };

  // const initializeSession = () => {
    

  //   return sessionInstance
  // };

  const JoinSession = async(shelterNo) => {
    
    const customSessionId = shelterNo.toString();

    const OV = new OpenVidu();
    const sessionInstance = OV.initSession();

    sessionInstance.on('streamCreated', (event) => {
      const subscriber = sessionInstance.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    sessionInstance.on('streamDestroyed', (event) => {
      setSubscribers((prevSubscribers) => prevSubscribers.filter((subscriber) => subscriber !== event.stream.streamManager));
    });

    sessionInstance.on('exception', (exception) => {
      console.warn(exception);
    });

    
    console.log(sessionInstance)
    console.log('Session내용: ', sessionInstance)

    dispatch(setSessionInstance(sessionInstance));
    console.log('join1')
    const token = await getToken(customSessionId);

    sessionInstance.connect(token, { clientData: `publisher${customSessionId}` })
          .then(async() => {
            console.log('Successfully connected to the session as a subscriber');

            const publisher = await OV.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false,
            });
            console.log('publisher >> ',publisher)
            sessionInstance.publish(publisher)
              .then(async () => {
                console.log('퍼블리싱 성공')
                const accessToken = JSON.parse(sessionStorage.getItem("token"))?.accessToken;
                // 성공적으로 publishing이 끝난 후에 POST 요청을 보냅니다.
                const response = await axios.post('https://i9a203.p.ssafy.io/backapi/api/v1/broadcast/broadcast', {
                    onBroadcastTitle: '방송제목', // 실제 방송 제목으로 바꿔야 합니다.
                    dogNo: 442 // 이 값도 적절한 값으로 바꿔야 합니다.
                },{
                  headers: {
                    AccessToken: `Bearer ${accessToken}`
                  }
                }
                );

                console.log('Broadcast POST response:', response.data);
            })
            .catch(error => {
                console.error('Error publishing:', error);
            });
            setMainStreamManager(publisher);
            setPublisher(publisher);
              
          })
          .catch((error) => {
              console.log('There was an error connecting to the session:', error.code, error.message);
          });

  }

  const getToken = async(customSessionId) => {
    // console.log('gettoken1')
    const sessionId = await createSession(customSessionId);
    return await createToken(sessionId);
  }
  const createSession = (sessionId) => {
    return new Promise((resolve, reject) => {
      let data = JSON.stringify({ customSessionId: sessionId });
  
      axios
        .post(`${APPLICATION_SERVER_URL}api/sessions`, data, {
          headers: {
            Authorization: `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_PASSWORD}`)}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          resolve(res.data.id);
        })
        .catch((res) => {
          let error = Object.assign({}, res);
  
          if (error?.response?.status === 409) {
            resolve(sessionId);
          } else if (
            window.confirm(
              'No connection to OpenVidu Server. This may be a certificate error at "' +
                APPLICATION_SERVER_URL +
                '"\n\nClick OK to navigate and accept it. If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                APPLICATION_SERVER_URL +
                '"'
            )
          ) {
            window.location.assign(APPLICATION_SERVER_URL + '/accept-certificate');
          }
        });
    });
  };

  const createToken = (sessionId) => {
    return new Promise((resolve, reject) => {
      let data = {};
  
      axios
        .post(
          `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connection`,
          data,
          {
            headers: {
              Authorization: `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_PASSWORD}`)}`,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res) => {
          resolve(res.data.token);
        })
        .catch((error) => reject(error));
    });
  };

  const handleChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ mr: 2 }} src={isEditing ? editData.image : profile.image} />
              <Typography variant="h5">{isEditing ? editData.name : profile.name}</Typography>
            </Box>
            {showEditButton && (
              <Button variant="outlined" color="primary" onClick={isEditing ? handleSave : handleEdit}>
                {isEditing ? "Save" : "Edit"}
              </Button>
            )}
            <Button variant="outlined" color="secondary" onClick={handleBroadcast}>
              방송하기
            </Button>
          </Box>
          <Divider sx={{ my: 2 }} />
          {isEditing ? (
            <>
              <TextField
                fullWidth
                label="Name"
                value={editData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={editData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
              />
              <TextField
                fullWidth
                label="Location"
                value={editData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
              <TextField
                fullWidth
                label="Site URL"
                value={editData.siteUrl}
                onChange={(e) => handleChange("siteUrl", e.target.value)}
              />
              <TextField
                fullWidth
                label="Image URL"
                value={editData.image}
                onChange={(e) => handleChange("image", e.target.value)}
              />
              <TextField
                fullWidth
                type="password"
                label="Password"
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </>
          ) : (
            <>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                임시 프로필 번호: {profile.shelterNo}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                연락처: {profile.phoneNumber}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                지역: {profile.location}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                사이트: {profile.siteUrl}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileCard;
