// import React, { useEffect, useState } from 'react';
// import { Card, ListGroup, Dropdown } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import PerfectScrollbar from 'react-perfect-scrollbar';
// import ChatList from './ChatList';
// import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
// import avatar2 from '../../../../assets/images/user/avatar-2.jpg';
// import avatar3 from '../../../../assets/images/user/avatar-3.jpg';
// import avatar4 from '../../../../assets/images/user/avatar-4.jpg';

// const NavRight = () => {
//   const [listOpen, setListOpen] = useState(false);
//   const [LoginUser, setLoginUser] = useState({});

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user') // Clears all items from localStorage
//     navigate('/login');
// };

// useEffect(() => {
//   const user = localStorage.getItem('user'); // Retrieve 'user' from localStorage
//   if (user) {
//     setLoginUser(JSON.parse(user)); // Parse the JSON string and set the state
//   }
// }, []);

//   const notiData = [
//     {
//       name: 'Joseph William',
//       image: avatar2,
//       details: 'Purchase New Theme and make payment',
//       activity: '30 min'
//     },
//     {
//       name: 'Sara Soudein',
//       image: avatar3,
//       details: 'currently login',
//       activity: '30 min'
//     },
//     {
//       name: 'Suzen',
//       image: avatar4,
//       details: 'Purchase New Theme and make payment',
//       activity: 'yesterday'
//     }
//   ];

//   return (
//     <React.Fragment>
//       <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
//         <ListGroup.Item as="li" bsPrefix=" ">
//           {/* <Dropdown align="end">
//             <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
//               <i className="feather icon-bell icon" />
//             </Dropdown.Toggle>
//             <Dropdown.Menu align="end" className="notification notification-scroll">
//               <div className="noti-head">
//                 <h6 className="d-inline-block m-b-0">Notifications</h6>
//                 <div className="float-end">
//                   <Link to="#" className="me-2">
//                     mark as read
//                   </Link>
//                   <Link to="#">clear all</Link>
//                 </div>
//               </div>
//               <PerfectScrollbar>
//                 <ListGroup as="ul" bsPrefix=" " variant="flush" className="noti-body">
//                   <ListGroup.Item as="li" bsPrefix=" " className="n-title">
//                     <p className="m-b-0">NEW</p>
//                   </ListGroup.Item>
//                   <ListGroup.Item as="li" bsPrefix=" " className="notification">
//                     <Card
//                       className="d-flex align-items-center shadow-none mb-0 p-0"
//                       style={{ flexDirection: 'row', backgroundColor: 'unset' }}
//                     >
//                       <img className="img-radius" src={avatar1} alt="Generic placeholder" />
//                       <Card.Body className="p-0">
//                         <p>
//                           <strong>{LoginUser?.name || 'Guest'}!</strong>
//                           <span className="n-time text-muted">
//                             <i className="icon feather icon-clock me-2" />
//                             30 min
//                           </span>
//                         </p>
//                         <p>New ticket Added</p>
//                       </Card.Body>
//                     </Card>
//                   </ListGroup.Item>
//                   <ListGroup.Item as="li" bsPrefix=" " className="n-title">
//                     <p className="m-b-0">EARLIER</p>
//                   </ListGroup.Item>
//                   {notiData.map((data, index) => {
//                     return (
//                       <ListGroup.Item key={index} as="li" bsPrefix=" " className="notification">
//                         <Card
//                           className="d-flex align-items-center shadow-none mb-0 p-0"
//                           style={{ flexDirection: 'row', backgroundColor: 'unset' }}
//                         >
//                           <img className="img-radius" src={data.image} alt="Generic placeholder" />
//                           <Card.Body className="p-0">
//                             <p>
//                               <strong>{data.name}</strong>
//                               <span className="n-time text-muted">
//                                 <i className="icon feather icon-clock me-2" />
//                                 {data.activity}
//                               </span>
//                             </p>
//                             <p>{data.details}</p>
//                           </Card.Body>
//                         </Card>
//                       </ListGroup.Item>
//                     );
//                   })}
//                 </ListGroup>
//               </PerfectScrollbar>
//               <div className="noti-footer">
//                 <Link to="#">show all</Link>
//               </div>
//             </Dropdown.Menu>
//           </Dropdown> */}
//         </ListGroup.Item>
//         {/* <ListGroup.Item as="li" bsPrefix=" ">
//           <Dropdown>
//             <Dropdown.Toggle as={Link} variant="link" to="#" className="displayChatbox" onClick={() => setListOpen(true)}>
//               <i className="icon feather icon-mail" />
//             </Dropdown.Toggle>
//           </Dropdown>
//         </ListGroup.Item> */}
//         {/* <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
//         <button className="btn btn-primary" style={style.addNewPhoneBtn}>
//         Contact Us: 03057903867
//           </button>
//         </ListGroup.Item> */}
//         <ListGroup.Item as="li" bsPrefix=" ">
//           <Dropdown align={'end'} className="drp-user">
//             <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
//               <i className="icon feather icon-settings" />
//             </Dropdown.Toggle>
//             <Dropdown.Menu align="end" className="profile-notification">
//               <div className="pro-head">
//                 <img src={avatar2} className="img-radius" alt="User Profile" />
//                 <span>{LoginUser.username}</span>
//                 <Link to="#" className="dud-logout" title="Logout" onClick={logout}>
//                   <i className="feather icon-log-out" />
//                 </Link>
//               </div>
//               <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
//                 <ListGroup.Item as="li" bsPrefix=" ">
//                   <Link to="/setup/shop" className="dropdown-item">
//                     <i className="feather icon-settings" /> My Shop
//                   </Link>
//                 </ListGroup.Item>
//                 <ListGroup.Item as="li" bsPrefix=" ">
//                   <Link to="/help/forsupport" className="dropdown-item">
//                     <i className="feather icon-user" /> For Support
//                   </Link>
//                 </ListGroup.Item>

//               </ListGroup>
//             </Dropdown.Menu>
//           </Dropdown>
//         </ListGroup.Item>
//       </ListGroup>
//       <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
//     </React.Fragment>
//   );
// };

// const style = {
//   addNewPhoneBtn: {
//     background: 'linear-gradient(to right, #50b5f4, #b8bee2)',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '25px',
//     padding: '10px 20px',
//     cursor: 'pointer'
//   }
// };

// export default NavRight;
// import React, { useEffect, useState } from 'react';
// import { Card, ListGroup, Dropdown } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import PerfectScrollbar from 'react-perfect-scrollbar';
// import ChatList from './ChatList';
// import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
// import avatar2 from '../../../../assets/images/user/avatar-2.jpg';
// import avatar3 from '../../../../assets/images/user/avatar-3.jpg';
// import avatar4 from '../../../../assets/images/user/avatar-4.jpg';

// const NavRight = () => {
//   const [listOpen, setListOpen] = useState(false);
//   const [LoginUser, setLoginUser] = useState({});

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user') // Clears all items from localStorage
//     navigate('/login');
// };

// useEffect(() => {
//   const user = localStorage.getItem('user'); // Retrieve 'user' from localStorage
//   if (user) {
//     setLoginUser(JSON.parse(user)); // Parse the JSON string and set the state
//   }
// }, []);

//   const notiData = [
//     {
//       name: 'Joseph William',
//       image: avatar2,
//       details: 'Purchase New Theme and make payment',
//       activity: '30 min'
//     },
//     {
//       name: 'Sara Soudein',
//       image: avatar3,
//       details: 'currently login',
//       activity: '30 min'
//     },
//     {
//       name: 'Suzen',
//       image: avatar4,
//       details: 'Purchase New Theme and make payment',
//       activity: 'yesterday'
//     }
//   ];

//   return (
//     <React.Fragment>
//       <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
//         <ListGroup.Item as="li" bsPrefix=" ">
//           {/* <Dropdown align="end">
//             <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
//               <i className="feather icon-bell icon" />
//             </Dropdown.Toggle>
//             <Dropdown.Menu align="end" className="notification notification-scroll">
//               <div className="noti-head">
//                 <h6 className="d-inline-block m-b-0">Notifications</h6>
//                 <div className="float-end">
//                   <Link to="#" className="me-2">
//                     mark as read
//                   </Link>
//                   <Link to="#">clear all</Link>
//                 </div>
//               </div>
//               <PerfectScrollbar>
//                 <ListGroup as="ul" bsPrefix=" " variant="flush" className="noti-body">
//                   <ListGroup.Item as="li" bsPrefix=" " className="n-title">
//                     <p className="m-b-0">NEW</p>
//                   </ListGroup.Item>
//                   <ListGroup.Item as="li" bsPrefix=" " className="notification">
//                     <Card
//                       className="d-flex align-items-center shadow-none mb-0 p-0"
//                       style={{ flexDirection: 'row', backgroundColor: 'unset' }}
//                     >
//                       <img className="img-radius" src={avatar1} alt="Generic placeholder" />
//                       <Card.Body className="p-0">
//                         <p>
//                           <strong>{LoginUser?.name || 'Guest'}!</strong>
//                           <span className="n-time text-muted">
//                             <i className="icon feather icon-clock me-2" />
//                             30 min
//                           </span>
//                         </p>
//                         <p>New ticket Added</p>
//                       </Card.Body>
//                     </Card>
//                   </ListGroup.Item>
//                   <ListGroup.Item as="li" bsPrefix=" " className="n-title">
//                     <p className="m-b-0">EARLIER</p>
//                   </ListGroup.Item>
//                   {notiData.map((data, index) => {
//                     return (
//                       <ListGroup.Item key={index} as="li" bsPrefix=" " className="notification">
//                         <Card
//                           className="d-flex align-items-center shadow-none mb-0 p-0"
//                           style={{ flexDirection: 'row', backgroundColor: 'unset' }}
//                         >
//                           <img className="img-radius" src={data.image} alt="Generic placeholder" />
//                           <Card.Body className="p-0">
//                             <p>
//                               <strong>{data.name}</strong>
//                               <span className="n-time text-muted">
//                                 <i className="icon feather icon-clock me-2" />
//                                 {data.activity}
//                               </span>
//                             </p>
//                             <p>{data.details}</p>
//                           </Card.Body>
//                         </Card>
//                       </ListGroup.Item>
//                     );
//                   })}
//                 </ListGroup>
//               </PerfectScrollbar>
//               <div className="noti-footer">
//                 <Link to="#">show all</Link>
//               </div>
//             </Dropdown.Menu>
//           </Dropdown> */}
//         </ListGroup.Item>
//         {/* <ListGroup.Item as="li" bsPrefix=" ">
//           <Dropdown>
//             <Dropdown.Toggle as={Link} variant="link" to="#" className="displayChatbox" onClick={() => setListOpen(true)}>
//               <i className="icon feather icon-mail" />
//             </Dropdown.Toggle>
//           </Dropdown>
//         </ListGroup.Item> */}
//         {/* <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
//         <button className="btn btn-primary" style={style.addNewPhoneBtn}>
//         Contact Us: 03057903867
//           </button>
//         </ListGroup.Item> */}
//         <ListGroup.Item as="li" bsPrefix=" ">
//           <Dropdown align={'end'} className="drp-user">
//             <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
//               <i className="icon feather icon-settings" />
//             </Dropdown.Toggle>
//             <Dropdown.Menu align="end" className="profile-notification">
//               <div className="pro-head">
//                 <img src={avatar2} className="img-radius" alt="User Profile" />
//                 <span>{LoginUser.username}</span>
//                 <Link to="#" className="dud-logout" title="Logout" onClick={logout}>
//                   <i className="feather icon-log-out" />
//                 </Link>
//               </div>
//               <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
//                 <ListGroup.Item as="li" bsPrefix=" ">
//                   <Link to="/setup/shop" className="dropdown-item">
//                     <i className="feather icon-settings" /> My Shop
//                   </Link>
//                 </ListGroup.Item>
//                 <ListGroup.Item as="li" bsPrefix=" ">
//                   <Link to="/help/forsupport" className="dropdown-item">
//                     <i className="feather icon-user" /> For Support
//                   </Link>
//                 </ListGroup.Item>

//               </ListGroup>
//             </Dropdown.Menu>
//           </Dropdown>
//         </ListGroup.Item>
//       </ListGroup>
//       <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
//     </React.Fragment>
//   );
// };

// const style = {
//   addNewPhoneBtn: {
//     background: 'linear-gradient(to right, #50b5f4, #b8bee2)',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '25px',
//     padding: '10px 20px',
//     cursor: 'pointer'
//   }
// };

// export default NavRight;
import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Dropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ChatList from './ChatList';
import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../../../assets/images/user/avatar-3.jpg';
import avatar4 from '../../../../assets/images/user/avatar-4.jpg';
import Modal from 'components/Modal/Modal';
import { toast } from 'react-toastify';
import { api } from '../../../../../api/api';

const NavRight = () => {
  const [listOpen, setListOpen] = useState(false);
  const [loginUser, setLoginUser] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
  const [password, setPassword] = useState({
    previousPassword: '',
    newPassword: '',
  });
  const editPassword = () => {
    setShowEditPasswordModal(true);
  };

  const handleConfirmEditPassword = async () => {
    try {
      const response = await api.patch('/api/password/edit', {
        previousPassword: password.previousPassword,
        newPassword: password.newPassword,
      });
      if (response) {
        toast.success('Password edited successfully');
        setPassword({
          previousPassword: '',
          newPassword: '',
        });
        setShowEditPasswordModal(false);
      }
    } catch (error) {
      console.error('Error editing password:', error);
      toast.error(
        error.response.data.message ||
          error.message ||
          error.data.message ||
          'Error editing password'
      );
    }
  };
  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setLoginUser(JSON.parse(user));
    }

    // Mock notifications data - replace with your actual data
    const mockNotifications = [
      {
        id: 1,
        personName: 'Joseph William',
        image: avatar2,
        description: 'Purchase New Theme and make payment',
        status: true,
        time: '30 min ago',
      },
      {
        id: 2,
        personName: 'Sara Soudein',
        image: avatar3,
        description: 'currently login',
        status: false,
        time: '1 hour ago',
      },
      {
        id: 3,
        personName: 'Suzen',
        image: avatar4,
        description: 'Purchase New Theme and make payment',
        status: true,
        time: 'yesterday',
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.status).length);
  }, []);
  useEffect(() => {}, []);
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, status: true }
          : notification
      )
    );
    setUnreadCount(unreadCount - 1);
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        status: true,
      }))
    );
    setUnreadCount(0);
  };

  return (
    <React.Fragment>
      <style>{`
        .navbar-right-container {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .stock-list-item {
          display: flex;
          align-items: center;
        }
        .stock-list-btn-mobile {
          background: linear-gradient(to right, #FFA726, #FB8C00);
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          width: 200px;
          height: 50px;
          transition: background 0.3s ease;
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .stock-list-btn-mobile:hover {
          background: linear-gradient(to right, #F57C00, #EF6C00);
        }
        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          font-size: 10px;
        }
        .drp-notification .dropdown-toggle {
          position: relative;
        }
        .notification-dropdown {
          width: 350px;
          padding: 0;
        }
        .noti-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #f1f1f1;
        }
        .noti-body {
          max-height: 300px;
          overflow-y: auto;
        }
        .noti-footer {
          text-align: center;
          padding: 10px;
          border-top: 1px solid #f1f1f1;
        }
        .unread {
          background-color: #f8f9fa;
        }
        .status-indicator {
          margin-left: 10px;
        }
        .status-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        /* Enhanced Modal Styles */
        .enhanced-modal .modal-dialog {
          max-width: 600px;
        }
        .modal-title-enhanced {
          font-size: 24px !important;
          font-weight: 700 !important;
          color: #1f2937 !important;
          margin: 0 !important;
        }
        .modal-body-enhanced {
          padding: 30px !important;
        }
        .form-group-enhanced {
          margin-bottom: 25px;
        }
        .form-label-enhanced {
          display: block;
          font-size: 15px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 10px;
        }
        .form-input-enhanced {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          box-sizing: border-box;
          background-color: #fff;
        }
        .form-input-enhanced:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .form-input-enhanced::placeholder {
          color: #9ca3af;
        }
        .modal-actions-enhanced {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        .btn-cancel-enhanced {
          padding: 12px 24px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background-color: white;
          color: #6b7280;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-cancel-enhanced:hover {
          background-color: #f9fafb;
          border-color: #d1d5db;
          color: #374151;
        }
        .btn-submit-enhanced {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
        }
        .btn-submit-enhanced:hover:not(:disabled) {
          background: linear-gradient(135deg, #45a049, #3d8b40);
          box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
          transform: translateY(-1px);
        }
        .btn-submit-enhanced:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-submit-enhanced:active:not(:disabled) {
          transform: translateY(0);
        }
        @media (max-width: 768px) {
          .enhanced-modal .modal-dialog {
            max-width: calc(100% - 20px) !important;
          }
          .modal-body-enhanced {
            padding: 20px !important;
          }
          .modal-title-enhanced {
            font-size: 20px !important;
          }
          .form-group-enhanced {
            margin-bottom: 20px;
          }
          .form-input-enhanced {
            padding: 12px 14px;
            font-size: 15px;
          }
          .modal-actions-enhanced {
            flex-direction: column;
            margin-top: 20px;
          }
          .btn-cancel-enhanced,
          .btn-submit-enhanced {
            width: 100%;
            padding: 12px 20px;
          }
        }
        @media (max-width: 768px) {
          .navbar-right-container {
            flex-direction: column !important;
            width: 100% !important;
            gap: 8px !important;
          }
          .stock-list-item {
            width: 100% !important;
            display: block !important;
          }
          .stock-list-btn-mobile {
            width: 100% !important;
            max-width: 100% !important;
            margin-right: 0 !important;
            margin-bottom: 0 !important;
            padding: 10px 16px !important;
            font-size: 14px !important;
            height: auto !important;
            display: block !important;
          }
          #navbar-right {
            flex-direction: column !important;
            width: 100% !important;
          }
          #navbar-right > li {
            width: 100% !important;
            margin-bottom: 8px !important;
          }
          .notification-dropdown {
            width: 100% !important;
            max-width: 100vw !important;
            left: 0 !important;
            right: 0 !important;
            margin-left: 0 !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
            margin-top: 10px !important;
          }
          .profile-notification {
            width: 100% !important;
            max-width: 100vw !important;
            left: 0 !important;
            right: 0 !important;
            margin-left: 0 !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
            margin-top: 10px !important;
          }
          .pro-head {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 12px !important;
            padding: 18px 20px !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border-radius: 12px 12px 0 0 !important;
            color: white !important;
          }
          .pro-head > div {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            flex: 1 !important;
          }
          .pro-head img {
            width: 50px !important;
            height: 50px !important;
            border: 2px solid rgba(255, 255, 255, 0.3) !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
          }
          .pro-head span {
            font-size: 16px !important;
            font-weight: 600 !important;
            color: white !important;
          }
          .pro-head button {
            background: rgba(255, 255, 255, 0.2) !important;
            border-radius: 8px !important;
            padding: 8px 12px !important;
            width: auto !important;
            height: auto !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.3s ease !important;
          }
          .pro-head button:hover {
            background: rgba(255, 255, 255, 0.3) !important;
            transform: scale(1.05) !important;
          }
          .pro-head button i {
            color: white !important;
            font-size: 18px !important;
          }
          .pro-body {
            padding: 8px !important;
            background: white !important;
          }
          .pro-body .dropdown-item {
            padding: 16px 20px !important;
            font-size: 15px !important;
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            border-radius: 8px !important;
            margin: 4px 8px !important;
            transition: all 0.2s ease !important;
            color: #374151 !important;
            text-decoration: none !important;
          }
          .pro-body .dropdown-item:hover {
            background: #f3f4f6 !important;
            transform: translateX(4px) !important;
            color: #667eea !important;
          }
          .pro-body .dropdown-item i {
            font-size: 18px !important;
            width: 24px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: #667eea !important;
          }
          .noti-header {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 10px !important;
            padding: 16px 18px !important;
            background: #f8f9fa !important;
            border-bottom: 2px solid #e5e7eb !important;
          }
          .noti-header h6 {
            font-size: 18px !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
            margin: 0 !important;
          }
          .noti-header button {
            font-size: 13px !important;
            padding: 6px 12px !important;
            border-radius: 6px !important;
            background: #667eea !important;
            color: white !important;
            border: none !important;
            font-weight: 500 !important;
          }
          .noti-body {
            max-height: 250px !important;
            padding: 8px !important;
          }
          .noti-body li {
            padding: 14px 16px !important;
            border-radius: 8px !important;
            margin: 4px 8px !important;
            transition: all 0.2s ease !important;
          }
          .noti-body li:hover {
            background: #f3f4f6 !important;
          }
          .noti-body img {
            width: 45px !important;
            height: 45px !important;
            border-radius: 50% !important;
            border: 2px solid #e5e7eb !important;
          }
          .noti-body h6 {
            font-size: 15px !important;
            font-weight: 600 !important;
            margin-bottom: 4px !important;
          }
          .noti-body p {
            font-size: 13px !important;
            color: #6b7280 !important;
            margin-bottom: 4px !important;
          }
          .noti-body small {
            font-size: 12px !important;
            color: #9ca3af !important;
          }
          .password-modal-content {
            padding: 25px !important;
          }
          .password-modal-content h2 {
            font-size: 24px !important;
          }
          .password-modal-content input {
            padding: 14px 18px !important;
          }
        }
        @media (max-width: 576px) {
          .stock-list-btn-mobile {
            padding: 8px 12px !important;
            font-size: 13px !important;
          }
          .notification-dropdown {
            width: calc(100vw - 20px) !important;
            margin: 0 10px !important;
            border-radius: 10px !important;
          }
          .noti-header {
            padding: 14px 16px !important;
          }
          .noti-header h6 {
            font-size: 16px !important;
          }
          .noti-header button {
            font-size: 12px !important;
            padding: 5px 10px !important;
          }
          .noti-body li {
            padding: 12px 14px !important;
            margin: 3px 6px !important;
          }
          .noti-body img {
            width: 40px !important;
            height: 40px !important;
          }
          .noti-body h6 {
            font-size: 14px !important;
          }
          .noti-body p {
            font-size: 12px !important;
          }
          .profile-notification {
            width: calc(100vw - 20px) !important;
            margin: 0 10px !important;
            border-radius: 10px !important;
          }
          .pro-head {
            padding: 15px 18px !important;
            border-radius: 10px 10px 0 0 !important;
            gap: 10px !important;
          }
          .pro-head img {
            width: 45px !important;
            height: 45px !important;
          }
          .pro-head span {
            font-size: 15px !important;
          }
          .pro-head button {
            padding: 6px 10px !important;
          }
          .pro-head button i {
            font-size: 16px !important;
          }
          .pro-body {
            padding: 6px !important;
          }
          .pro-body .dropdown-item {
            padding: 14px 18px !important;
            font-size: 14px !important;
            margin: 3px 6px !important;
            gap: 10px !important;
          }
          .pro-body .dropdown-item i {
            font-size: 16px !important;
            width: 22px !important;
          }
          .noti-header {
            padding: 10px !important;
          }
          .noti-body {
            max-height: 200px !important;
          }
          .password-modal-content {
            padding: 20px !important;
          }
          .password-modal-content h2 {
            font-size: 22px !important;
            margin-bottom: 20px !important;
          }
          .password-modal-content p {
            font-size: 13px !important;
          }
          .password-modal-content input {
            padding: 12px 16px !important;
            font-size: 14px !important;
          }
          .password-modal-content button {
            padding: 10px 20px !important;
            font-size: 14px !important;
            min-width: 100px !important;
          }
          .password-modal-content > div:last-child {
            flex-direction: column !important;
            gap: 10px !important;
          }
          .password-modal-content > div:last-child button {
            width: 100% !important;
          }
        }
      `}</style>
      <ListGroup
        as="ul"
        bsPrefix=" "
        className="navbar-nav ml-auto navbar-right-container"
        id="navbar-right"
      >
        {/* Show Stock List Button */}
        <ListGroup.Item
          as="li"
          bsPrefix=" "
          className="nav-item stock-list-item"
        >
          <button
            className="stock-list-btn-mobile"
            onClick={() => navigate('/stocklist')}
          >
            Show Stock List
          </button>
        </ListGroup.Item>

        {/* Notification Dropdown */}
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <Dropdown align="end" className="drp-notification">
            <Dropdown.Toggle
              as={Link}
              variant="link"
              to="#"
              id="dropdown-notification"
            >
              <i className="icon feather icon-bell" />
              {/* {unreadCount > 0 && (
                <Badge pill bg="danger" className="notification-badge">
                  {unreadCount}
                </Badge>
              )} */}
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="notification-dropdown">
              <div className="noti-header">
                <h6 className="d-inline-block m-0">Notifications</h6>
                <button className="btn btn-link p-0" onClick={markAllAsRead}>
                  Mark all as read
                </button>
              </div>
              <PerfectScrollbar>
                <ListGroup
                  as="ul"
                  bsPrefix=" "
                  variant="flush"
                  className="noti-body"
                >
                  {notifications.map((notification) => (
                    <ListGroup.Item
                      as="li"
                      bsPrefix=" "
                      key={notification.id}
                      className={!notification.status ? 'unread' : ''}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="d-flex align-items-center">
                        <img
                          src={notification.image}
                          className="img-radius"
                          alt={notification.personName}
                        />
                        <div className="flex-grow-1">
                          <h6>{notification.personName}</h6>
                          <p>{notification.description}</p>
                          <small className="text-muted">
                            {notification.time}
                          </small>
                        </div>
                        <div
                          className={`status-indicator ${notification.status ? 'active' : 'inactive'}`}
                        >
                          <span
                            className={`status-dot ${notification.status ? 'bg-success' : 'bg-danger'}`}
                          />
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </PerfectScrollbar>
              <div className="noti-footer">
                <Link to="/notifications">View all notifications</Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>

        {/* User Settings Dropdown */}
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <Dropdown align="end" className="drp-user">
            <Dropdown.Toggle
              as={Link}
              variant="link"
              to="#"
              id="dropdown-basic"
            >
              <i className="icon feather icon-settings" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div
                className="pro-head"
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <div>
                  <img
                    src={avatar2}
                    className="img-radius"
                    alt="User Profile"
                  />
                  <span>{loginUser.username}</span>
                </div>
                <button
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={logout}
                  title="Logout"
                >
                  <i
                    className="feather icon-log-out"
                    style={{ color: 'white' }}
                  />
                </button>
              </div>
              <ListGroup
                as="ul"
                bsPrefix=" "
                variant="flush"
                className="pro-body"
              >
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/setup/shop" className="dropdown-item">
                    <i className="feather icon-settings" /> My Shop
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/help/forsupport" className="dropdown-item">
                    <i className="feather icon-user" /> For Support
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" " onClick={editPassword}>
                  <Link to="/help/forsupport" className="dropdown-item">
                    <i className="feather icon-user" /> Change Password
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
      <Modal
        show={showEditPasswordModal}
        toggleModal={() => setShowEditPasswordModal(false)}
        onHide={() => setShowEditPasswordModal(false)}
      >
        <div
          className="password-modal-content enhanced-modal-content"
          style={{
            padding: '30px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
              paddingBottom: '20px',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <h2 className="modal-title-enhanced" style={{ margin: 0 }}>
              Change Password
            </h2>
            <button
              onClick={() => setShowEditPasswordModal(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>

          <div
            style={{
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            <p
              style={{
                color: '#7f8c8d',
                fontSize: '15px',
                margin: '0',
              }}
            >
              Enter your new password below
            </p>
          </div>

          <div className="form-group-enhanced">
            <label className="form-label-enhanced">Current Password</label>
            <input
              type="password"
              placeholder="Enter your current password"
              value={password.previousPassword}
              onChange={(e) =>
                setPassword({ ...password, previousPassword: e.target.value })
              }
              className="form-input-enhanced"
            />
          </div>
          <div className="form-group-enhanced">
            <label className="form-label-enhanced">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password.newPassword}
              onChange={(e) =>
                setPassword({ ...password, newPassword: e.target.value })
              }
              className="form-input-enhanced"
            />
          </div>

          <div className="modal-actions-enhanced">
            <button
              type="button"
              onClick={() => setShowEditPasswordModal(false)}
              className="btn-cancel-enhanced"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmEditPassword}
              className="btn-submit-enhanced"
              style={{
                background: 'linear-gradient(135deg, #3498db, #2980b9)',
              }}
            >
              Update Password
            </button>
          </div>
        </div>
      </Modal>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  );
};

export default NavRight;
// import React from 'react';
