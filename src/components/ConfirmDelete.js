import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

const ConfirmDelete = (props) => {
  const { dialog, loading, handleClose, handleSubmit, children } = props;

  return (
    <Modal show={dialog} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete Modal</Modal.Title>
      </Modal.Header>
      <Modal.Body>{ children }</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" type="submit" onClick={handleSubmit}>
          {
            loading ?
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            /> :
            'Yes'
          }
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDelete;
