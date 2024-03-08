import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <div className="footer ">
            <footer className="bg-dark footer">
                <div className="footer-top py-8">
                    <div className="container">
                        <div className="row gy-5">
                            <div className="col-lg-8 pe-xxl-10 ">
                                <div className="row gy-5 ">
                                    <div className="col-3 col-lg-3 ">
                                        <h5 className="text-white footer-title-01">Resources</h5>
                                        <ul className="list-unstyled footer-link-01 m-0">
                                            <li><a className="text-white text-opacity-75" href="#">Something 1</a></li>
                                            <li><a className="text-white text-opacity-75" href="#">Free marketing tools</a></li>
                                            <li><a className="text-white text-opacity-75" href="#">Memaybeo</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-3 col-lg-3">
                                        <h5 className="text-white footer-title-01">Social media</h5>
                                        <ul className="list-unstyled footer-link-01 m-0">
                                            <li><a className="text-white text-opacity-75" href="#">Marketing Library</a></li>
                                            <li><a className="text-white text-opacity-75" href="#">Free marketing tools</a></li>
                                            <li><a className="text-white text-opacity-75" href="#">Memaybeo</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-3 col-lg-3">
                                        <h5 className="text-white footer-title-01">Company</h5>
                                        <ul className="list-unstyled footer-link-01 m-0">
                                            <li><a className="text-white text-opacity-75" href="#">Marketing Library</a></li>
                                            <li><a className="text-white text-opacity-75" href="#">Free marketing tools</a></li>
                                            <li><a className="text-white text-opacity-75" href="#">Memaybeo</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-3 col-lg-3">
                                        <h5 className="text-white footer-title-01">Help</h5>
                                        <ul className="list-unstyled footer-link-01 m-0">
                                            <li><a className="text-white text-opacity-75" href="#">Marketing Library</a></li>
                                            <li><a className="text-white text-opacity-75" href="#">Free marketing tools</a></li>
                                            <li><a className="text-white text-opacity-75" href="#">Memaybeo</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>

  );
}

export default Footer;