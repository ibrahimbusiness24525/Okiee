import React from 'react';
import { ListGroup, Button, Modal, Form, Row, Col, Image } from 'react-bootstrap';
import useWindowSize from '../../../../hooks/useWindowSize';
import NavSearch from './NavSearch';
import { BASE_URL } from 'config/constant';
import axios from 'axios';
import '../../../../app.css';
import { toast } from 'react-toastify';
import AddPhone from 'layouts/AdminLayout/add-phone/add-phone';

const NavLeft = () => {
  const windowSize = useWindowSize();
  const [loading, setLoading] = React.useState(false);
  const [mobileBrands, setMobileBrands] = React.useState([
    { id: 1, name: 'Apple', image: 'https://via.placeholder.com/110x110', link: '#' },
    { id: 2, name: 'Samsung', image: 'https://via.placeholder.com/110x110', link: '#' },
    { id: 3, name: 'Huawei', image: 'https://via.placeholder.com/110x110', link: '#' },
    { id: 4, name: 'Xiaomi', image: 'https://via.placeholder.com/110x110', link: '#' },
    { id: 5, name: 'Oppo', image: 'https://via.placeholder.com/110x110', link: '#' },
    { id: 6, name: 'Vivo', image: 'https://via.placeholder.com/110x110', link: '#' },
    { id: 7, name: 'Realme', image: 'https://via.placeholder.com/110x110', link: '#' },
    { id: 8, name: 'OnePlus', image: 'https://via.placeholder.com/110x110', link: '#' }
  ]);

  const [showModal, setShowModal] = React.useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  let navItemClass = ['nav-item'];
  if (windowSize.width <= 575) {
    navItemClass = [...navItemClass, 'd-none'];
  }
  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
        <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(' ')}>
          <button className="btn btn-primary" style={style.addNewPhoneBtn} onClick={handleShow}>
            Add New Phone
          </button>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <NavSearch windowWidth={windowSize.width} />
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
        <button className="btn btn-primary" style={style.addNewPhoneBtn}>
        Contact Us: 03057903867
          </button>
        </ListGroup.Item>
      </ListGroup>
      <AddPhone modal={showModal} handleModalClose={handleClose}/>
    </React.Fragment>
  );
};
const style = {
  addNewPhoneBtn: {
    background: 'linear-gradient(to right, #50b5f4, #b8bee2)',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer'
  }
};
export default NavLeft;
