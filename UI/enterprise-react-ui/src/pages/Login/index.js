import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '~/feature/auth/authSlice';
import { useLoginMutation } from '~/feature/auth/authApiSlice';

import './Login.css';

const Login = () => {
    const userRef = useRef();
    const errRef = useRef();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userData = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...userData, email }));
            setEmail('');
            setPassword('');
            navigate('/');
        } catch (err) {
            if (!err?.originalStatus) {
                // isLoading: true until timeout occurs
                alert('No Server Response');
            } else if (err.originalStatus === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.originalStatus === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    };

    const handleUserInput = (e) => setEmail(e.target.value);

    const handlePwdInput = (e) => setPassword(e.target.value);

    const content = isLoading ? (
        <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    ) : (
        <section className="login">
            <p
                ref={errRef}
                className={errMsg ? 'errmsg' : 'offscreen'}
                aria-live="assertive"
            >
                {errMsg}
            </p>
            <div>
                <div className="gradient-custom">
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
                                            <h2 className="fw-bold mb-3 text-center fs-1">
                                                Login
                                            </h2>
                                            <p className="mb-5 text-center">
                                                Please enter your login and
                                                password!
                                            </p>
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-outline form-white mb-5 txt_field">
                                                    <input
                                                        type="text"
                                                        id="email"
                                                        className=""
                                                        ref={userRef}
                                                        value={email}
                                                        onChange={
                                                            handleUserInput
                                                        }
                                                        autoComplete="off"
                                                        required
                                                    />
                                                    <label
                                                        className="form-label"
                                                        htmlFor="email"
                                                    >
                                                        Email
                                                    </label>
                                                </div>

                                                <div className="form-outline form-white mb-5 txt_field">
                                                    <input
                                                        type="password"
                                                        id="password"
                                                        className=""
                                                        onChange={
                                                            handlePwdInput
                                                        }
                                                        value={password}
                                                        required
                                                    />
                                                    <label
                                                        className="form-label"
                                                        htmlFor="password"
                                                    >
                                                        Password
                                                    </label>
                                                </div>

                                                <p className="small mb-5 pb-lg-2 text-end pass ">
                                                    <a className="" href="#!">
                                                        Forgot password?
                                                    </a>
                                                </p>
                                                <div className="d-flex justify-content-center">
                                                    <button
                                                        className="btn-signin btn btn-outline-light btn-lg px-5"
                                                        type="submit"
                                                    >
                                                        Login
                                                    </button>
                                                </div>
                                            </form>
                                        </div>

                                        <div>
                                            <p className="mb-0 text-center">
                                                <i class="fa-regular fa-copyright"></i>{' '}
                                                Powered by{' '}
                                                <u>
                                                    <a
                                                        href="https://greenwich.edu.vn/"
                                                        class="text-decoration-underline"
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
        </section>
    );

    return content;
};
export default Login;
