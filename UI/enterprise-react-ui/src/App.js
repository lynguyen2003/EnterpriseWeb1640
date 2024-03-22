import { useSelector } from 'react-redux';
import { Fragment } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { DefaultLayout } from './layouts';
import { publicRoutes, privateRoutes } from './routes';
import { selectIsAuthenticated } from './feature/auth/authSlice';

function PrivateRoute({ element, path }) {
    const isAuthenticated = useSelector(selectIsAuthenticated);

    return isAuthenticated ? (
        element
    ) : (
        <Navigate to="/login" replace state={{ from: path }} />
    );
}

function App() {
    return (
        <Router>
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = DefaultLayout;

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
                    let Layout = DefaultLayout;

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
