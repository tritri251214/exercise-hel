import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Image, Nav, Navbar } from 'react-bootstrap';
import Notification from './components/Notification';
import NotificationsContext from './contexts/Notifications';
import Amplify, { API, Auth, graphqlOperation, Hub } from 'aws-amplify';
import awsExports from './aws-exports';
import ListFoods from './components/ListFoods';
import { withAuthenticator } from '@aws-amplify/ui-react';
import ListOrders from './components/ListOrders';
import ListMenus from './components/ListMenus';
import DetailMenu from './components/DetailMenu';
import Profile from './components/Profile';
import Cart from './components/Cart';
import { ROLE } from './constants';
import { getUserByEmail } from './graphql/queries';
import { createUserAddress } from './graphql/mutations';
import { Link } from 'react-router-dom';
import AppLoading from './components/AppLoading';
import { clearLocalStorage, setUserInformation } from './util';
import cartImg from './images/cart.jpg';
import IndexStyles from './styles/index';

Amplify.configure(awsExports);

const App = ({ signOut, user }) => {
  const [notificationConfig, setNotificationConfig] = useState({
    message: '',
    type: 'success'
  });
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, }}) => {
      if (event === 'signOut') {
        clearLocalStorage();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function reload() {
    if (user) {
      let role = null;
      if (user?.attributes?.email && user.attributes.email === 'admin@gmail.com') {
        role = ROLE.ADMIN;
      } else {
        role = ROLE.MEMBER;
      }
      let userInformation = await getProfileUserAddress();
      userInformation.role = role;
      setUserInformation(userInformation);
      setUserInfo(userInformation);
    }
  }

  async function getProfileUserAddress() {
    try {
      const response = await API.graphql(graphqlOperation(getUserByEmail, { email: user.attributes.email }));
      if (response?.data?.getUserByEmail?.items.length === 0) {
        const responseCreateUserAddress = await API.graphql(graphqlOperation(createUserAddress, { input: { email: user.attributes.email, userID: user.username, address1: 'default address 1', address2: 'default address 2', address3: 'default address 3' }}));
        return responseCreateUserAddress.data.createUserAddress;
      }
      return response.data.getUserByEmail.items[0];
    } catch (error) {
      console.error('getProfileUserAddress: ', error);
    }
  }

  const onSignOut = async () => {
    setLoading(true);
    await signOut();
  }

  return (
    <NotificationsContext.Provider value={setNotificationConfig}>
      <Container>
        <Router>
          <Notification message={notificationConfig.message} type={notificationConfig.type} />

          <Navbar bg="dark" variant="dark" expand="lg">
            <Container fluid>
              <Navbar.Brand href="/food/list">Exercise HEL</Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll">
                <Nav>
                  <Nav.Item>
                    <Nav.Link href="/food/list">Foods</Nav.Link>
                  </Nav.Item>
                  {userInfo && userInfo.role === ROLE.ADMIN && (
                    <>
                    <Nav.Item>
                      <Nav.Link href="/order/list">Orders</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link href="/menu/list">Menu Catalogues</Nav.Link>
                    </Nav.Item>
                    </>
                  )}
                </Nav>
                <div style={{ position: 'absolute', right: '0', paddingRight: '1rem' }}>
                  <Link to="/cart" className='btn btn-link'>
                    <Image src={cartImg} style={IndexStyles.cartImg} /> Cart
                  </Link>
                  <Link to="/profile" className='btn btn-link'>{userInfo && userInfo.email}</Link>
                  <Button variant="link" onClick={onSignOut}>
                    {
                      loading ? <AppLoading type="button" /> : 'Logout'
                    }
                  </Button>
                </div>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <Switch>
            <Redirect exact from="/" to="/food/list" />
            <Route path="/food/list">
              <ListFoods />
            </Route>
            <Route path="/order/list">
              <ListOrders />
            </Route>
            <Route path="/menu/list">
              <ListMenus />
            </Route>
            <Route path="/menu/add">
              <DetailMenu />
            </Route>
            <Route path="/menu/detail/:menuID">
              <DetailMenu />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/cart">
              <Cart />
            </Route>
          </Switch>
        </Router>
      </Container>
    </NotificationsContext.Provider>
  );
}

export default withAuthenticator(App);
