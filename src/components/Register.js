import { Auth } from 'aws-amplify';
import React, { useContext, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import NotificationsContext from '../contexts/Notifications';
import AppLoading from './AppLoading';
import Header from './Header';

const initUser = {
  email: '',
  fullName: '',
  password: ''
};

const Register = () => {
  const [user, setUser] = useState(initUser);
  const [loading, setLoading] = useState(false);
  const notifications = useContext(NotificationsContext);

  const onSignUp = async () => {
    try {
      setLoading(true);
      const signUpResult = await Auth.signUp({
        username: user.email,
        password: user.password,
        attributes: {
          email: user.email,
          name: user.fullName
        }
      });
      if (signUpResult && signUpResult.user) {
        notifications({ message: 'Sign Up successfully!', type: 'success' });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('onSignUp error:', error);
    }
  }

  const handleChange = (event, field) => {
    setUser(cur => {
      let next = {...cur};
      next[field] = event.target.value;
      return next;
    });
  }

  return (
    <Container fluid>
      <Row className="justify-content-md-center mt-5">
        <Col xs lg="4">
          <Header title="Register" />
          <Form>
            <Form.Group className="mb-3" controlId="txtEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={user.email}
                onChange={(event) => handleChange(event, 'email')}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="txtFullname">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter fullname"
                value={user.fullName}
                onChange={(event) => handleChange(event, 'fullName')}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="txtPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={(event) => handleChange(event, 'password')}
              />
            </Form.Group>

            <Button variant="primary" onClick={onSignUp}>
              {loading ? <AppLoading type="button" /> : 'Sign Up'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
};

export default Register;

