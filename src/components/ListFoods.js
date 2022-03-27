import { API, graphqlOperation } from 'aws-amplify';
import React, { useContext, useEffect, useState } from 'react';
import NotificationsContext from '../contexts/Notifications';
import { listMenus } from '../graphql/queries';
import { Button, Card, Col, Container, Row, Badge } from 'react-bootstrap';
import AppLoading from './AppLoading';
import EmptyData from './EmptyData';
import Header from './Header';
import IndexStyles from '../styles';
import { addItemToCart } from '../util';
import { TYPE_OF_FOOD } from '../constants';

const dataFoods = [
  {
    name: 'Food 1',
    quantity: 20,
    remaining: 5,
    typeOfFood: TYPE_OF_FOOD.entree,
  },
  {
    name: 'Food 2',
    quantity: 20,
    remaining: 5,
    typeOfFood: TYPE_OF_FOOD.mainMeal,
  },
  {
    name: 'Food 3',
    quantity: 20,
    remaining: 5,
    typeOfFood: TYPE_OF_FOOD.dessert,
  }
];

const ListFoods = () => {
  const [foods, setFoods] = useState(dataFoods);
  const [loading, setLoading] = useState(false);
  const notifications = useContext(NotificationsContext);

  useEffect(() => {
    // reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function reload() {
    try {
      const data = await getFoodsInWeek();
      setFoods(data);
    } catch (error) {
      console.log('error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
    }
  }

  async function getFoodsInWeek() {
    try {
      setLoading(true);
      const response = await API.graphql(graphqlOperation(listMenus));
      const dataListMenus = response.data.listMenus.items;
      console.log(dataListMenus);
      // dataListMenus.find(item => {
      //   if (item.week) {

      //   }
      // });
      setLoading(false);
      return response.data.listMenus.items;
    } catch (error) {
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

  const renderCardFood = (food) => {
    return (
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{food.name} <Badge bg="primary" style={IndexStyles.badge}>{food.remaining}</Badge></Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{food.typeOfFood}</Card.Subtitle>
          <Button variant="primary" onClick={() => onAddItemToCart(food)}>Add to cart</Button>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container fluid className="mt-4">
      <Header title="Foods Management" />
      {loading && <AppLoading />}
      <Row>
        {
          foods && foods.length > 0 ? foods.map((food) => (
            <Col key={food.name}>
              {renderCardFood(food)}
            </Col>
          )) : <EmptyData />
        }
      </Row>
    </Container>
  );
};

export default ListFoods;
