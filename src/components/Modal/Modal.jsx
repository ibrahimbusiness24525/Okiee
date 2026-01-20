import React from 'react';

const Modal = ({ children, toggleModal, size = 'md', show }) => {
  const sizes = {
    sm: { width: '30%' },
    md: { width: '45%' },
    lg: { width: '70%' },
  };

  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    borderRadius: '9px',
    border: '1px solid #c4c4c4',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 999999,
    ...sizes[size],
    display: show ? 'block' : 'none', // Conditional display based on the show prop
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: show ? 'block' : 'none', // Show overlay only when modal is visible
  };

  const contentStyle = {
    padding: '20px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  };

  return (
    <>
      <div style={overlayStyle} onClick={toggleModal}></div>
      <div style={modalStyle}>
        <div style={contentStyle}>{children}</div>
      </div>
    </>
  );
};

export default Modal;
