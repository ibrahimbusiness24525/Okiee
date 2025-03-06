import React, { useEffect, useState } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from 'config/constant';
import backgroundImage2 from '../../../assets/4.png';
import { FaMobileAlt } from "react-icons/fa";
const JWTLogin = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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
      backgroundImage: 'linear-gradient(to right, rgb(80, 181, 244), rgb(237, 237, 237))',
      backgroundPosition: 'center',
      alignItems: "center",
      display: windowWidth < 768 ? "none" : "flex", // Hide on small screens
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
  
  const handleLoginSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      const response = await axios.post(`${BASE_URL}api/admin/login`, values, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      console.log("login data",response);
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
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div style={styles.container}>
        {/* <img src={MainLogo} alt="Okiiee Logo" style={styles.logo} /> */}
      <div className="login-leftSection" style={styles.leftSection}>
        <h1
  style={{
    display: "flex",
    alignItems: "center",
    color: "#000",
    textAlign: "left",
    fontSize: "2rem",
    fontWeight: "bold",
    letterSpacing: "1px",
    margin: "10px 0",
    marginBottom: "3rem",
    gap: "10px", // Adds spacing between the icon and text
  }}
>
  <FaMobileAlt style={{ fontSize: "2.5rem", color: "#007bff" }} /> Okiiee
</h1>

       <div style={{width:"100%",height:"100%",justifyContent:"space-between",display:"flex",flexDirection:"column"}}>
       <div>
       <h2 style={{ color: '#000', textAlign: 'start', fontSize: '28px', marginTop: '30px' }}>
          Contact Us:
        </h2>
        <div style={{ paddingLeft: '20px' }}>
          <p style={{ color: '#000', textAlign: 'left', marginTop: '20px', fontSize: '20px' }}>
             0305 7903867
          </p>
          <p style={{ color: '#000', textAlign: 'left', marginTop: '0px', fontSize: '20px' }}>
            0329 6181822
          </p>
          <p style={{ color: '#000', textAlign: 'left', marginTop: '0px', fontSize: '20px' }}>
            03090001316
          </p>

        </div>
       </div>
        <div>
        <div style={{ marginTop: '40px',}}>
            <h3 style={{color: '#000' }}>Vist Our Social</h3>
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

export default JWTLogin;
