import React, { useContext, useEffect } from 'react';
import { Toast } from 'react-bootstrap';
import NotficationsContext from '../contexts/Notifications';

const Notification = (props) => {
  const context = useContext(NotficationsContext);

  useEffect(() => {
    if (props.message) {
      setTimeout(() => {
        context({ message: '', type: 'success' });
      }, 5 * 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.message]);

  return (
    props.message ?
    <Toast style={styles.toast}>
      <Toast.Header>
        {
          props.type === 'success' ?
          <strong className="me-auto" style={{ color: 'green' }}>Success</strong> :
          <strong className="me-auto" style={{ color: 'red' }}>Error</strong>
        }
      </Toast.Header>
      <Toast.Body>{ props.message }</Toast.Body>
    </Toast> : ''
  );
};

const styles = {
  toast: {
    position: 'absolute',
    top: 20,
    right: 50,
    zIndex: 1
  }
};

export default Notification;
