import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import LoadingSpinner from '~/components/LoadingSpinner';
import { ToastContainer, toast } from 'react-toastify';
import * as yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';
import { useResetPwdMutation } from '~/feature/auth/authApiSlice';

import { Box, Typography } from '@mui/material';

const ResetPwd = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
        email: '',
        token: '',
    });
    const { token, email } = queryString.parse(location.search);
    const [resetPwd, { isLoading }] = useResetPwdMutation();

    useEffect(() => {
        setFormData((prev) => ({ ...prev, token, email }));
    }, [token, email]);

    const schema = yup.object().shape({
        password: yup
            .string()
            .required('Password is required')
            .min(8, 'Password is too short - should be 8 chars minimum'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Confirm password must match password'),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        schema
            .validate(formData)
            .then(() => {
                resetPwd({ ...formData })
                    .unwrap()
                    .then(() => {
                        toast.success('Password reset successfully');
                        navigate('/login');
                    });
            })
            .catch((err) => {
                toast.error(err.errors[0]);
            });
    };
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
                    <strong>Reset Password</strong>
                </Typography>
                <form onSubmit={handleSubmit} className="px-4">
                    <div className="form-outline form-white mb-5 txt_field">
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                            value={formData.password}
                            required
                        />
                        <label className="form-label" htmlFor="password">
                            Password
                        </label>
                    </div>
                    <div className="form-outline form-white mb-5 txt_field">
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                            value={formData.confirmPassword}
                            required
                        />
                        <label className="form-label" htmlFor="password">
                            Confirm Password
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

export default ResetPwd;
