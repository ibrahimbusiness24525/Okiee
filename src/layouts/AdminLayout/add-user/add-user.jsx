import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';
import { Modal, Button, Form } from 'react-bootstrap';
import { BASE_URL } from 'config/constant';

const UserTable = () => {
  const [users, setUsers] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'employee' });

   useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.post(`${BASE_URL}api/admin/getAlluser`, {user});
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error.response ? error.response.data.message : error.message);
    }
  };

  const filteredUsers = users?.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserStatus = async (user) => {
    try {
  
      // Make the API call to activate or deactivate the user
      await axios.put(`${BASE_URL}api/admin/activateDeactivateUser`, user);
      fetchUsers()
    } catch (error) {
      console.error("Error toggling user status:", error.response ? error.response.data.message : error.message);
    }
  };
  

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setEditUser(false);
    setNewUser({ username: '', email: '', password: '', role: 'employee' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {        
        await axios.put(`${BASE_URL}api/admin/updateUser`, newUser);
        fetchUsers();
      } else {
        const accountId = JSON.parse(localStorage.getItem('user'))._id;
        await axios.post(`${BASE_URL}api/admin/addUser/${accountId}`, newUser);
        setUsers([...users, { ...newUser, id: users.length + 1 }]);
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data.message : error.message);
    }
    handleClose();
  };

  const handleEditUser = (user) => {
    setEditUser(true);
    setNewUser(user);
    handleShow();
  };

  return (
    <div>
      <div style={headerContainerStyle}>
        <h2 style={headingStyle}>User List</h2>
        <button style={addButtonStyle} onClick={handleShow}>Add User</button>
        <div style={searchContainerStyle}>
          <FiSearch style={searchIconStyle} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchBarStyle}
          />
        </div>
      </div>
      <div style={tableWrapper}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerStyle}>Username</th>
              <th style={headerStyle}>Email</th>
              <th style={headerStyle}>Role</th>
              <th style={headerStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id} style={index % 2 === 0 ? rowStyle : altRowStyle}>
                <td style={cellStyle}>{user.username}</td>
                <td style={cellStyle}>{user.email}</td>
                <td style={cellStyle}>{user.role}</td>
                <td style={cellStyle}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={editButtonStyle} onClick={() => handleEditUser(user)}>Edit</button>
                    <button
                      style={!user.active ? deactivateButtonStyle : activateButtonStyle}
                      onClick={() => toggleUserStatus(user)}
                    >
                      {!user.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editUser ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddUser}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
                disabled={editUser}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                disabled={editUser}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                // disabled={editUser}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRole" className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                required
              >
                <option value="employee">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              {editUser ? 'Update User' : 'Add User'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

// Styles (keep your existing styles or modify as needed)
const headerContainerStyle = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  flexWrap: 'wrap'
};

const headingStyle = {
  margin: 0,
  color: '#333',
};

const searchContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #ccc',
  borderRadius: '20px',
  padding: '5px 10px',
  backgroundColor: '#f0f0f0',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  width: '100%'
};

const searchIconStyle = {
  marginRight: '8px',
  color: '#888',
  fontSize: '20px',
};

const searchBarStyle = {
  padding: '0px',
  fontSize: '16px',
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  width: '100%',
};

const tableWrapper = {
  marginTop: '20px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(0, 0, 0, 0.2)',
  width: '100%',
  overflow: 'auto',
  maxHeight: '500px'
};

const tableStyle = {
  width: '100%',
};

const headerStyle = {
  minWidth: '150px',
  backgroundColor: '#f5f5f5',
  color: '#333',
  padding: '12px 20px',
  fontSize: '16px',
  textAlign: 'left',
  borderBottom: '2px solid #ccc',
};

const rowStyle = {
  backgroundColor: '#f9f9f9',
  transition: 'background-color 0.3s',
};

const altRowStyle = {
  backgroundColor: '#e0e0e0',
  transition: 'background-color 0.3s',
};

const cellStyle = {
  minWidth: '150px',
  padding: '10px 20px',
  borderBottom: '1px solid #ccc',
  color: '#333',
};

const addButtonStyle = {
  padding: '5px 20px',
  backgroundColor: '#ffc107',
  color: '#fff',
  fontSize: '16px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'block',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  marginLeft: 'auto'
};

const editButtonStyle = {
  padding: '6px 12px',
  marginRight: '10px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const activateButtonStyle = {
  padding: '6px 12px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const deactivateButtonStyle = {
  padding: '6px 12px',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default UserTable;
