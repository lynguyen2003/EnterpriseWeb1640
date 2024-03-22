import './Content.css';
import { Link } from 'react-router-dom';

function Content() {
    return (
        <div className="banner">
            <img
                className="img-fluid"
                alt="banner"
                src="https://images.unsplash.com/photo-1509470689623-172815263c57"
            />

            <div className="hero-text">
                <h1>Greenwich University</h1>
                <p>Choose Your Feature</p>

                <Link className="Join" to="">
                    Join Us
                </Link>
            </div>
        </div>
    );
}

export default Content;
