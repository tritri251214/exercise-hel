import { API, graphqlOperation } from 'aws-amplify';
import React, { useContext, useEffect, useState } from 'react';
import { Badge, Button, Col, Container, Row, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import NotificationsContext from '../contexts/Notifications';
import { listMenus } from '../graphql/queries';
import AppLoading from './AppLoading';
import EmptyData from './EmptyData';
import Header from './Header';
import moment from 'moment';
import ConfirmDelete from './ConfirmDelete';
import { updateMenu } from '../graphql/mutations';
import { STATUS_MENU } from '../constants';
import { handleException } from '../util';

const ListMenus = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const notifications = useContext(NotificationsContext);
  const history = useHistory();
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const [infoDelete, setInfoDelete] = useState(null);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function reload() {
    try {
      const data = await getListMenus();
      // console.log('data: ', data);
      setMenus(data);
    } catch (error) {
      await handleException(error);
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
      await handleException(error);
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

  const redirectToEditMenu = (menu) => {
    history.push(`/menu/detail/${menu.id}`);
  }

  function onOpenConfirmDelete(menu) {
    setInfoDelete(menu);
    setDialogConfirm(true);
  }

  function onCloseConfirmDelete() {
    setDialogConfirm(false);
  }

  async function onDeleteMenu() {
    try {
      if (!infoDelete && !infoDelete.id) return;
      let formData = {
        id: infoDelete.id,
        week: infoDelete.week,
        entree: infoDelete.entree,
        mainMeal: infoDelete.mainMeal,
        dessert: infoDelete.dessert,
        statusMenu: STATUS_MENU.Deleted
      };
      setLoading(true);
      const response = await API.graphql(graphqlOperation(updateMenu, { input: formData }));
      if (response && response.data) {
        notifications({ message: 'Deleted menu successfully!', type: 'success' });
        await reload();
        setInfoDelete(null);
      }
      setLoading(false);
      onCloseConfirmDelete();
    } catch (error) {
      await handleException(error);
      console.log('onDeleteMenu error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
      setLoading(false);
    }
  }

  const renderMain = () => {
    return (
      <>
      <Button variant='primary' className="mb-3" onClick={redirectToAddMenu}>Create a Menu Catalogue</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Week</th>
            <th>Entree (ordered/quantity)</th>
            <th>Main meal (ordered/quantity)</th>
            <th>Dessert (ordered/quantity)</th>
            <th>Status Menu</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {menus && menus.length === 0 && <EmptyData type='table' colSpan={6} />}
          {menus && menus.length > 0 && menus.map((menu) => (
            <tr key={menu.id}>
              <td>{`Week ${moment(menu.week).format('w')}`}</td>
              <td>{menu && menu.entree && menu.entree.name ? `${menu.entree.name} (${menu?.entree?.ordered ? menu?.entree?.ordered : '0'}/${menu?.entree?.quantity})` : ''}</td>
              <td>{menu && menu.mainMeal && menu.mainMeal.name ? `${menu.mainMeal.name} (${menu?.mainMeal?.ordered ? menu?.mainMeal?.ordered : '0'}/${menu?.mainMeal?.quantity})` : ''}</td>
              <td>{menu && menu.dessert && menu.dessert.name ? `${menu.dessert.name} (${menu?.dessert?.ordered ? menu?.dessert?.ordered : '0'}/${menu?.dessert?.quantity})` : ''}</td>
              <td>
                <Badge bg={menu.statusMenu === STATUS_MENU.Active ? "success" : (menu.statusMenu === STATUS_MENU.Inactive ? "secondary" : "danger")}>{menu.statusMenu}</Badge>
              </td>
              <td>
                <Button variant='primary' onClick={() => redirectToEditMenu(menu)}>Edit</Button>
                <Button variant='danger' style={{ marginLeft: '0.5rem' }} onClick={() => onOpenConfirmDelete(menu)}>Delete</Button>
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
      <ConfirmDelete
        dialog={dialogConfirm}
        loading={loading}
        handleClose={onCloseConfirmDelete}
        handleSubmit={onDeleteMenu}
      >
        <p>Are you sure want delete <b>Week {infoDelete && infoDelete.week && moment(infoDelete.week).format('w')}</b>?</p>
      </ConfirmDelete>
    </Container>
  );
};

export default ListMenus;
