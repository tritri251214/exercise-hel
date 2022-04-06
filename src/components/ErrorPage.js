import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Header from './Header';

const ErrorPage = ({ error }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const history = useHistory();

  useEffect(() => {
    let titleTmp = '';
    let messageTmp = '';
    switch (error) {
      case 404:
        titleTmp = 'Not Found';
        messageTmp = 'This page not found';
        break;
      case 403:
        titleTmp = 'Unauthorized';
        messageTmp = 'Sorry, you don\' have perrmission accept to this page';
        break;
      default:
        break;
    }
    setTitle(titleTmp);
    setMessage(messageTmp);
  }, []);

  const redirectToHome = () => {
    history.push('/food/list');
  }

  return (
    <Container fluid>
      <Row className="justify-content-md-center mt-5">
        <Col xs lg="4">
          <Header title={title} />
          <p>{message}</p>
          <Button variant='primary' onClick={redirectToHome}>Go to home</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorPage;
