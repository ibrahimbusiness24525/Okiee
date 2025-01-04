import React from 'react';
import { ListGroup } from 'react-bootstrap';
import useWindowSize from '../../../../hooks/useWindowSize';
import AddPhone from 'layouts/AdminLayout/add-phone/add-phone';

const NavLeft = () => {
  const windowSize = useWindowSize();
  const [showModal, setShowModal] = React.useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Determine button styles dynamically based on screen size
  const buttonStyles = {
    base: {
      background: 'linear-gradient(to right, #50b5f4, #b8bee2)',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    largeScreen: {
      height: '50px',
      width: '200px',
      marginLeft: '50px',
      marginTop: '0px',
    },
    mediumScreen: {
      height: '45px',
      width: '180px',
      marginLeft: '20px',
      marginTop: '5px',
    },
    smallScreen: {
      height: '40px',
      width: '100%',
      marginLeft: '5px',
      marginTop: '10px',
    },
  };

  const hoverStyle = {
    background: 'linear-gradient(to right, #3a97d4, #9ea9d2)',
  };

  // Apply styles based on screen size
  let dynamicStyles = {};
  if (windowSize.width > 1200) {
    dynamicStyles = buttonStyles.largeScreen;
  } else if (windowSize.width > 768) {
    dynamicStyles = buttonStyles.mediumScreen;
  } else {
    dynamicStyles = buttonStyles.smallScreen;
  }

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <button
            style={{
              ...buttonStyles.base,
              ...dynamicStyles,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = hoverStyle.background;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = buttonStyles.base.background;
            }}
            onClick={handleShow}
          >
            Add New Phone
          </button>
        </ListGroup.Item>
      </ListGroup>
      <AddPhone modal={showModal} handleModalClose={handleClose} />
    </React.Fragment>
  );
};

export default NavLeft;
