// import React, { useEffect, useState } from 'react';
// import { Row, Col, Alert, Button } from 'react-bootstrap';
// import * as Yup from 'yup';
// import { Formik } from 'formik';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { BASE_URL } from 'config/constant';
// import backgroundImage2 from '../../../assets/4.png';
// import { FaMobileAlt } from "react-icons/fa";
// const JWTLogin = () => {
//   const navigate = useNavigate();
//   const [isSignup, setIsSignup] = useState(false);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const styles = {
//     container: {
//       display: 'flex',
//       height: '100vh',
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       overflow: 'hidden', // Prevent scrolling
//       boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//       maxWidth: '1200px',
//       margin: 'auto',
//       maxHeight: '600px',
//       width: '100%'
//     },
//     leftSection: {
//       flex: 1,
//       backgroundImage: 'linear-gradient(to right, rgb(80, 181, 244), rgb(237, 237, 237))',
//       backgroundPosition: 'center',
//       alignItems: "center",
//       display: windowWidth < 768 ? "none" : "flex", // Hide on small screens
//       backgroundRepeat: 'no-repeat',
//       flexDirection: 'column',
//       padding: '30px',
//       borderRadius: '10px 0 0 10px',
//       boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//       backdropFilter: 'blur(10px)',
//     },
//     logo: {
//       width: '150px', // Adjust the size as needed
//       height: 'auto',
//       marginBottom: '20px', // Adds space below the logo
//       textAlign: 'center',
//       display: 'block'
//     },
//     rightSection: {
//       flex: 2,
//       backgroundImage: `url(${backgroundImage2})`, // Add your right section image path
//       backgroundPosition: 'center',
//       backgroundRepeat: 'no-repeat',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '40px',
//       borderRadius: '0px 10px 10px 0px',
//       boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//       backgroundColor: '#f9f9f9' // light gray with 80% opacity
//     },
//     form: {
//       width: '100%',
//       maxWidth: '500px',
//       backgroundColor: 'rgba(211, 211, 211, 0.8)', // light gray with 80% opacity
//       padding: '30px',
//       borderRadius: '10px',
//       boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//       overflow: 'hidden' // Prevent overflowing content
//     }
//     // logo: {
//     //   width: '120px',
//     //   marginBottom: '20px'
//     // }
//   };

//   const handleLoginSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
//     try {
//       const response = await axios.post(`${BASE_URL}api/admin/login`, values, {
//         headers: {
//           "Content-Type": "application/json",
//         }
//       });

//       if (response.data) {
//         localStorage.setItem('user', JSON.stringify(response.data.data));
//         localStorage.setItem('token', response.data.token);

//         setStatus({ success: true });
//         setSubmitting(false);
//         navigate('/');
//       } else {
//         setStatus({ success: false });
//         setErrors({ submit: response.data.message });
//         setSubmitting(false);
//       }
//     } catch (error) {
//       setErrors({ submit: error.response.data.message });
//       setSubmitting(false);
//     }
//   };

//   const handleSignupSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
//     try {
//       const response = await axios.post(`${BASE_URL}api/admin/signup`, values); // Adjust the signup endpoint as necessary
//       if (response.data) {
//         alert('Signup successful! You can now log in.');
//         setStatus({ success: true });
//         setSubmitting(false);
//         setIsSignup(false); // Switch to login form
//       } else {
//         setStatus({ success: false });
//         setErrors({ submit: response.data.message });
//         setSubmitting(false);
//       }
//     } catch (error) {
//       setErrors({ submit: error.message });
//       setSubmitting(false);
//     }
//   };

//   const toggleForm = () => {
//     setIsSignup(!isSignup);
//   };
//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return (
//     <div style={styles.container}>
//         {/* <img src={MainLogo} alt="Okiiee Logo" style={styles.logo} /> */}
//       <div className="login-leftSection" style={styles.leftSection}>
//         <h1
//   style={{
//     display: "flex",
//     alignItems: "center",
//     color: "#000",
//     textAlign: "left",
//     fontSize: "2rem",
//     fontWeight: "bold",
//     letterSpacing: "1px",
//     margin: "10px 0",
//     marginBottom: "3rem",
//     gap: "10px", // Adds spacing between the icon and text
//   }}
// >
//   <FaMobileAlt style={{ fontSize: "2.5rem", color: "#007bff" }} /> Okiiee
// </h1>

//        <div style={{width:"100%",height:"100%",justifyContent:"space-between",display:"flex",flexDirection:"column"}}>
//        <div>
//        <h2 style={{ color: '#000', textAlign: 'start', fontSize: '28px', marginTop: '30px' }}>
//           Contact Us:
//         </h2>
//         <div style={{ paddingLeft: '20px' }}>
//           <p style={{ color: '#000', textAlign: 'left', marginTop: '20px', fontSize: '20px' }}>
//              0305 7903867
//           </p>
//           <p style={{ color: '#000', textAlign: 'left', marginTop: '0px', fontSize: '20px' }}>
//             0329 6181822
//           </p>
//           <p style={{ color: '#000', textAlign: 'left', marginTop: '0px', fontSize: '20px' }}>
//             03090001316
//           </p>

//         </div>
//        </div>
//         <div>
//         <div style={{ marginTop: '40px',}}>
//             <h3 style={{color: '#000' }}>Vist Our Social</h3>
//           </div>

//           <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '30px' }}>
//             <Button className="signin-btn px-2 py-2 social-icon" variant="primary">
//               <i className="feather icon-twitter" style={{ fontSize: '20px' }} />
//             </Button>
//             <Button className="signin-btn px-2 py-2 social-icon" variant="primary">
//               <i className="feather icon-instagram" style={{ fontSize: '20px' }} />
//             </Button>
//             <Button className="signin-btn px-2 py-2 social-icon" variant="primary">
//               <i className="feather icon-facebook" style={{ fontSize: '20px' }} />
//             </Button>
//           </div>
//         </div>
//        </div>
//       </div>
//       <div style={styles.rightSection}>
//         <Formik
//           initialValues={{
//             username: '',
//             password: '',
//             firstName: '',
//             lastName: '',
//             email: '',
//             submit: null
//           }}
//           validationSchema={
//             isSignup
//               ? Yup.object().shape({
//                 firstName: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
//                 lastName: Yup.string().max(20, 'Must be 20 characters or less').required('Required'),
//                 email: Yup.string().email('Invalid email address').required('Required'),
//                 username: Yup.string().required('Username is required'),
//                 password: Yup.string().max(255).required('Password is required')
//               })
//               : Yup.object().shape({
//                 username: Yup.string().required('Username is required'),
//                 password: Yup.string().max(255).required('Password is required')
//               })
//           }
//           onSubmit={isSignup ? handleSignupSubmit : handleLoginSubmit}
//         >
//           {({ errors, handleBlur, handleChange, isSubmitting, touched, values, handleSubmit }) => (
//             <form noValidate onSubmit={handleSubmit} style={styles.form}>
//               {/* {isSignup && (
//                 <>
//                   <div className="form-group mb-3">
//                     <input
//                       className="form-control"
//                       label="First Name"
//                       name="firstName"
//                       onBlur={handleBlur}
//                       onChange={handleChange}
//                       type="text"
//                       value={values.firstName}
//                       placeholder="First Name"
//                     />
//                     {touched.firstName && errors.firstName && <small className="text-danger form-text">{errors.firstName}</small>}
//                   </div>
//                   <div className="form-group mb-3">
//                     <input
//                       className="form-control"
//                       label="Last Name"
//                       name="lastName"
//                       onBlur={handleBlur}
//                       onChange={handleChange}
//                       type="text"
//                       value={values.lastName}
//                       placeholder="Last Name"
//                     />
//                     {touched.lastName && errors.lastName && <small className="text-danger form-text">{errors.lastName}</small>}
//                   </div>
//                   <div className="form-group mb-4">
//                     <input
//                       className="form-control"
//                       label="Email Address"
//                       name="email"
//                       onBlur={handleBlur}
//                       onChange={handleChange}
//                       type="email"
//                       value={values.email}
//                       placeholder="Email Address"
//                     />
//                     {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
//                   </div>
//                 </>
//               )} */}
//               <div className="form-group mb-4">
//                 <label htmlFor="username" style={{ color: 'black', textAlign: 'left', display: 'block' }}>
//                   Username
//                 </label>
//                 <div style={{ position: 'relative' }}>
//                   <input
//                     className="form-control loginForm-Field"
//                     label="Username"
//                     name="username"
//                     onBlur={handleBlur}
//                     onChange={handleChange}
//                     type="text"
//                     value={values.username}
//                     placeholder="Username"
//                   />
//                   <i className="feather icon-user" style={{ position: 'absolute', left: '10px', top: '10px', fontSize: '20px' }} />
//                 </div>
//                 {touched.username && errors.username && <p className="text-danger form-text" style={{ textAlign: 'left' }}>{errors.username}</p>}
//               </div>
//               <div className="form-group mb-4">
//                 <label htmlFor="password" style={{ color: 'black', textAlign: 'left', display: 'block' }}>
//                   Password
//                 </label>
//                 <div style={{ position: 'relative' }}>
//                   <input
//                     className="form-control loginForm-Field"
//                     label="Password"
//                     name="password"
//                     onBlur={handleBlur}
//                     onChange={handleChange}
//                     type="password"
//                     value={values.password}
//                     placeholder="Password"
//                   />
//                   <i className="feather icon-lock" style={{ position: 'absolute', left: '10px', top: '10px', fontSize: '20px' }} />
//                 </div>
//                 {touched.password && errors.password && <p className="text-danger form-text" style={{ textAlign: 'left' }}>{errors.password}</p>}
//               </div>

//               {errors.submit && (
//                 <Col sm={12}>
//                   <Alert>{errors.submit}</Alert>
//                 </Col>
//               )}
//               <Row>
//                 <Col>
//                   <Button className="signin-btn px-3 py-2" type="submit" variant="primary">
//                     {isSignup ? 'Sign Up' : 'Sign In'}
//                   </Button>
//                 </Col>
//               </Row>
//               {/* <Row>
//                 <Col>
//                   <Button className="signin-btn px-3 py-2" onClick={toggleForm} variant="primary">
//                     {isSignup ? 'Already have an account? Login' : "Don't have an account? Signup"}
//                   </Button>
//                 </Col>
//               </Row> */}
//             </form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// // Styles object

// export default JWTLogin;
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from 'config/constant';
import backgroundImage2 from '../../../assets/4.png';
import {
  FaEye,
  FaEyeSlash,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaUser,
  FaLock,
  FaSpinner,
  FaPhone,
  FaHeart,
} from 'react-icons/fa';

const JWTLogin = () => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Enhanced validation schema
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must not exceed 50 characters')
      .required('Username is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(255, 'Password must not exceed 255 characters')
      .required('Password is required'),
  });

  const handleLoginSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}api/admin/login`, values, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        localStorage.setItem('token', response.data.token);
        setStatus({ success: true });
        setSubmitting(false);
        setIsLoading(false);
        navigate('/dashboard');
      } else {
        throw new Error(response.data?.message || 'Login failed');
      }
    } catch (error) {
      setIsLoading(false);
      setSubmitting(false);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Login failed';
        setErrors({ submit: errorMessage });
      } else if (error.request) {
        setErrors({ submit: 'Network error. Please check your connection.' });
      } else {
        setErrors({ submit: error.message || 'An unexpected error occurred' });
      }

      setStatus({ success: false });
    }
  };

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const keyframes = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes gradientShift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    @keyframes glow {
      0%, 100% {
        box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
      }
      50% {
        box-shadow: 0 0 40px rgba(139, 92, 246, 0.6);
      }
    }
  `;

  const styles = {
    container: {
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${backgroundImage2})`,
      backgroundPosition: 'center',
      backgroundSize: 'contain', // Remove the duplicate backgroundSize property
      backgroundRepeat: 'no-repeat',
      // Remove this line: backgroundSize: '400% 400%',
      animation: 'gradientShift 8s ease infinite',
      padding: '16px',
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden',
    },
    backgroundOrbs: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: 1,
    },
    orb: {
      position: 'absolute',
      borderRadius: '50%',
      background:
        'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3))',
      backdropFilter: 'blur(10px)',
      animation: 'float 6s ease-in-out infinite',
    },
    mainWrapper: {
      display: 'flex',
      flexDirection: windowWidth < 768 ? 'column' : 'row',
      width: '100%',
      maxWidth: windowWidth < 768 ? '400px' : '900px',
      maxHeight: windowWidth < 768 ? '90vh' : '600px',
      boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
      borderRadius: '20px',
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.3)',
      position: 'relative',
      zIndex: 2,
      animation: mounted ? 'fadeInUp 0.8s ease-out' : 'none',
    },
    leftSection: {
      flex: 1,
      background:
        'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 25%, #06b6d4 50%, #10b981 75%, #f59e0b 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 12s ease infinite',
      display: windowWidth < 768 ? 'none' : 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 30px',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
    },
    leftContent: {
      animation: mounted ? 'fadeInLeft 1s ease-out 0.3s both' : 'none',
      textAlign: 'center',
      position: 'relative',
      zIndex: 2,
    },
    rightSection: {
      flex: windowWidth < 768 ? 1 : 1.2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: windowWidth < 768 ? '30px 25px' : '40px 35px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      position: 'relative',
      animation: mounted ? 'fadeInRight 1s ease-out 0.5s both' : 'none',
    },
    logoContainer: {
      marginBottom: '20px',
      textAlign: 'center',
      animation: 'float 3s ease-in-out infinite',
    },
    logo: {
      width: '80px',
      height: '80px',
      borderRadius: '16px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
      objectFit: 'cover',
      border: '3px solid rgba(255,255,255,0.3)',
      animation: 'glow 2s ease-in-out infinite alternate',
    },
    title: {
      fontSize: windowWidth < 768 ? '24px' : '28px',
      fontWeight: '800',
      marginBottom: '8px',
      background:
        'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 25%, #06b6d4 50%, #10b981 75%, #f59e0b 100%)',
      backgroundSize: '400% 400%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textAlign: 'center',
      animation: 'gradientShift 8s ease infinite',
    },
    subtitle: {
      color: '#64748b',
      fontSize: '14px',
      marginBottom: '25px',
      textAlign: 'center',
      maxWidth: '300px',
      lineHeight: '1.5',
      fontWeight: '500',
    },
    form: {
      width: '100%',
      maxWidth: '320px',
    },
    inputGroup: {
      marginBottom: '18px',
      position: 'relative',
      animation: mounted ? 'fadeInUp 0.6s ease-out' : 'none',
    },
    input: {
      width: '100%',
      padding: '14px 14px 14px 45px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '15px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      fontFamily: 'inherit',
      fontWeight: '500',
      boxSizing: 'border-box',
    },
    inputIcon: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#8b5cf6',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      zIndex: 1,
    },
    eyeIcon: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#8b5cf6',
      fontSize: '26px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      padding: '4px',
      borderRadius: '50%',
      zIndex: 1,
    },
    submitButton: {
      width: '100%',
      padding: '14px',
      background:
        'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 25%, #06b6d4 50%, #10b981 75%, #f59e0b 100%)',
      backgroundSize: '400% 400%',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
      fontFamily: 'inherit',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      position: 'relative',
      overflow: 'hidden',
      animation: 'gradientShift 6s ease infinite',
    },
    errorMessage: {
      color: '#ef4444',
      fontSize: '12px',
      marginTop: '6px',
      fontWeight: '600',
      animation: 'fadeInUp 0.3s ease-out',
    },
    contactSection: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    contactTitle: {
      fontSize: '22px',
      color: '#ffffff',
      fontWeight: '800',
      marginBottom: '18px',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    contactList: {
      fontSize: '14px',
      lineHeight: '1.8',
      marginBottom: '20px',
      fontWeight: '500',
    },
    phoneNumber: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '6px',
      padding: '6px 12px',
      borderRadius: '10px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      fontSize: '13px',
    },
    socialContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      marginTop: '16px',
    },
    socialButton: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      borderRadius: '12px',
      padding: '10px',
      fontSize: '18px',
      color: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(15px)',
      position: 'relative',
      overflow: 'hidden',
    },
    footer: {
      marginTop: '20px',
      textAlign: 'center',
      color: '#64748b',
      fontSize: '12px',
      animation: mounted ? 'fadeInUp 1s ease-out 0.8s both' : 'none',
    },
    footerLink: {
      color: '#8b5cf6',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '600',
      position: 'relative',
    },
    loadingSpinner: {
      animation: 'spin 1s linear infinite',
    },
    connectTitle: {
      color: '#ffffff',
      fontSize: '18px',
      fontWeight: '700',
      marginBottom: '12px',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {/* Animated Background Orbs */}
        <div style={styles.backgroundOrbs}>
          <div
            style={{
              ...styles.orb,
              width: '200px',
              height: '200px',
              top: '-100px',
              left: '-100px',
              animationDelay: '0s',
            }}
          />
          <div
            style={{
              ...styles.orb,
              width: '150px',
              height: '150px',
              top: '50%',
              right: '-75px',
              animationDelay: '2s',
            }}
          />
          <div
            style={{
              ...styles.orb,
              width: '100px',
              height: '100px',
              bottom: '-50px',
              left: '30%',
              animationDelay: '4s',
            }}
          />
        </div>

        <div style={styles.mainWrapper}>
          {/* Left Section - Contact Info */}
          <div style={styles.leftSection}>
            <div style={styles.leftContent}>
              <div style={styles.contactSection}>
                <h2 style={styles.contactTitle}>Get In Touch</h2>
                <div style={styles.contactList}>
                  <div style={styles.phoneNumber}>
                    <FaPhone style={{ fontSize: '12px' }} />
                    <span>0305 7903867</span>
                  </div>
                  <div style={styles.phoneNumber}>
                    <FaPhone style={{ fontSize: '12px' }} />
                    <span>0329 6181822</span>
                  </div>
                  <div style={styles.phoneNumber}>
                    <FaPhone style={{ fontSize: '12px' }} />
                    <span>0309 0001316</span>
                  </div>
                </div>
                <h3 style={styles.connectTitle}>Connect With Us</h3>
                <div style={styles.socialContainer}>
                  <button
                    style={styles.socialButton}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px) scale(1.05)';
                      e.target.style.background = 'rgba(255,255,255,0.3)';
                      e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.background = 'rgba(255,255,255,0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <FaFacebook />
                  </button>
                  <button
                    style={styles.socialButton}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px) scale(1.05)';
                      e.target.style.background = 'rgba(255,255,255,0.3)';
                      e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.background = 'rgba(255,255,255,0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <FaInstagram />
                  </button>
                  <button
                    style={styles.socialButton}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px) scale(1.05)';
                      e.target.style.background = 'rgba(255,255,255,0.3)';
                      e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.background = 'rgba(255,255,255,0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <FaTwitter />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div style={styles.rightSection}>
            <div style={styles.logoContainer}>
              <div
                style={{
                  ...styles.logo,
                  background:
                    'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                👥
              </div>
            </div>

            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>
              Sign in to manage your mobile shop finance and records with ease
            </p>

            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleLoginSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                status,
              }) => (
                <form style={styles.form} onSubmit={handleSubmit}>
                  {status?.success && (
                    <div
                      style={{
                        ...styles.errorMessage,
                        marginBottom: '20px',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        textAlign: 'center',
                        color: '#16a34a',
                      }}
                    >
                      Login successful! Redirecting...
                    </div>
                  )}

                  {errors.submit && (
                    <div
                      style={{
                        ...styles.errorMessage,
                        marginBottom: '20px',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      {errors.submit}
                    </div>
                  )}

                  {/* Username Field */}
                  <div style={styles.inputGroup}>
                    <FaUser style={styles.inputIcon} />
                    <input
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      value={values.username}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        borderColor:
                          errors.username && touched.username
                            ? '#ef4444'
                            : '#e2e8f0',
                        boxShadow:
                          errors.username && touched.username
                            ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
                            : 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#8b5cf6';
                        e.target.style.boxShadow =
                          '0 0 0 3px rgba(139, 92, 246, 0.1)';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onBlur={(e) => {
                        handleBlur(e);
                        if (!errors.username) {
                          e.target.style.borderColor = '#e2e8f0';
                          e.target.style.boxShadow = 'none';
                        }
                        e.target.style.transform = 'translateY(0)';
                      }}
                    />
                    {errors.username && touched.username && (
                      <div style={styles.errorMessage}>{errors.username}</div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div style={styles.inputGroup}>
                    <FaLock style={styles.inputIcon} />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={values.password}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        paddingRight: '45px',
                        borderColor:
                          errors.password && touched.password
                            ? '#ef4444'
                            : '#e2e8f0',
                        boxShadow:
                          errors.password && touched.password
                            ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
                            : 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#8b5cf6';
                        e.target.style.boxShadow =
                          '0 0 0 3px rgba(139, 92, 246, 0.1)';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onBlur={(e) => {
                        handleBlur(e);
                        if (!errors.password) {
                          e.target.style.borderColor = '#e2e8f0';
                          e.target.style.boxShadow = 'none';
                        }
                        e.target.style.transform = 'translateY(0)';
                      }}
                    />
                    {showPassword ? (
                      <FaEyeSlash
                        style={styles.eyeIcon}
                        onClick={() => setShowPassword(false)}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#3b82f6';
                          e.target.style.background = 'rgba(139, 92, 246, 0.1)';
                          e.target.style.transform =
                            'translateY(-50%) scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#8b5cf6';
                          e.target.style.background = 'transparent';
                          e.target.style.transform =
                            'translateY(-50%) scale(1)';
                        }}
                      />
                    ) : (
                      <FaEye
                        style={styles.eyeIcon}
                        onClick={() => setShowPassword(true)}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#3b82f6';
                          e.target.style.background = 'rgba(139, 92, 246, 0.1)';
                          e.target.style.transform =
                            'translateY(-50%) scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#8b5cf6';
                          e.target.style.background = 'transparent';
                          e.target.style.transform =
                            'translateY(-50%) scale(1)';
                        }}
                      />
                    )}
                    {errors.password && touched.password && (
                      <div style={styles.errorMessage}>{errors.password}</div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      ...styles.submitButton,
                      opacity: isLoading ? 0.7 : 1,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.target.style.transform =
                          'translateY(-2px) scale(1.02)';
                        e.target.style.boxShadow =
                          '0 10px 30px rgba(139, 92, 246, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        e.target.style.transform = 'translateY(0) scale(1)';
                        e.target.style.boxShadow =
                          '0 8px 25px rgba(139, 92, 246, 0.4)';
                      }
                    }}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner style={styles.loadingSpinner} />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <FaSpinner style={{ fontSize: '12px' }} />
                        Sign In
                      </>
                    )}
                  </button>
                </form>
              )}
            </Formik>

            {/* Footer Links */}
            <div style={styles.footer}>
              <a
                href="#"
                style={styles.footerLink}
                onMouseEnter={(e) => {
                  e.target.style.color = '#3b82f6';
                  e.target.style.textDecoration = 'underline';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#8b5cf6';
                  e.target.style.textDecoration = 'none';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Forgot Password?
              </a>
              <span
                style={{ margin: '0 12px', color: '#cbd5e1', fontSize: '12px' }}
              >
                •
              </span>
              <a
                href="#"
                style={styles.footerLink}
                onMouseEnter={(e) => {
                  e.target.style.color = '#3b82f6';
                  e.target.style.textDecoration = 'underline';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#8b5cf6';
                  e.target.style.textDecoration = 'none';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JWTLogin;
