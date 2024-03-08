import React from 'react'
import Nav from './components/Nav/Nav';
import Feature from './components/Feature/Feature';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';
import Hero from './components/Hero/Hero';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={
                        <>
                            {/* <Nav />
                            <Hero />
                            <Feature />
                            <Footer /> */}
                            <Login />
                        </>
                    } />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
        
    )
}
export default App;