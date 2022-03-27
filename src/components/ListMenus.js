import { API, graphqlOperation } from 'aws-amplify';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import NotificationsContext from '../contexts/Notifications';
import { listMenus } from '../graphql/queries';
import AppLoading from './AppLoading';
import EmptyData from './EmptyData';
import Header from './Header';

const ListMenus = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const notifications = useContext(NotificationsContext);
  const history = useHistory();

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function reload() {
    try {
      const data = await getListMenus();
      setMenus(data);
    } catch (error) {
      console.log('error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
    }
  }

  async function getListMenus() {
    try {
      setLoading(true);
      const response = await API.graphql(graphqlOperation(listMenus));
      setLoading(false);
      return response.data.listMenus.items;
    } catch (error) {
      console.log('getListMenus error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
      setLoading(false);
      return [];
    }
  }

  const redirectToAddMenu = () => {
    history.push('/menu/add');
  }

  const renderMain = () => {
    return (
      <>
      <Button variant='primary' className="mb-3" onClick={redirectToAddMenu}>Create a Menu Catalogue</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Week</th>
            <th>Entree</th>
            <th>Main meal</th>
            <th>Dessert</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {menus && menus.length === 0 && <EmptyData type='table' colSpan={6} />}
          {menus && menus.length === 0 && menus.map((menu) => (
            <tr>
              <td>{menu.week}</td>
              <td>{menu.entree}</td>
              <td>{menu.mainMeal}</td>
              <td>{menu.dessert}</td>
              <td>{menu.status}</td>
              <td>
                <Button variant='primary'>Edit</Button>
                <Button variant='danger' className="ml-2">Delete</Button>
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
      <Header title="Menu Catalogues Management" />
      {loading && <AppLoading />}
      <Row>
        <Col>
          {renderMain()}
        </Col>
      </Row>
    </Container>
  );
};

export default ListMenus;
