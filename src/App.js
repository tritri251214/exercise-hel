import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Notification from './components/Notification';
import NotificationsContext from './contexts/Notifications';
import Amplify, { API, graphqlOperation, Hub } from 'aws-amplify';
import awsExports from './aws-exports';
import { clearLocalStorage, getUserInformation, setUserInformation } from './util';
import NavbarApp from './components/Navbar';
import getRoutes from './routes';
import { ROLE } from './constants';
import { getUserByEmail } from './graphql/queries';
import { createUserAddress } from './graphql/mutations';
import ErrorPage from './components/ErrorPage';

Amplify.configure(awsExports);

const App = () => {
  const [notificationConfig, setNotificationConfig] = useState({
    message: '',
    type: 'success'
  });
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    Hub.listen('auth', async ({ payload: { event, data }}) => {
      if (event === 'signIn') {
        await reload(data);
      } else if (event === 'signOut') {
        clearLocalStorage();
        const routesData = getRoutes(ROLE.GUEST);
        setRoutes(routesData);
      }
    });
    const userInformation = getUserInformation();
    let role = ROLE.GUEST;
    if (userInformation && userInformation.role) {
      role = userInformation.role;
    }
    const routesData = getRoutes(role);
    setRoutes(routesData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function reload(cognitoUser) {
    let userInformation = null;
    let role = ROLE.GUEST;
    if (cognitoUser) {
      if (cognitoUser?.attributes?.email && cognitoUser.attributes.email === 'admin@gmail.com') {
        role = ROLE.ADMIN;
      } else if (cognitoUser.attributes.email) {
        role = ROLE.MEMBER;
      }
      if (role !== ROLE.GUEST) {
        userInformation = await getProfileUserAddress(cognitoUser);
      }
      userInformation.role = role;
      setUserInformation(userInformation);
    }
    const routesData = getRoutes(role);
    setRoutes(routesData);
  }

  async function getProfileUserAddress(cognitoUser) {
    try {
      const response = await API.graphql(graphqlOperation(getUserByEmail, { email: cognitoUser.attributes.email }));
      if (response?.data?.getUserByEmail?.items.length === 0) {
        const params = {
          email: cognitoUser?.attributes?.email,
          userID: cognitoUser?.username,
          name: cognitoUser?.attributes?.name,
          address1: `${cognitoUser?.attributes?.name} address 1`,
          address2: `${cognitoUser?.attributes?.name} address 2`,
          address3: `${cognitoUser?.attributes?.name} address 3`,
        };
        const responseCreateUserAddress = await API.graphql(graphqlOperation(createUserAddress, { input: params }));
        return responseCreateUserAddress.data.createUserAddress;
      }
      return response.data.getUserByEmail.items[0];
    } catch (error) {
      console.error('getProfileUserAddress: ', error);
    }
  }

  return (
    <NotificationsContext.Provider value={setNotificationConfig}>
      <Container>
        <Router>
          <Notification message={notificationConfig.message} type={notificationConfig.type} />
          <NavbarApp routes={routes} />
          <Switch>
            <Redirect exact from='/' to='/food/list' />
            {routes && routes.map(route => {
              return (
                <Route key={route.name} path={route.path} component={route.component} />
              );
            })}
            <Route>
              <ErrorPage error={404} />
            </Route>
          </Switch>
        </Router>
      </Container>
    </NotificationsContext.Provider>
  );
}

export default App;
