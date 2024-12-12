// adminPageBackground.jsx
import React from 'react';
import './adminPageBackground.css';

const AdminPageBackground = ({ children }) => {
  return (
    <div className="app-layout">
      {children}
    </div>
  );
};

export default AdminPageBackground;
