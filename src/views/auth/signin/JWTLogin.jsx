import React, { useEffect, useState } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from 'config/constant';
import backgroundImage2 from '../../../assets/4.png';
import { FaMobileAlt } from 'react-icons/fa';
import './JWTLogin.css';
import { FaEye, FaEyeSlash, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
const JWTLogin = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showPassword, setShowPassword] = useState(false);
  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      flexDirection: 'row',
      justifyContent: 'space-between',
      overflow: 'hidden', // Prevent scrolling
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '1200px',
      margin: 'auto',
      maxHeight: '600px',
      width: '100%',
    },
    leftSection: {
      flex: 1,
      backgroundImage:
        'linear-gradient(to right, rgb(80, 181, 244), rgb(237, 237, 237))',
      backgroundPosition: 'center',
      alignItems: 'center',
      display: windowWidth < 768 ? 'none' : 'flex', // Hide on small screens
      backgroundRepeat: 'no-repeat',
      flexDirection: 'column',
      padding: '30px',
      borderRadius: '10px 0 0 10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
    },
    logo: {
      width: '150px', // Adjust the size as needed
      height: 'auto',
      marginBottom: '20px', // Adds space below the logo
      textAlign: 'center',
      display: 'block',
    },
    rightSection: {
      flex: 2,
      backgroundImage: `url(${backgroundImage2})`, // Add your right section image path
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      borderRadius: '0px 10px 10px 0px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9', // light gray with 80% opacity
    },
    form: {
      width: '100%',
      maxWidth: '500px',
      backgroundColor: 'rgba(211, 211, 211, 0.8)', // light gray with 80% opacity
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden', // Prevent overflowing content
    },
    // logo: {
    //   width: '120px',
    //   marginBottom: '20px'
    // }
  };

  const handleLoginSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const response = await axios.post(`${BASE_URL}api/admin/login`, values, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        localStorage.setItem('token', response.data.token);

        setStatus({ success: true });
        setSubmitting(false);
        navigate('/');
      } else {
        setStatus({ success: false });
        setErrors({ submit: response.data.message });
        setSubmitting(false);
      }
    } catch (error) {
      setErrors({ submit: error.response.data.message });
      setSubmitting(false);
    }
  };

  const handleSignupSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const response = await axios.post(`${BASE_URL}api/admin/signup`, values); // Adjust the signup endpoint as necessary
      if (response.data) {
        alert('Signup successful! You can now log in.');
        setStatus({ success: true });
        setSubmitting(false);
        setIsSignup(false); // Switch to login form
      } else {
        setStatus({ success: false });
        setErrors({ submit: response.data.message });
        setSubmitting(false);
      }
    } catch (error) {
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className="login-advanced-bg">
      <div className="login-flex-container">
        <div className="login-contact-section">
          <div className="login-contact-title">Contact Us</div>
          <div className="login-contact-list">
            <div>0305 7903867</div>
            <div>0329 6181822</div>
            <div>0309 0001316</div>
          </div>
          <div className="login-contact-title" style={{marginTop: 18}}>Visit Our Social</div>
          <div className="login-contact-social">
            <button className="login-social-btn"><FaTwitter /></button>
            <button className="login-social-btn"><FaInstagram /></button>
            <button className="login-social-btn"><FaFacebook /></button>
          </div>
        </div>
        <div className="login-glass-card">
          <div className="login-logo-wrap">
            <img src={backgroundImage2} alt="Okiee Logo" className="login-logo-img" />
          </div>
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to manage your mobile shop finance and records</p>
          <Formik
            initialValues={{
              username: '',
              password: '',
              submit: null
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string().required('Username is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={handleLoginSubmit}
          >
            {({ errors, handleBlur, handleChange, isSubmitting, touched, values, handleSubmit }) => (
              <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
                <div className="login-input-group">
                  <i className="feather icon-user login-icon" />
                  <input
                    className="login-input"
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.username}
                    placeholder="Username"
                    autoFocus
                  />
                  {touched.username && errors.username && <div className="login-error">{errors.username}</div>}
                </div>
                <div className="login-input-group">
                  <i className="feather icon-lock login-icon" />
                  <input
                    className="login-input"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    placeholder="Password"
                  />
                  {showPassword ? (
                    <FaEyeSlash className="login-eye-icon" onClick={() => setShowPassword(false)} />
                  ) : (
                    <FaEye className="login-eye-icon" onClick={() => setShowPassword(true)} />
                  )}
                  {touched.password && errors.password && <div className="login-error">{errors.password}</div>}
                </div>
                {errors.submit && <div className="login-error">{errors.submit}</div>}
                <button type="submit" className="login-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            )}
          </Formik>
          <div className="login-footer">
            <span>Forgot password?</span>
            <span className="login-footer-divider">|</span>
            <span>Contact support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles object

export default JWTLogin;
