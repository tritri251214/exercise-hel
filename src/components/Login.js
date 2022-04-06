import { Auth } from 'aws-amplify';
import React, { useContext, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import NotificationsContext from '../contexts/Notifications';
import AppLoading from './AppLoading';
import Header from './Header';

const initUser = {
  email: '',
  password: ''
};

const Login = () => {
  const [user, setUser] = useState(initUser);
  const [loading, setLoading] = useState(false);
  const notifications = useContext(NotificationsContext);
  const history = useHistory();

  const onSignIn = async () => {
    try {
      setLoading(true);
      const cognitoUser = await Auth.signIn({
        username: user.email,
        password: user.password
      });
      if (cognitoUser && cognitoUser.attributes) {
        notifications({ message: `Welcome ${cognitoUser?.attributes?.name} to Hel App`, type: 'success' });
      }
      setLoading(false);
      history.push('/food/list');
    } catch (error) {
      setLoading(false);
      notifications({ message: error.message, type: 'error' });
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
          <Header title="Login" />
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

            <Form.Group className="mb-3" controlId="txtPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={(event) => handleChange(event, 'password')}
              />
            </Form.Group>
            <Button variant="primary" onClick={onSignIn}>
              {loading ? <AppLoading type="button" /> : 'Sign In'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
