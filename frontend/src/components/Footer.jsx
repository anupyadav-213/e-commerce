import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style = {{
            backgroundColor: '#090909',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '40px 20px',
            marginTop: 'auto',
        }}>
            <div style = {{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '20px',
            }}>
                <div>
                    <h3 style={{ color: '#f97316', marginBottom: '10px' }}>Khazana Corner</h3>
                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>© 2026 Khazana Corner. All rights reserved.</p>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <Link to="/about" style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>About Us</Link>
                    <Link to="/return" style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Return Policy</Link>
                    <Link to="/disclaimer" style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Disclaimer</Link>
                </div>

                <div style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} Khazana Corner. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
