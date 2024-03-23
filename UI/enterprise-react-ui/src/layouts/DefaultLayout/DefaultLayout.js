import PropTypes from 'prop-types';
import './DefaultLayout.css';
import Nav from '../Nav';

function DefaultLayout({ children }) {
    return (
        <>
            <Nav />
            <div className="content">{children}</div>
        </>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
