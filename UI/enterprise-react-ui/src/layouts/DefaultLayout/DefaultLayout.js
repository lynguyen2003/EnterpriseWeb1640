import PropTypes from 'prop-types';
import Nav from '../Nav';

function DefaultLayout({ children }) {
    return (
        <>
            <Nav />
            <div>{children}</div>
        </>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
