import { API, graphqlOperation } from 'aws-amplify';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import NotificationsContext from '../contexts/Notifications';
import { listOrders } from '../graphql/queries';
import AppLoading from './AppLoading';
import EmptyData from './EmptyData';
import Header from './Header';

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
      console.log('error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
      setLoading(false);
      return [];
    }
  }

  const onPicking = () => {
    // TODO
  }

  const renderMain = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order time</th>
            <th>Order by</th>
            <th>Menu</th>
            <th>Entree</th>
            <th>Main meal</th>
            <th>Dessert</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.length === 0 && <EmptyData type='table' colSpan={8} />}
          {orders && orders.length === 0 && orders.map((order) => (
            <tr>
              <td>{order.week}</td>
              <td>{order.entree}</td>
              <td>{order.mainMeal}</td>
              <td>{order.dessert}</td>
              <td>{order.status}</td>
              <td>
                <Button variant='primary' onClick={onPicking}>Picking</Button>
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
