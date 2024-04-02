import { useSelector } from 'react-redux';
import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes';
import { selectCurrentToken, selectIsAuthenticated } from './feature/auth/authSlice';
import { jwtDecode } from 'jwt-decode';

function PrivateRoute({ element, path, requiredRoles }) {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentToken = useSelector(selectCurrentToken);
    const userObject = currentToken ? jwtDecode(currentToken) : { role: null };

    const isAuthorized =
        requiredRoles === null || !requiredRoles || (isAuthenticated && requiredRoles.includes(userObject.role));

    return isAuthorized ? element : <Navigate to="/login" replace state={{ from: path }} />;
}

function App() {
    return (
        <Router>
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = route.layout;

                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}
                {privateRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = route.layout;

                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <PrivateRoute
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                    path={route.path}
                                    requiredRoles={route.requiredRoles}
                                />
                            }
                        />
                    );
                })}
            </Routes>
        </Router>
    );
}

export default App;
