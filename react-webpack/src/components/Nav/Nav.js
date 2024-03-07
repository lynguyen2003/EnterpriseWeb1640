import React from 'react';
import { Link } from "react-router-dom";
import './Nav.css';
import { navbarItems } from '../../navbarItems'; 

function Nav() {
    return (
        <div className="row">
            <nav className="navbar navbar-expand-lg fixed-top navbar-scroll">
                <div className="col mt-2">
                    <a className="navbar-brand" href="#">
                        <img  src="https://cdn.haitrieu.com/wp-content/uploads/2022/12/Logo-Truong-Dai-hoc-Greenwich-Viet-Nam.png" height="60" alt=""
                        loading="lazy" />
                    </a>
                </div>
                <div className="col container collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {navbarItems.map((item, index) => ( 
                            <li key={index} className="nav-link">
                                <Link to={item.url} style={{color:"black"}}>
                                    <i className={item.icon}></i>
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col">
                    <Link to="/login">
                        <button type="button" className="btn btn-outline-primary">Login</button>
                    </Link>
                </div>
            </nav>
        </div>
    )
}

export default Nav;