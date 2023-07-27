import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, TextField, Button, Avatar, Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { setPassword as setReduxPassword, login } from '../../stores/Slices/UserSlice';

export default function Login() {
    const [id, setId] = useState(''); // ID 상태
    const [password, setPassword] = useState(''); // 비밀번호 상태
    const dispatch = useDispatch(); // Redux dispatch 사용
    const user = useSelector(state => state.user);

    useEffect(() => {
        console.log(user);
    }, [user]);

    const handleSubmit = (event) => {
        event.preventDefault();

        // 인증 로직
        if (password === '123123') {
            dispatch(setReduxPassword(password)); // 비밀번호 설정
            dispatch(login({
                nickname: id,
                points: 0
            })); // 로그인 상태로 설정
            console.log(user)
        } else {
            console.log('로그인 실패');
        }
    };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
            <Grid item xs={11} md={4}>
                <Paper elevation={3} style={{ padding: '20px' }}>
                    <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
                        <Avatar style={{backgroundColor: 'transparent'}}>
							<img src="/puppy_icon.ico" alt="puppy icon" style={{ width: '100%', height: 'auto' }} />
                            {/* <LockOutlinedIcon /> */}
                        </Avatar>
                        <Typography variant="h5" style={{ marginTop: '12px' }}>Login</Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="ID"
                            variant="outlined"
                            margin="normal"
                            value={id}
                            onChange={e => setId(e.target.value)}
                            InputProps={{
                                startAdornment: <LockOutlinedIcon />
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: <LockOutlinedIcon />
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{ marginTop: '15px' }}
                        >
                            로그인
                        </Button>
                    </form>

                    <Button
                        variant="text"
                        color="primary"
                        fullWidth
                        style={{ marginTop: '10px' }}
                        // 회원가입 모달을 여는 함수나 회원가입 페이지로 이동하는 로직을 여기에 넣으세요.
                    >
                        회원가입
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    )
}


// import React, { useEffect } from 'react';
// // import axios from 'axios';
// import { useNavigate } from 'react-router';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
// import Paper from '@mui/material/Paper';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Typography from '@mui/material/Typography';
// import { createTheme, ThemeProvider } from '@mui/material/styles';

// import {useDispatch, useSelector } from 'react-redux'
// import {login, setPassword} from '../../stores/Slices/UserSlice'

// function Copyright(props) {
// 	return (
// 		<Typography
// 			variant="body2"
// 			color="text.secondary"
// 			align="center"
// 			{...props}
// 		>
// 			{'Copyright © '}
// 			<Link color="inherit" href="https://mui.com/">
// 				Your Website
// 			</Link>{' '}
// 			{new Date().getFullYear()}
// 			{'.'}
// 		</Typography>
// 	);
// }

// const defaultTheme = createTheme();

// export default function SignInSide() {
// 	const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const user = useSelector(state => state.user)
//     useEffect(() => {
//         console.log(user);
//     }, [user]);

// 	const handleSubmit = async (event) => {
// 		event.preventDefault();
// 		const data = new FormData(event.currentTarget);
// 		const email = data.get('email');
// 		const password = data.get('password');
        
//         // Authentication
//         if (password === '123123') {
//             dispatch(setPassword(password)); // password 설정
//             dispatch(login({
//             //   avatarUrl: 'https://www.urbanbrush.net/web/wp-content/uploads/edd/2019/01/urbanbrush-20190108131811238895.png',
//               nickname: email,
//               points: 0
//             })); // 로그인 상태로 설정
//             // history.push 는 react router v6 에서 더이상 사용하지 않는 문법
//             navigate('/'); // Home으로 이동
//             console.log(user)
//           } else {
//             console.log('Login failed');
//           }

// 		// try {
// 		// 	const response = await axios.post('/api/login', { email, password });

// 		// 	if (response.status === 200) {
// 		// 		history.push('/dashboard');
// 		// 	} else {
// 		// 		console.log('Login failed');
// 		// 	}
// 		// } catch (error) {
// 		// 	console.error('Error occurred during login:', error);
// 		// }
// 	};

// 	return (
// 		<ThemeProvider theme={defaultTheme}>
// 			<Grid container component="main" sx={{ height: '100vh' }}>
// 				<CssBaseline />
// 				<Grid
// 					item
// 					xs={false}
// 					sm={4}
// 					md={7}
// 					sx={{
// 						backgroundImage:
// 							'url(https://source.unsplash.com/random?wallpapers)',
// 						backgroundRepeat: 'no-repeat',
// 						backgroundColor: (t) =>
// 							t.palette.mode === 'light'
// 								? t.palette.grey[50]
// 								: t.palette.grey[900],
// 						backgroundSize: 'cover',
// 						backgroundPosition: 'center',
// 					}}
// 				/>
// 				<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
// 					<Box
// 						sx={{
// 							my: 8,
// 							mx: 4,
// 							display: 'flex',
// 							flexDirection: 'column',
// 							alignItems: 'center',
// 						}}
// 					>
// 						<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
// 							<LockOutlinedIcon />
// 						</Avatar>
// 						<Typography component="h1" variant="h5">
// 							Sign in
// 						</Typography>
// 						<Box
// 							component="form"
// 							noValidate
// 							onSubmit={handleSubmit}
// 							sx={{ mt: 1 }}
// 						>
// 							<TextField
// 								margin="normal"
// 								required
// 								fullWidth
// 								id="email"
// 								label="Email Address"
// 								name="email"
// 								autoComplete="email"
// 								autoFocus
// 							/>
// 							<TextField
// 								margin="normal"
// 								required
// 								fullWidth
// 								name="password"
// 								label="Password"
// 								type="password"
// 								id="password"
// 								autoComplete="current-password"
// 							/>
// 							<FormControlLabel
// 								control={<Checkbox value="remember" color="primary" />}
// 								label="Remember me"
// 							/>
// 							<Button
// 								type="submit"
// 								fullWidth
// 								variant="contained"
// 								sx={{ mt: 3, mb: 2 }}
// 							>
// 								Sign In
// 							</Button>
// 							<Grid container>
// 								<Grid item xs>
// 									<Link href="/forgot-password" variant="body2">
// 										Forgot password?
// 									</Link>
// 								</Grid>
// 								<Grid item>
// 									<Link href="/sign-up" variant="body2">
// 										{"Don't have an account? Sign Up"}
// 									</Link>
// 								</Grid>
// 							</Grid>
// 							<Copyright sx={{ mt: 5 }} />
// 						</Box>
// 					</Box>
// 				</Grid>
// 			</Grid>
// 		</ThemeProvider>
// 	);
// }
