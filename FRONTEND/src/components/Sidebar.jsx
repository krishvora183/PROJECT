import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ items = [] }) => {
  return (
    <aside className="sidebar">
      <ul>
        {items.map((item) => (
          <li key={item.path} className="sidebar-item">
            <Link to={item.path} className="sidebar-link">
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;