import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { STATUS_MENU } from '../constants';
import NotificationsContext from '../contexts/Notifications';
import AppLoading from './AppLoading';
import Header from './Header';
import moment from 'moment';
import { API, graphqlOperation } from 'aws-amplify';
import { getMenu, getMenuByStatusMenu } from '../graphql/queries';
import { createMenu, updateMenu } from '../graphql/mutations';
import { useParams, useHistory } from 'react-router-dom';
import { handleException } from '../util';

const currentWeek = moment().week();

const DetailMenu = () => {
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const notifications = useContext(NotificationsContext);
  const [selectedStatusMenu, setSelectedStatusMenu] = useState(STATUS_MENU.Inactive);
  const [selectedWeek, setSelectedWeek] = useState(undefined);
  const [menu, setMenu] = useState(null);
  const { menuID } = useParams();
  const [dialogWarning, setDialogWarning] = useState(false);
  const history = useHistory();

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function reload() {
    try {
      if (menuID) {
        const data = await getDetailMenu();
        setMenu(data);
        setSelectedWeek(moment(data.week).format('w'));
        setSelectedStatusMenu(data.statusMenu);
      }
    } catch (error) {
      await handleException(error);
      console.log('reload error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
    }
  }

  async function getDetailMenu() {
    try {
      setLoading(true);
      const response = await API.graphql(graphqlOperation(getMenu, { id: menuID }));
      setLoading(false);
      return response.data.getMenu;
    } catch (error) {
      await handleException(error);
      console.log('getDetailMenu error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
      setLoading(false);
      return [];
    }
  }

  const onChangeSelectWeek = (event) => {
    setSelectedWeek(event.target.value);
  }

  const onChangeSelectStatusMenu = (event) => {
    setSelectedStatusMenu(event.target.value);
  }

  const handleChangeFood = (event, typeOfFood, field) => {
    let updateMenu = {...menu};
    if (updateMenu[typeOfFood]) {
      updateMenu[typeOfFood][field] = event.target.value;
    } else {
      updateMenu[typeOfFood] = {
        [field]: event.target.value,
      };
    }
    setMenu(updateMenu);
  }

  const handleSubmit = async () => {
    try {
      if (selectedStatusMenu === STATUS_MENU.Active) {
        const existed = await existsActiveOfWeek();
        if (existed) {
          openDialogWarning();
          return;
        }
      }
      setLoadingSubmit(true);
      let formData = {
        week: moment().week(selectedWeek).toISOString(),
        entree: menu.entree,
        mainMeal: menu.mainMeal,
        dessert: menu.dessert,
        statusMenu: selectedStatusMenu
      };
      if (menuID) {
        formData.id = menuID;
      } else {
        formData.entree.ordered = 0;
        formData.mainMeal.ordered = 0;
        formData.dessert.ordered = 0;
      }
      const response = await API.graphql(graphqlOperation(menuID ? updateMenu : createMenu, { input: formData }));
      if (response.data) {
        notifications({ message: 'Save menu catalogue successfully', type: 'success' });
        if (!menuID) {
          history.push(`/menu/detail/${response.data.createMenu.id}`);
        }
      }
      setLoadingSubmit(false);
    } catch (error) {
      await handleException(error);
      console.log('handleSubmit error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
      setLoadingSubmit(false);
    }
  }

  const existsActiveOfWeek = async () => {
    try {
      const response = await API.graphql(graphqlOperation(getMenuByStatusMenu, { statusMenu: STATUS_MENU.Active }));
      const menus = response?.data?.getMenuByStatusMenu?.items;
      const index = menus.findIndex(item => {
        const formatWeek = moment(item.week).format('w');
        if ((formatWeek === selectedWeek) && (item.status === STATUS_MENU.Active) && (item.id !== menuID)) {
          return item;
        }
      });

      if (index > -1) {
        return true;
      }
      return false;
    } catch (error) {
      await handleException(error);
      console.log('getStatusOfWeek error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
    }
  }

  function openDialogWarning() {
    setDialogWarning(true);
  }

  function handleCloseModal() {
    setDialogWarning(false);
  }

  const renderModalWarning = () => {
    return (
      <Modal show={dialogWarning} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Sorry, The first, you must change <b>Inactive</b> all menu that have week same as this week</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const renderMain = () => {
    let selectWeek = [];
    for (let i = currentWeek; i <= (currentWeek + 5); i++) {
      selectWeek.push({
        text: `Week ${i}`,
        value: i
      });
    }

    let selectStatus = [];
    for (const status in STATUS_MENU) {
      if (Object.hasOwnProperty.call(STATUS_MENU, status)) {
        selectStatus.push(status);
      }
    }

    return (
      <Form>
        <Form.Group className="mb-3" controlId="selWeek">
          <Form.Label>Week</Form.Label>
          <Form.Select aria-label="Select week" value={selectedWeek} onChange={onChangeSelectWeek}>
            <option>---Select week---</option>
            {selectWeek.map(week => (
              <option key={week.value} value={week.value}>{week.text}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="txtEntree">
          <Form.Label>Entree</Form.Label>
          <Row>
            <Col>
              <Form.Control type="text" placeholder="Enter entree" value={menu?.entree?.name} onChange={(event) => handleChangeFood(event, 'entree', 'name')} disabled={menuID} />
            </Col>
            <Col md={2}>
              <Form.Control type="number" min={1} max={100} placeholder="Enter quantity" value={menu?.entree?.quantity} onChange={(event) => handleChangeFood(event, 'entree', 'quantity')} disabled={menuID} />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3" controlId="txtMainMeal">
          <Form.Label>Main meal</Form.Label>
          <Row>
            <Col>
              <Form.Control type="text" placeholder="Enter main meal" value={menu?.mainMeal?.name} onChange={(event) => handleChangeFood(event, 'mainMeal', 'name')} disabled={menuID} />
            </Col>
            <Col md={2}>
              <Form.Control type="number" min={1} max={100} placeholder="Enter quantity" value={menu?.mainMeal?.quantity} onChange={(event) => handleChangeFood(event, 'mainMeal', 'quantity')} disabled={menuID} />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3" controlId="txtDessert">
          <Form.Label>Dessert</Form.Label>
          <Row>
            <Col>
              <Form.Control type="text" placeholder="Enter dessert" value={menu?.dessert?.name} onChange={(event) => handleChangeFood(event, 'dessert', 'name')} disabled={menuID} />
            </Col>
            <Col md={2}>
              <Form.Control type="number" min={1} max={100} placeholder="Enter quantity" value={menu?.dessert?.quantity} onChange={(event) => handleChangeFood(event, 'dessert', 'quantity')} disabled={menuID} />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3" controlId="selStatus">
          <Form.Label>Status</Form.Label>
          <Form.Select aria-label="Select status" value={selectedStatusMenu} onChange={onChangeSelectStatusMenu} disabled={!menuID}>
            {selectStatus.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" onClick={handleSubmit}>
          {loadingSubmit ? <AppLoading type="button" /> : 'Submit a menu catalogue'}
        </Button>
      </Form>
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
      {renderModalWarning()}
    </Container>
  );
};

export default DetailMenu;
