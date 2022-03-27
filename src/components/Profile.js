import { API, graphqlOperation } from 'aws-amplify';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Form, Row, Table, Button } from 'react-bootstrap';
import NotificationsContext from '../contexts/Notifications';
import { listOrders } from '../graphql/queries';
import AppLoading from './AppLoading';
import EmptyData from './EmptyData';
import Header from './Header';
import { updateUserAddress } from '../graphql/mutations';
import { getUserInformation, setUserInformation } from '../util';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [ordersHistory, setOrdersHistory] = useState([]);
  const notifications = useContext(NotificationsContext);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function reload() {
    try {
      const userInformation = getUserInformation();
      setProfile(userInformation);
      const data = await getOrdersHistory();
      setOrdersHistory(data);
    } catch (error) {
      console.log('error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
    }
  }

  async function getOrdersHistory() {
    try {
      setLoading(true);
      const response = await API.graphql(graphqlOperation(listOrders));
      setLoading(false);
      return response.data.listOrders.items;
    } catch (error) {
      console.log('getOrdersHistory error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
      setLoading(false);
      return [];
    }
  }

  const onSave =  async () => {
    try {
      const formData = {
        id: profile.id,
        address1: profile.address1,
        address2: profile.address2,
        address3: profile.address3
      };
      setLoadingSave(true);
      const response = await API.graphql(graphqlOperation(updateUserAddress, { input: formData }));
      if (response?.data?.updateUserAddress) {
        setUserInformation(profile);
        setLoadingSave(false);
        notifications({ message: 'Update address successfully!', type: 'success' });
      }
    } catch (error) {
      console.log('onSave error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
      setLoadingSave(false);
    }
  }

  const onDelivered = () => {
    // TODO
  }

  const handleChangeProfile = (event, field) => {
    let updateProfile = {...profile};
    updateProfile[field] = event.target.value;
    setProfile(updateProfile);
  }

  const renderProfile = () => {
    if (!profile) {
      return null;
    }

    return (
      <Form>
        <Form.Group className="mb-3" controlId="txtEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={profile.email} readOnly />
        </Form.Group>

        <Form.Group className="mb-3" controlId="txtAddress1">
          <Form.Label>Address 1</Form.Label>
          <Form.Control type="text" placeholder="Enter address 1" value={profile.address1} onChange={(event) => handleChangeProfile(event, 'address1')} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="txtAddress2">
          <Form.Label>Address 2</Form.Label>
          <Form.Control type="text" placeholder="Enter address 2" value={profile.address2} onChange={(event) => handleChangeProfile(event, 'address2')} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="txtAddress3">
          <Form.Label>Address 3</Form.Label>
          <Form.Control type="text" placeholder="Enter address 3" value={profile.address3} onChange={(event) => handleChangeProfile(event, 'address3')} />
        </Form.Group>

        <Button variant="primary" onClick={onSave}>
          {loadingSave ? <AppLoading type="button" /> : 'Save'}
        </Button>
      </Form>
    );
  }

  const renderOrdersHistory = () => {
    return (
      <>
      <h4>Orders History</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Menu week</th>
            <th>Entree</th>
            <th>Main meal</th>
            <th>Dessert</th>
            <th>Order date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {ordersHistory && ordersHistory.length === 0 && <EmptyData type='table' colSpan={7} />}
          {ordersHistory && ordersHistory.length === 0 && ordersHistory.map((order) => (
            <tr>
              <td>{order.week}</td>
              <td>{order.entree}</td>
              <td>{order.mainMeal}</td>
              <td>{order.dessert}</td>
              <td>{order.status}</td>
              <td>
                <Button variant='primary' onClick={onDelivered}>Delivered</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Header title="Profile" />
      {loading && <AppLoading />}
      <Row>
        <Col>{renderProfile()}</Col>
      </Row>
      <Row>
        <Col>{renderOrdersHistory()}</Col>
      </Row>
    </Container>
  );
};

export default Profile;
