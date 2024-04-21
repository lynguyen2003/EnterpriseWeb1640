import { Box, Typography } from '@mui/material';
import './Content.css';
import { Link } from 'react-router-dom';

function Content() {
    return (
        <Box>
            <Box
                sx={{
                    position: 'relative',
                    textAlign: 'center',
                    '& img': {
                        width: '100%',
                        height: '100vh',
                        objectFit: 'cover',
                    },
                    '& h1': {
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                    },
                    '& p': {
                        fontSize: '1.5rem',
                        marginBottom: '20px',
                    },
                    '& .Join': {
                        display: 'inline-block',
                        padding: '10px 20px',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                    },
                }}
            >
                <img
                    className="img-fluid"
                    alt="banner"
                    src="https://images.unsplash.com/photo-1509470689623-172815263c57"
                />

                <Typography
                    sx={{
                        color: '#2D3791',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1,
                    }}
                >
                    <h1>Greenwich University</h1>
                    <p>Choose Your Future</p>

                    <Link className="Join" to="">
                        Join Us
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}

export default Content;
