import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setCredentials } from '~/feature/auth/authSlice';
import { useLoginMutation } from '~/feature/auth/authApiSlice';
import { privateRoutes } from '~/routes/routes';

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

            // Redirect to a private route upon successful login
            const navigateToPrivateRoute = () => {
                const privateRoute = privateRoutes.find(
                    (route) => route.isPrivate,
                );
                if (privateRoute) {
                    navigate(privateRoute.path);
                } else {
                    // If no private route is defined, redirect to home
                    navigate('/');
                }
            };

            navigateToPrivateRoute();
        } catch (err) {
            if (!err?.originalStatus) {
                // isLoading: true until timeout occurs
                setErrMsg('No Server Response');
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
        <h1>Loading...</h1>
    ) : (
        <section className="login">
            <p
                ref={errRef}
                className={errMsg ? 'errmsg' : 'offscreen'}
                aria-live="assertive"
            >
                {errMsg}
            </p>

            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    id="email"
                    ref={userRef}
                    value={email}
                    onChange={handleUserInput}
                    autoComplete="off"
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={handlePwdInput}
                    value={password}
                    required
                />
                <button>Sign In</button>
            </form>
        </section>
    );

    return content;
};
export default Login;
