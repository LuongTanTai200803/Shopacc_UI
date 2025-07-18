// ProfileNavLink.jsx
import React from 'react';

export default function ProfileNavLink({ label, iconClass, tabName, activeTab, onClick }) {
  return (
    <li className="nav-item">
      <a
        className={`nav-link d-flex align-items-center py-2 px-3 mb-2 rounded ${activeTab === tabName ? 'active' : 'text-dark'}`}
        onClick={onClick}
        href="#" // Để tránh reload trang
        role="button"
      >
        <i className={`bi ${iconClass} me-2`}></i> {/* Icon */}
        {label}
      </a>
    </li>
  );
}