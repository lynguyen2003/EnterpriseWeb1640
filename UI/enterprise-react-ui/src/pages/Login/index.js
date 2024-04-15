import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '~/feature/auth/authSlice';
import { useLoginMutation } from '~/feature/auth/authApiSlice';
import LoadingSpinner from '~/components/LoadingSpinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './Login.css';
import { Box, Typography } from '@mui/material';
const Login = () => {
    const userRef = useRef();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userData = await login({ email, password }).unwrap();
            const token = userData.token;
            dispatch(setCredentials({ token, email }));
            setEmail('');
            setPassword('');
            navigate('/');
            toast.success('Logged in successfully');
        } catch (err) {
            console.log('Error :' + err);
            setErrorMessage('Invalid email or password!');
            toast.error('Failed to log in');
        }
    };

    const handleUserInput = (e) => setEmail(e.target.value);

    const handlePwdInput = (e) => setPassword(e.target.value);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
            className="gradient-custom"
        >
            <Box
                sx={{
                    backgroundColor: '#fff',
                    width: '90%',
                    paddingY: '30px',
                    maxWidth: '500px',
                    borderRadius: '50px',
                }}
            >
                <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                        alt="logo"
                        src="https://cdn.haitrieu.com/wp-content/uploads/2022/12/Logo-Truong-Dai-hoc-Greenwich-Viet-Nam.png"
                        height="80"
                    />
                </Typography>
                <Typography
                    variant="h4"
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginY: 2 }}
                >
                    <strong>Login</strong>
                </Typography>
                <p className="mb-5 text-center text-danger">{errorMessage}</p>
                <form onSubmit={handleSubmit} className="px-4">
                    <div className="form-outline form-white mb-5 txt_field">
                        <input
                            type="text"
                            id="email"
                            className="form-control"
                            ref={userRef}
                            value={email}
                            onChange={handleUserInput}
                            autoComplete="off"
                            required
                        />
                        <label className="form-label" htmlFor="email">
                            Email
                        </label>
                    </div>

                    <div className="form-outline form-white mb-5 txt_field">
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            onChange={handlePwdInput}
                            value={password}
                            required
                        />
                        <label className="form-label" htmlFor="password">
                            Password
                        </label>
                    </div>

                    <p className="small mb-5 pb-lg-2 text-end pass ">
                        <a className="text-decoration-none" href="/forgot-password">
                            Forgot password?
                        </a>
                    </p>
                    <div className="d-flex justify-content-center">
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <button className="btn-signin btn btn-outline-light btn-lg px-5" type="submit">
                                Login
                            </button>
                        )}
                    </div>
                </form>
                <p className="mt-4 mb-8 text-center">
                    <i className="fa-regular fa-copyright"></i> Powered by{' '}
                    <u>
                        <a href="https://greenwich.edu.vn/" className="text-decoration-underline" target="#">
                            Greenwich Việt Nam{' '}
                        </a>
                    </u>
                </p>
            </Box>
            <ToastContainer />
        </Box>
    );
};
export default Login;
