import React from 'react';
import { MdEmail, MdPhone, MdLocationOn, MdSupportAgent } from 'react-icons/md';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#2c3e50',
      color: '#ffffff',
      padding: '40px 20px',
      marginTop: 'auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        gap: '60px',
        position: 'relative'
      }}>
        {/* Left Section - Company Info (stays at left edge) */}
        <div style={{ 
          flex: '0 0 auto',
          maxWidth: '400px'
        }}>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: 700,
            color: '#8b9cff',
            margin: '0 0 16px 0'
          }}>
            Gait-Pass
          </h3>
          <p style={{ 
            margin: '0 0 16px 0', 
            fontSize: '14px', 
            lineHeight: '1.6',
            color: '#cbd5e0'
          }}>
            Next-generation biometric ticketing system.
          </p>
          <p style={{ 
            margin: '0', 
            fontSize: '13px', 
            color: '#94a3b8' 
          }}>
            © 2025 Gait-Pass. All rights reserved.
          </p>
        </div>
        
        {/* Right Section - Contact Information (moved towards center) */}
        <div style={{ 
          flex: '0 0 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingRight: '80px' // ✅ Pushes content towards the center-left
        }}>
          <h4 style={{ 
            margin: '0 0 20px 0',
            fontSize: '18px', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#ffffff'
          }}>
            <MdSupportAgent size={22} />
            Contact Us
          </h4>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '14px'
          }}>
            {/* Email Link */}
            <a 
              href="mailto:support@gaitpass.com" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                color: '#cbd5e0',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#8b9cff';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#cbd5e0';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <MdEmail size={20} style={{ flexShrink: 0 }} />
              <span>support@gaitpass.com</span>
            </a>
            
            {/* Phone Link */}
            <a 
              href="tel:+911234567890" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                color: '#cbd5e0',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#8b9cff';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#cbd5e0';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <MdPhone size={20} style={{ flexShrink: 0 }} />
              <span>+91 123 456 7890</span>
            </a>

            {/* Support Info */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              fontSize: '14px',
              color: '#94a3b8'
            }}>
              <MdLocationOn size={20} style={{ flexShrink: 0 }} />
              <span>Available 24/7 for support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


// import React from 'react';
// import '../../styles/global.css';

// const Footer = () => {
//   return (
//     <footer className="footer">
//       <div className="footer-content">
//         <p>&copy; 2025 Gait-Pass. All rights reserved.</p>
//         <p>Facial & Gait Recognition Ticketing System</p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
