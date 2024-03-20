import PropTypes from 'prop-types';
import Nav from '../Nav';
import './DefaultLayout.css';

function DefaultLayout({ children }) {
    return (
        <div>
            <div className="container">
                <Nav className="test" />
                <div className="content">{children}</div>
            </div>
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
