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

const handleConfirmEditPassword = async() => {
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
    toast.error(error.response.data.message || error.message || error.data.message || 'Error editing password');
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
      <ListGroup
        as="ul"
        bsPrefix=" "
        className="navbar-nav ml-auto"
        id="navbar-right"
      >
        {/* Notification Dropdown */}
        <button
          style={{
            background: 'linear-gradient(to right, #FFA726, #FB8C00)', // orange gradient
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '200px',
            height: '50px',
            transition: 'background 0.3s ease',
            marginRight: '10px',
          }}
          onMouseEnter={
            (e) =>
              (e.target.style.background =
                'linear-gradient(to right, #F57C00, #EF6C00)') // darker orange
          }
          onClick={() => navigate('/stocklist')}
          onMouseLeave={(e) =>
            (e.target.style.background =
              'linear-gradient(to right, #FFA726, #FB8C00)')
          }
        >
          Show Stock List
        </button>

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
      <Modal show={showEditPasswordModal} toggleModal={() => setShowEditPasswordModal(false)} onHide={() => setShowEditPasswordModal(false)}>
        <div style={{
          padding: '30px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          width: '100%',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <h2 style={{
              color: '#2c3e50',
              fontSize: '28px',
              fontWeight: '600',
              margin: '0 0 10px 0',
              fontFamily: 'Arial, sans-serif'
            }}>
              Change Password
            </h2>
            <p style={{
              color: '#7f8c8d',
              fontSize: '14px',
              margin: '0',
              fontFamily: 'Arial, sans-serif'
            }}>
              Enter your new password below
            </p>
          </div>
          
          <div style={{ marginBottom: '25px' }}>
            <input 
              type="password" 
              placeholder="Enter Your Current Password" 
              value={password.previousPassword} 
              onChange={(e) => setPassword({...password, previousPassword: e.target.value})}
              style={{
                width: '100%',
                padding: '15px 20px',
                border: '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                outline: 'none',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                backgroundColor: '#f8f9fa'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3498db';
                e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                e.target.style.backgroundColor = '#ffffff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e8ed';
                e.target.style.boxShadow = 'none';
                e.target.style.backgroundColor = '#f8f9fa';
              }}
            />
          </div>
          <div style={{ marginBottom: '25px' }}>
            <input 
              type="password" 
              placeholder="Enter New Password" 
                value={password.newPassword} 
              onChange={(e) => setPassword({...password, newPassword: e.target.value})}
              style={{
                width: '100%',
                padding: '15px 20px',
                border: '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                outline: 'none',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                backgroundColor: '#f8f9fa'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3498db';
                e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                e.target.style.backgroundColor = '#ffffff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e8ed';
                e.target.style.boxShadow = 'none';
                e.target.style.backgroundColor = '#f8f9fa';
              }}
            />
          </div>
          
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center'
          }}>
            <button 
              onClick={() => setShowEditPasswordModal(false)}
              style={{
                padding: '12px 30px',
                border: '2px solid #e1e8ed',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#7f8c8d',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Arial, sans-serif',
                minWidth: '120px'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#bdc3c7';
                e.target.style.color = '#2c3e50';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e1e8ed';
                e.target.style.color = '#7f8c8d';
              }}
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirmEditPassword}
              style={{
                padding: '12px 30px',
                border: 'none',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #3498db, #2980b9)',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Arial, sans-serif',
                minWidth: '120px',
                boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2980b9, #1f4e79)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.3)';
              }}
            >
              Update Password
            </button>
          </div>
        </div>
      </Modal>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />

      <style jsx>{`
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
      `}</style>
    </React.Fragment>
  );
};

export default NavRight;
// import React from 'react';
