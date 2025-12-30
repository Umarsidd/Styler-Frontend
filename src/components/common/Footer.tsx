import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h4>Styler</h4>
                    <p>Your premium salon booking platform</p>
                </div>
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <Link to="/salons">Find Salons</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/services">Services</Link>
                </div>
                <div className="footer-section">
                    <h4>Support</h4>
                    <Link to="/contact">Contact</Link>
                    <Link to="/faq">FAQ</Link>
                    <Link to="/privacy">Privacy Policy</Link>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Styler. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
