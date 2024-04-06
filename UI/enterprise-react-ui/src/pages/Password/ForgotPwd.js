import LoadingSpinner from '~/components/LoadingSpinner';
import { useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForgotPwdMutation } from '~/feature/auth/authApiSlice';

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
                                            <p className="mb-5 text-center">Enter your email.</p>
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

export default ForgotPwd;
