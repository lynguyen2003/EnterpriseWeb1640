import './Home.css';
import Footer from './components/Footer/Footer';
import Content from './components/Content/Content';
import { Box } from '@mui/material';

function Home() {
    return (
        <Box>
            <Content />
            <Footer />
        </Box>
    );
}

export default Home;
