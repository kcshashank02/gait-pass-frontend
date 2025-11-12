import React from 'react';
import { Link } from 'react-router-dom';
import { MdError } from 'react-icons/md';
import '../styles/global.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <MdError className="not-found-icon" />
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );
};

export default NotFoundPage;
