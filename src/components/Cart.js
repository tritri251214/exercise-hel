import { API, graphqlOperation } from 'aws-amplify';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, CloseButton, Button, Form, Card } from 'react-bootstrap';
import { STATUS_ORDER, TYPE_OF_FOOD } from '../constants';
import NotificationsContext from '../contexts/Notifications';
import { createOrder } from '../graphql/mutations';
import IndexStyles from '../styles';
import { changeNumberOfFoodInCart, getCart, getUserInformation } from '../util';
import AppLoading from './AppLoading';
import EmptyData from './EmptyData';
import Header from './Header';

const Cart = (props) => {
  const notifications = useContext(NotificationsContext);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listAddress, setListAddress] = useState([]);
  const [userInformation, setUserInformation] = useState(null);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function reload() {
    try {
      const userCart = getCart();
      setFoods(userCart);
      const result = getUserInformation();
      if (result) {
        const userInformationAddress = [result.address1, result.address2, result.address3];
        setListAddress(userInformationAddress);
        setUserInformation(result);
      }
    } catch (error) {
      console.log('reload error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
    }
  }

  const onChangeNumberOfFood = (event, food) => {
    let newFood = {...food};
    newFood.order = event.target.value;
    const result = changeNumberOfFoodInCart(newFood);
    if (result.status !== 200) {
      notifications({ message: result.message, type: 'error' });
    } else {
      setFoods((cur) => {
        let newCur = [...cur];
        const index = newCur.findIndex(item => item.name === newFood.name);
        if (index > -1) {
          newCur[index] = newFood;
        }
        return newCur;
      });
      notifications({ message: result.message, type: 'success' });
    }
  }

  const onBuyNow = async () => {
    try {
      let entree = null; let mainMeal = null; let dessert = null;
      foods.map(food => {
        switch (food.typeOfFood) {
          case TYPE_OF_FOOD.entree:
            entree = {
              name: food.name,
              quantity: food.quantity,
              remaining: food.remaining
            };
            break;
          case TYPE_OF_FOOD.mainMeal:
            mainMeal = {
              name: food.name,
              quantity: food.quantity,
              remaining: food.remaining
            };
            break;
          case TYPE_OF_FOOD.dessert:
            dessert = {
              name: food.name,
              quantity: food.quantity,
              remaining: food.remaining
            };
            break;
          default:
            break;
        }
      });

      const formData = {
        userID: userInformation.userID,
        menuID: '',
        orderTime: moment(),
        entree,
        mainMeal,
        dessert,
        status: STATUS_ORDER.OrderPlaced
      };
      const response = await API.graphql(graphqlOperation(createOrder, { input: formData }));
      if (response?.data?.createOrder) {
        notifications({ message: 'Add order successfully, please check email to see status of the order' });
      }
    } catch (error) {
      console.log('onBuyNow error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
    }
  }

  const renderCardFood = (food) => {
    if (!food) {
      return null;
    }

    return (
      <Card style={{ width: '18rem' }} className="mt-3">
        <Card.Body>
          <Card.Title>
            {food.name}
            <CloseButton style={IndexStyles.closeButton} />
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{food.typeOfFood}</Card.Subtitle>
          <Form.Control
              type="number"
              id="numberOfFood"
              value={food.order}
              onChange={(event) => onChangeNumberOfFood(event, food)}
              min={1}
              max={food.remaining}
            />
        </Card.Body>
      </Card>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Header title="Cart" />
      {loading && <AppLoading />}
      <Row>
        <Col md={3}>
        {
          foods && foods.length > 0 ? foods.map((food) => (
            renderCardFood(food)
          )) : <EmptyData />
        }
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col>
          <div className="mb-3">
            {listAddress && listAddress.length > 0 && listAddress.map((address, index) => (
              <Form.Check
                inline
                label={address}
                name="address"
                type="radio"
                id={`rad-${index}`}
              />
            ))}
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="primary" onClick={onBuyNow}>Buy now</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
