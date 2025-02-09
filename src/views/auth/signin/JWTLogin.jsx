import React, { useState } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from 'config/constant';
import backgroundImage1 from '../../../assets/images/user/img-avatar-1.jpg';
import backgroundImage2 from '../../../assets/4.png';

const JWTLogin = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);

  const handleLoginSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      const response = await axios.post(`${BASE_URL}api/admin/login`, values);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
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

  const handleSignupSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
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

  return (
    <div style={styles.container}>
      <div className="login-leftSection" style={styles.leftSection}>
        <img src="src/assets/images/logo.png" alt="Okiiee Logo" style={styles.logo} />
        <h1 style={{ color: 'black', textAlign: 'left' }}>Okiiee</h1>
        <h2 style={{ color: 'black', textAlign: 'left', fontSize: '28px', marginTop: '30px' }}>
          Contact Us:
        </h2>
        <div style={{ paddingLeft: '20px' }}>
          <p style={{ color: 'black', textAlign: 'left', marginTop: '20px', fontSize: '20px' }}>
            +92 305 7903867
          </p>
          <p style={{ color: 'black', textAlign: 'left', marginTop: '0px', fontSize: '20px' }}>
            +92 305 7903867
          </p>

          <div style={{ marginTop: '40px' }}>
            <h3>Vist Our Social</h3>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '30px' }}>
            <Button className="signin-btn px-2 py-2 social-icon" variant="primary">
              <i className="feather icon-twitter" style={{ fontSize: '20px' }} />
            </Button>
            <Button className="signin-btn px-2 py-2 social-icon" variant="primary">
              <i className="feather icon-instagram" style={{ fontSize: '20px' }} />
            </Button>
            <Button className="signin-btn px-2 py-2 social-icon" variant="primary">
              <i className="feather icon-facebook" style={{ fontSize: '20px' }} />
            </Button>
          </div>

        </div>
      </div>
      <div style={styles.rightSection}>
        <Formik
          initialValues={{
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            email: '',
            submit: null
          }}
          validationSchema={
            isSignup
              ? Yup.object().shape({
                firstName: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
                lastName: Yup.string().max(20, 'Must be 20 characters or less').required('Required'),
                email: Yup.string().email('Invalid email address').required('Required'),
                username: Yup.string().required('Username is required'),
                password: Yup.string().max(255).required('Password is required')
              })
              : Yup.object().shape({
                username: Yup.string().required('Username is required'),
                password: Yup.string().max(255).required('Password is required')
              })
          }
          onSubmit={isSignup ? handleSignupSubmit : handleLoginSubmit}
        >
          {({ errors, handleBlur, handleChange, isSubmitting, touched, values, handleSubmit }) => (
            <form noValidate onSubmit={handleSubmit} style={styles.form}>
              {/* {isSignup && (
                <>
                  <div className="form-group mb-3">
                    <input
                      className="form-control"
                      label="First Name"
                      name="firstName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.firstName}
                      placeholder="First Name"
                    />
                    {touched.firstName && errors.firstName && <small className="text-danger form-text">{errors.firstName}</small>}
                  </div>
                  <div className="form-group mb-3">
                    <input
                      className="form-control"
                      label="Last Name"
                      name="lastName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.lastName}
                      placeholder="Last Name"
                    />
                    {touched.lastName && errors.lastName && <small className="text-danger form-text">{errors.lastName}</small>}
                  </div>
                  <div className="form-group mb-4">
                    <input
                      className="form-control"
                      label="Email Address"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="email"
                      value={values.email}
                      placeholder="Email Address"
                    />
                    {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
                  </div>
                </>
              )} */}
              <div className="form-group mb-4">
                <label htmlFor="username" style={{ color: 'black', textAlign: 'left', display: 'block' }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-control loginForm-Field"
                    label="Username"
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.username}
                    placeholder="Username"
                  />
                  <i className="feather icon-user" style={{ position: 'absolute', left: '10px', top: '10px', fontSize: '20px' }} />
                </div>
                {touched.username && errors.username && <p className="text-danger form-text" style={{ textAlign: 'left' }}>{errors.username}</p>}
              </div>
              <div className="form-group mb-4">
                <label htmlFor="password" style={{ color: 'black', textAlign: 'left', display: 'block' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-control loginForm-Field"
                    label="Password"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.password}
                    placeholder="Password"
                  />
                  <i className="feather icon-lock" style={{ position: 'absolute', left: '10px', top: '10px', fontSize: '20px' }} />
                </div>
                {touched.password && errors.password && <p className="text-danger form-text" style={{ textAlign: 'left' }}>{errors.password}</p>}
              </div>

              {errors.submit && (
                <Col sm={12}>
                  <Alert>{errors.submit}</Alert>
                </Col>
              )}
              <Row>
                <Col>
                  <Button className="signin-btn px-3 py-2" type="submit" variant="primary">
                    {isSignup ? 'Sign Up' : 'Sign In'}
                  </Button>
                </Col>
              </Row>
              {/* <Row>
                <Col>
                  <Button className="signin-btn px-3 py-2" onClick={toggleForm} variant="primary">
                    {isSignup ? 'Already have an account? Login' : "Don't have an account? Signup"}
                  </Button>
                </Col>
              </Row> */}
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

// Styles object
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
    width: '100%'
  },
  leftSection: {
    flex: 1,
    backgroundImage: 'linear-gradient(to right, rgb(80, 181, 244), rgb(237 237 237))', // Apply the same gradient
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    flexDirection: 'column',
    padding: '30px',
    borderRadius: '10px 0 0 10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  logo: {
    width: '100px', // Adjust the size as needed
    height: 'auto',
    marginBottom: '20px', // Adds space below the logo
    textAlign: 'left',
    display: 'block'
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
    backgroundColor: '#f9f9f9' // light gray with 80% opacity
  },
  form: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: 'rgba(211, 211, 211, 0.8)', // light gray with 80% opacity
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden' // Prevent overflowing content
  }
  // logo: {
  //   width: '120px',
  //   marginBottom: '20px'
  // }
};

export default JWTLogin;
