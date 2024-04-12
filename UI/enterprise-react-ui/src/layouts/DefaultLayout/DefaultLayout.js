import PropTypes from 'prop-types';
import './DefaultLayout.css';
import Nav from '../Nav';

function DefaultLayout({ children }) {
    return (
        <div className="app">
            <main className="content">
                <Nav />
                {children}
            </main>
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
