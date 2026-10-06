import React from 'react';
import { Link } from 'react-router-dom';
import { Building, ShieldCheck, HeartHandshake, PhoneCall, Mail, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <Link to="/" className="navbar-brand">
              <div className="brand-logo-icon">
                <Building size={20} color="#ffffff" />
              </div>
              <span className="brand-title">
                Renti<span className="brand-highlight">Fy</span>
              </span>
            </Link>
            <p className="footer-desc">
              Empowering students and working professionals to find verified, broker-free rental rooms with total transparency and ease.
            </p>
            <div className="footer-badges">
              <span className="badge badge-success"><ShieldCheck size={12} /> 100% Broker-Free</span>
              <span className="badge badge-primary"><HeartHandshake size={12} /> Verified Owners</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/rooms">Browse All Rooms</Link></li>
              <li><Link to="/about">About RentiFy</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/login">Owner & Seeker Login</Link></li>
            </ul>
          </div>

          {/* Top Rental Cities */}
          <div className="footer-col">
            <h4 className="footer-heading">Popular Hubs</h4>
            <ul className="footer-links">
              <li><Link to="/rooms?city=Pune">Rooms in Pune (Kothrud, Hinjewadi)</Link></li>
              <li><Link to="/rooms?city=Bengaluru">Rooms in Bengaluru (Koramangala, Hebbal)</Link></li>
              <li><Link to="/rooms?city=Hyderabad">Rooms in Hyderabad (Madhapur, Hitec City)</Link></li>
              <li><Link to="/rooms?city=Delhi+NCR">Rooms in Delhi NCR / Gurugram</Link></li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div className="footer-col">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-contact-list">
              <li>
                <Mail size={15} />
                <span>support@rentify.in</span>
              </li>
              <li>
                <PhoneCall size={15} />
                <span>+91 98765 43210</span>
              </li>
              <li>
                <MapPin size={15} />
                <span>MCA Academic Project, Pune, Maharashtra</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} RentiFy Room Rental Platform. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/admin/login" className="admin-portal-link">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
