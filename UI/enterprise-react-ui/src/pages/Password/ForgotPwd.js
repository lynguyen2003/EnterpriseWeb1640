import LoadingSpinner from '~/components/LoadingSpinner';
import { useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForgotPwdMutation } from '~/feature/auth/authApiSlice';

import { Box, Typography } from '@mui/material';

const ForgotPwd = () => {
    const userRef = useRef();
    const [email, setEmail] = useState('');
    const [ForgotPwd, { isError }] = useForgotPwdMutation();

    const isLoading = false;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            toast.success('Please check your email to reset password');
            await ForgotPwd(email).unwrap();
            setEmail('');
        } catch (err) {
            if (isError) {
                toast.error('Email not found');
            }
        }
    };

    const handleUserInput = (e) => setEmail(e.target.value);

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
                    <strong>Forgot Password</strong>
                </Typography>
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

export default ForgotPwd;
