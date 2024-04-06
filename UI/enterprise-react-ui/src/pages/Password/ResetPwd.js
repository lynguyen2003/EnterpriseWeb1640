import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import LoadingSpinner from '~/components/LoadingSpinner';
import { ToastContainer, toast } from 'react-toastify';
import * as yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';
import { useResetPwdMutation } from '~/feature/auth/authApiSlice';

const ResetPwd = () => {
    const userRef = useRef();
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
                    })
                    .catch(() => {
                        toast.error('Failed to reset password');
                    });
            })
            .catch((err) => {
                toast.error(err.errors[0]);
            });
    };
    return (
        <section className="login">
            <div>
                <div className="vh-100 gradient-custom">
                    <div className="container h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                                <div className="card text-black m-2">
                                    <div className="card-body p-5">
                                        <div className="my-5 mt-1">
                                            <h1 className="imgLogin mt-1 mb-4">
                                                <img
                                                    alt="logo"
                                                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/12/Logo-Truong-Dai-hoc-Greenwich-Viet-Nam.png"
                                                    height="80"
                                                />
                                            </h1>
                                            <h2 className="fw-bold mb-3 text-center fs-1">Reset Password</h2>
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-outline form-white mb-5 txt_field">
                                                    <input
                                                        type="password"
                                                        id="password"
                                                        autoComplete="off"
                                                        required
                                                        ref={userRef}
                                                        onChange={(e) => {
                                                            setFormData({
                                                                ...formData,
                                                                password: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                    <label className="form-label">New Password</label>
                                                </div>

                                                <div className="form-outline form-white mb-5 txt_field">
                                                    <input
                                                        type="password"
                                                        id="confirmPassword"
                                                        ref={userRef}
                                                        onChange={(e) => {
                                                            setFormData({
                                                                ...formData,
                                                                confirmPassword: e.target.value,
                                                            });
                                                        }}
                                                        autoComplete="off"
                                                        required
                                                    />
                                                    <label className="form-label">Confirm Password</label>
                                                </div>

                                                <div className="d-flex justify-content-center">
                                                    {isLoading ? (
                                                        <LoadingSpinner />
                                                    ) : (
                                                        <button
                                                            className="btn-signin btn btn-outline-light btn-lg px-5"
                                                            type="submit"
                                                        >
                                                            Submit
                                                        </button>
                                                    )}
                                                </div>
                                            </form>
                                        </div>

                                        <div>
                                            <p className="mb-0 text-center">
                                                <i className="fa-regular fa-copyright"></i> Powered by{' '}
                                                <u>
                                                    <a
                                                        href="https://greenwich.edu.vn/"
                                                        className="text-decoration-underline"
                                                        target="#"
                                                    >
                                                        Greenwich Việt Nam{' '}
                                                    </a>
                                                </u>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </section>
    );
};

export default ResetPwd;
