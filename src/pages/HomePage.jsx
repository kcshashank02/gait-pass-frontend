import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MdTrain, MdSecurity, MdSpeed } from 'react-icons/md';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Gait-Pass</h1>
          <p className="hero-subtitle">
            Next-Generation Facial & Gait Recognition Ticketing System
          </p>
          <p className="hero-description">
            Experience seamless, contactless travel with our advanced biometric authentication system.
            No more tickets, no more queues - just walk through!
          </p>
          <div className="hero-buttons">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="btn btn-primary">Get Started</Link>
                <Link to="/login" className="btn btn-secondary">Login</Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            )}
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Why Choose Gait-Pass?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <MdSecurity />
            </div>
            <h3>Secure Authentication</h3>
            <p>Advanced facial and gait recognition technology ensures your identity is protected.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <MdSpeed />
            </div>
            <h3>Fast & Contactless</h3>
            <p>Walk through stations without stopping. Our system recognizes you instantly.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <MdTrain />
            </div>
            <h3>Smart Fare Calculation</h3>
            <p>Automatic fare deduction based on your journey. No more ticket confusion.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Transform Your Travel Experience?</h2>
        <p>Join thousands of users who have already made the switch to Gait-Pass</p>
        {!isAuthenticated && (
          <Link to="/register" className="btn btn-large btn-primary">Register Now</Link>
        )}
      </section>
    </div>
  );
};

export default HomePage;
