/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import Modal from 'react-modal';

const ActionModal = ({ isOpen, closeModal }) => {
  const handleAction = (action) => {
    
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Actions Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          width: '300px', 
          margin: 'auto',
        },
      }}
    >
      <h2>Actions</h2>
      <ul>
        <li>
          <button onClick={() => handleAction('edit')}>
            Edit <i className="fas fa-edit"></i>
          </button>
        </li>
        <li>
          <button onClick={() => handleAction('delete')}>
            Delete <i className="fas fa-trash"></i>
          </button>
        </li>
        <li>
          <button onClick={() => handleAction('view')}>
            View <i className="fas fa-eye"></i>
          </button>
        </li>
      </ul>
    </Modal>
  );
};

export default ActionModal;
