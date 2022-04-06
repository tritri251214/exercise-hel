import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { WEB_SITE_NAME } from '../constants';
import IndexStyles from '../styles';
import { getUserInformation } from '../util';
import cartImg from '../images/cart.jpg';
import { Button, Container, Image, Nav, Navbar } from 'react-bootstrap';
import AppLoading from './AppLoading';
import { useHistory } from 'react-router-dom';

const NavbarApp = ({ routes }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const userInformation = getUserInformation();
    setUser(userInformation);
  }, [routes]);

  const onSignOut = async () => {
    setLoading(true);
    await Auth.signOut({ global: true });
    setLoading(false);
    history.push('/food/list');
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/food/list">{WEB_SITE_NAME}</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav>
            {routes && routes.map(route => {
              let component = null;
              if (route.navbar) {
                component = (
                  <Nav.Item key={route.name}>
                    <Link to={route.path} className='nav-link'>{route.name}</Link>
                  </Nav.Item>
                );
              }
              return component;
            })}
          </Nav>
          <div style={{ position: 'absolute', right: '0', paddingRight: '1rem' }}>
            {user ? (
              <>
                <Link to="/cart" className='btn btn-link'>
                  <Image src={cartImg} style={IndexStyles.cartImg} /> Cart
                </Link>
                <Link to="/profile" className='btn btn-link'>{user.name}</Link>
                <Button variant="link" onClick={onSignOut}>
                  {
                    loading ? <AppLoading type="button" /> : 'Logout'
                  }
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className='btn btn-link'>Login</Link>
                <Link to="/register" className='btn btn-link'>Register</Link>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarApp;
