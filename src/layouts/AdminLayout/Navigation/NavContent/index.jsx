import PropTypes from 'prop-types';
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';

import NavGroup from './NavGroup';

const NavContent = ({ navigation }) => {

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = user.role; // Assume 'role' is the property in the user object
  // Filter navigation based on role
  const filteredNavigation = navigation.filter((item) => {
    if (['adduser', 'shop'].includes(item.id) && userRole === 'employee') {
      return false; // Do not show "Add User" and "Shop" for employees
    } else if (['adduser', 'shop'].includes(item.id) && userRole === 'admin') {
      return false
    }
    return true;
  });
  


  const navItems = filteredNavigation.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={'nav-group-' + item.id} group={item} />;
      default:
        return false;
    }
  });

  let mainContent = '';

  mainContent = (
    <div className="navbar-content datta-scroll">
      <PerfectScrollbar>
        <ListGroup variant="flush" as="ul" bsPrefix=" " className="nav pcoded-inner-navbar" id="nav-ps-next">
          {navItems}
        </ListGroup>
      </PerfectScrollbar>
    </div>
  );

  return <React.Fragment>{mainContent}</React.Fragment>;
};

NavContent.propTypes = {
  navigation: PropTypes.array
};

export default NavContent;
