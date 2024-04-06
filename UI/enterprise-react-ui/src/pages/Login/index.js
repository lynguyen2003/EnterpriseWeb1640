import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '~/feature/auth/authSlice';
import { useLoginMutation } from '~/feature/auth/authApiSlice';
import LoadingSpinner from '~/components/LoadingSpinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './Login.css';
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
                                            <h2 className="fw-bold mb-3 text-center fs-1">Login</h2>
                                            <p className="mb-5 text-center">{errorMessage}</p>
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-outline form-white mb-5 txt_field">
                                                    <input
                                                        type="text"
                                                        id="email"
                                                        className=""
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
                                                        className=""
                                                        onChange={handlePwdInput}
                                                        value={password}
                                                        required
                                                    />
                                                    <label className="form-label" htmlFor="password">
                                                        Password
                                                    </label>
                                                </div>

                                                <p className="small mb-5 pb-lg-2 text-end pass ">
                                                    <a className="" href="/forgot-password">
                                                        Forgot password?
                                                    </a>
                                                </p>
                                                <div className="d-flex justify-content-center">
                                                    {isLoading ? (
                                                        <LoadingSpinner />
                                                    ) : (
                                                        <button
                                                            className="btn-signin btn btn-outline-light btn-lg px-5"
                                                            type="submit"
                                                        >
                                                            Login
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
export default Login;
