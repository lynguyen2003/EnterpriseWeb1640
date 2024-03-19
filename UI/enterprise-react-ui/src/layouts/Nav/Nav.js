import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { navbarItems } from './NavItems';
import './Nav.css';

function Nav() {
    const [clicked, setClicked] = useState(false);
    return (
        <nav className='NavbarItems'>
            <img className='navbar-logo' src="https://cdn.haitrieu.com/wp-content/uploads/2022/12/Logo-Truong-Dai-hoc-Greenwich-Viet-Nam.png"
                height="60"
                alt=""
                loading="lazy"
            />

            
            <ul className={clicked ? "nav-menu active" : "nav-menu"}>
                {navbarItems.map((item, index) => {
                    return (
                        <li key={index} >
                            <Link to={item.url} className={item.cName}>
                                <i className={item.icon}></i>
                                    {item.title}
                            </Link>
                        </li>
                    )
                })}
            </ul>
            <ul className='navbar-nav ms-auto'>
                <Link to="/login">
                    <button
                        type="button"
                        className="btn-login btn btn-outline-primary"
                    >
                        Login
                    </button>
                </Link>
            </ul>
            <div className='menu-icons'>
                <i className={clicked ? "fas fa-times" : "fas fa-bars"} onClick={() => setClicked(!clicked)}></i>
            </div>
        </nav>
        // <div className="container">
        //     <nav className="navbar navbar-expand-lg fixed-top navbar-scroll">
        //         <div className="col mt-2 mx-3">
        //             <Link>
        //                 <img
        //                     src="https://cdn.haitrieu.com/wp-content/uploads/2022/12/Logo-Truong-Dai-hoc-Greenwich-Viet-Nam.png"
        //                     height="60"
        //                     alt=""
        //                     loading="lazy"
        //                 />
        //             </Link>
        //         </div>
        //         <div className="col container collapse navbar-collapse">
        //             <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        //                 {navbarItems.map((item, index) => (
        //                     <li key={index} className="nav-link">
        //                         <Link to={item.url} style={{ color: 'black' }}>
        //                             <i className={item.icon}></i>
        //                             {item.title}
        //                         </Link>
        //                     </li>
        //                 ))}
        //             </ul>
        //         </div>
        //         <div className="col">
                    // <Link to="/login">
                    //     <button
                    //         type="button"
                    //         className="btn btn-outline-primary"
                    //     >
                    //         Login
                    //     </button>
                    // </Link>
        //         </div>
        //     </nav>
        // </div>
    );
}

export default Nav;
