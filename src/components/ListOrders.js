import { API, graphqlOperation } from 'aws-amplify';
import React, { useContext, useEffect, useState } from 'react';
import { Badge, Button, Col, Container, Row, Table } from 'react-bootstrap';
import NotificationsContext from '../contexts/Notifications';
import { runPrepareFoods } from '../graphql/mutations';
import { listOrders, getUserAddressByUserID } from '../graphql/queries';
import AppLoading from './AppLoading';
import EmptyData from './EmptyData';
import Header from './Header';
import moment from 'moment';
import { STATUS_ORDER } from '../constants';
import { handleException } from '../util';

const ListOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const notifications = useContext(NotificationsContext);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function reload() {
    try {
      const data = await getListOrders();
      setOrders(data);
    } catch (error) {
      await handleException(error);
      console.log('error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
    }
  }

  async function getListOrders() {
    try {
      setLoading(true);
      const response = await API.graphql(graphqlOperation(listOrders));
      setLoading(false);
      return response.data.listOrders.items;
    } catch (error) {
      await handleException(error);
      console.log('getListOrders error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
      setLoading(false);
      return [];
    }
  }

  async function getUserAddress(order) {
    try {
      const response = await API.graphql(graphqlOperation(getUserAddressByUserID, { userID: order.userID }));
      return response.data.getUserAddressByUserID.items[0];
    } catch (error) {
      await handleException(error);
      console.log('getUserAddress error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
    }
  }

  const onPicking = async (order) => {
    try {
      setLoading(true);
      const userAddress = await getUserAddress(order);
      const formData = {
        orderID: order.id,
        email: userAddress.email,
        orderTime: order.orderTime
      };
      const response = await API.graphql(graphqlOperation(runPrepareFoods, { data: JSON.stringify(formData) }));
      if (response?.data?.runPrepareFoods) {
        notifications({ message: 'The order change to Picking successfully', type: 'success' });
        await reload();
      }
      setLoading(false);
    } catch (error) {
      await handleException(error);
      console.log('onPicking error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
      setLoading(false);
    }
  }

  const renderMain = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order time</th>
            <th>Menu</th>
            <th>Entree</th>
            <th>Main meal</th>
            <th>Dessert</th>
            <th>Status Order</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.length === 0 && <EmptyData type='table' colSpan={8} />}
          {orders && orders.length > 0 && orders.map((order) => (
            <tr key={order.id}>
              <td>{moment(order.orderTime).format('h:m A DD/MM/YYYY')}</td>
              <td>{`Week ${moment(order?.menu?.week).format('w')}`}</td>
              <td>{order && order.entree && order.entree.name ? `${order.entree.name} (${order.entree.ordered})` : ''}</td>
              <td>{order && order.mainMeal && order.mainMeal.name ? `${order.mainMeal.name} (${order.mainMeal.ordered})` : ''}</td>
              <td>{order && order.dessert && order.dessert.name ? `${order.dessert.name} (${order.dessert.ordered})` : ''}</td>
              <td>
                {order.statusOrder === STATUS_ORDER.OrderPlaced && <Badge bg="primary">{order.statusOrder}</Badge>}
                {order.statusOrder === STATUS_ORDER.Picking && <Badge bg="warning">{order.statusOrder}</Badge>}
                {order.statusOrder === STATUS_ORDER.Delivery && <Badge bg="info">{order.statusOrder}</Badge>}
                {order.statusOrder === STATUS_ORDER.Delivered && <Badge bg="secondary">{order.statusOrder}</Badge>}
              </td>
              <td>
                {order.statusOrder !== STATUS_ORDER.Picking && <Button variant='primary' onClick={() => onPicking(order)}>Picking</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Header title="Orders Management" />
      {loading && <AppLoading />}
      <Row>
        <Col>
          {renderMain()}
        </Col>
      </Row>
    </Container>
  );
};

export default ListOrders;
