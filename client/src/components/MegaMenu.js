import React from 'react';
import { Link } from 'react-router-dom';

const MegaMenu = () => {
  return (
    <div className="mega-menu-container">
      <ul className="mega-menu">
        <li className="mega-menu-item">
          <Link className="mega-menu-link" to="#">Fiber Solutions</Link>
          <div className="mega-sub-menu">
            <ul>
              <li><Link className="mega-menu-link" to="#">Metro Ethernet</Link></li>
              <li><Link className="mega-menu-link" to="#">Wavelength Services</Link></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default MegaMenu;
