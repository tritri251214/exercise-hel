import { API, graphqlOperation } from 'aws-amplify';
import React, { useContext, useEffect, useState } from 'react';
import NotificationsContext from '../contexts/Notifications';
import { getMenuByStatusMenu } from '../graphql/queries';
import { Button, Card, Col, Container, Row, Badge } from 'react-bootstrap';
import AppLoading from './AppLoading';
import EmptyData from './EmptyData';
import Header from './Header';
import IndexStyles from '../styles';
import { addItemToCart, handleException } from '../util';
import { STATUS_MENU, TYPE_OF_FOOD } from '../constants';
import moment from 'moment';

const ListFoods = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const notifications = useContext(NotificationsContext);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function reload() {
    try {
      const data = await getMenuOfWeek();
      setMenu(data);
    } catch (error) {
      await handleException(error);
      console.log('error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
    }
  }

  async function getMenuOfWeek() {
    try {
      setLoading(true);
      const response = await API.graphql(graphqlOperation(getMenuByStatusMenu, { statusMenu: STATUS_MENU.Active }));
      const activeMenus = response.data.getMenuByStatusMenu.items;
      const menuOfWeek = activeMenus.find(item => moment().format('w') === moment(item.week).format('w'));
      setLoading(false);
      return menuOfWeek;
    } catch (error) {
      await handleException(error);
      console.log('error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
      setLoading(false);
      return [];
    }
  }

  const onAddItemToCart = (food) => {
    const result = addItemToCart(food);
    if (result.status !== 200) {
      notifications({ message: result.message, type: 'error' });
    } else {
      notifications({ message: result.message, type: 'success' });
    }
  }

  const renderCardFood = (food, typeOfFood) => {
    if (!food) {
      return null;
    }
    let item = {...food};
    item.type = typeOfFood;
    item.menuID = menu.id;

    const remaining = item.quantity - item.ordered;

    return (
      <Card>
        <Card.Body>
          <Card.Title>{item.name} <Badge bg="primary" style={IndexStyles.badge}>{remaining}</Badge></Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{item.type === TYPE_OF_FOOD.mainMeal ? 'main meal' : item.type}</Card.Subtitle>
          <Button variant="primary" size="sm" onClick={() => onAddItemToCart(item)} disabled={remaining === 0}>Add to cart</Button>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container fluid className="mt-4">
      <Header title="Foods Management" />
      {loading && <AppLoading />}
      <Row>
        {menu ? (
          <>
            <Col>
              {renderCardFood(menu.entree, TYPE_OF_FOOD.entree)}
            </Col>
            <Col>
              {renderCardFood(menu.mainMeal, TYPE_OF_FOOD.mainMeal)}
            </Col>
            <Col>
              {renderCardFood(menu.dessert, TYPE_OF_FOOD.dessert)}
            </Col>
          </>
        ) : <EmptyData />}
      </Row>
    </Container>
  );
};

export default ListFoods;
