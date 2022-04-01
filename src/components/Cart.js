import { API, graphqlOperation } from 'aws-amplify';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, CloseButton, Button, Form, Card } from 'react-bootstrap';
import { STATUS_ORDER, TYPE_OF_FOOD } from '../constants';
import NotificationsContext from '../contexts/Notifications';
import { createOrder, updateMenu } from '../graphql/mutations';
import { getMenu } from '../graphql/queries';
import IndexStyles from '../styles';
import { changeNumberOfFoodInCart, clearCart, getCart, getUserInformation, handleException, removeItemInCart } from '../util';
import AppLoading from './AppLoading';
import EmptyData from './EmptyData';
import Header from './Header';

const Cart = () => {
  const notifications = useContext(NotificationsContext);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listAddress, setListAddress] = useState([]);
  const [userInformation, setUserInformation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingBuyNow, setLoadingBuyNow] = useState(false);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function reload() {
    try {
      setLoading(true);
      const userCart = getCart();
      setFoods(userCart);
      const result = getUserInformation();
      if (result) {
        const userInformationAddress = [result.address1, result.address2, result.address3];
        setListAddress(userInformationAddress);
        setUserInformation(result);
        setSelectedAddress(result.address1);
      }
      setLoading(false);
    } catch (error) {
      await handleException(error);
      console.log('reload error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
      setLoading(false);
    }
  }

  const onChangeNumberOfFood = (event, food) => {
    let newFood = {...food};
    newFood.order = event.target.value;
    if (event.target.value > (newFood.quantity - newFood.ordered)) {
      notifications({ message: 'food limit exceeded', type: 'error' });
      return;
    }

    const result = changeNumberOfFoodInCart(newFood);
    if (result.status !== 200) {
      console.error('onChangeNumberOfFood error: ', result.message);
    } else {
      setFoods((cur) => {
        let newCur = [...cur];
        const index = newCur.findIndex(item => item.name === newFood.name);
        if (index > -1) {
          newCur[index] = newFood;
        }
        return newCur;
      });
      console.log('onChangeNumberOfFood info: ', result.message);
    }
  }

  const onBuyNow = async () => {
    try {
      let entree = null; let mainMeal = null; let dessert = null;
      foods.forEach(food => {
        switch (food.type) {
          case TYPE_OF_FOOD.entree:
            entree = {
              name: food.name,
              quantity: food.quantity,
              ordered: food.order
            };
            break;
          case TYPE_OF_FOOD.mainMeal:
            mainMeal = {
              name: food.name,
              quantity: food.quantity,
              ordered: food.order
            };
            break;
          case TYPE_OF_FOOD.dessert:
            dessert = {
              name: food.name,
              quantity: food.quantity,
              ordered: food.order
            };
            break;
          default:
            break;
        }
      });
      setLoadingBuyNow(true);
      const formData = {
        userID: userInformation.userID,
        menuID: foods[0].menuID,
        userAddressID: userInformation.id,
        orderTime: moment().toISOString(),
        entree,
        mainMeal,
        dessert,
        statusOrder: STATUS_ORDER.OrderPlaced,
        deliveryAddress: selectedAddress
      };
      const response = await API.graphql(graphqlOperation(createOrder, { input: formData }));
      if (response?.data?.createOrder) {
        await updateOrderInMenuTable(response?.data?.createOrder);
        notifications({ message: 'Add order successfully, please check email to see status of the order', type: 'success' });
      }
      clearCart();
      setLoadingBuyNow(false);
      await reload();
    } catch (error) {
      console.log('onBuyNow error: ', error);
      await handleException(error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
      setLoadingBuyNow(false);
    }
  }

  const updateOrderInMenuTable = async (data) => {
    if (!data) {
      console.error('updateOrderInMenuTable empty data');
      return;
    }
    try {
      const resMenu = await API.graphql(graphqlOperation(getMenu, { id: foods[0].menuID }));
      const menuInfo = resMenu.data.getMenu;
      let formData = {
        id: menuInfo.id,
        week: menuInfo.week,
        entree: menuInfo.entree,
        mainMeal: menuInfo.mainMeal,
        dessert: menuInfo.dessert,
        statusMenu: menuInfo.statusMenu
      };
      formData.entree.ordered = data.entree && data.entree.ordered ? menuInfo.entree.ordered + data.entree.ordered : menuInfo.entree.ordered;
      formData.mainMeal.ordered = data.mainMeal && data.mainMeal.ordered ? menuInfo.mainMeal.ordered + data.mainMeal.ordered : menuInfo.mainMeal.ordered;
      formData.dessert.ordered = data.dessert && data.dessert.ordered ? menuInfo.dessert.ordered + data.dessert.ordered : menuInfo.dessert.ordered;
      const response = await API.graphql(graphqlOperation(updateMenu, { input: formData }));
      console.log('updateOrderInMenuTable info: ', response);
    } catch (error) {
      await handleException(error);
      console.log('updateOrderInMenuTable error: ', error);
      if (error && error.errors) {
        notifications({ message: error.errors[0].message, type: 'error' });
      }
    }
  }

  const onChangeRadioAddress = (address) => {
    setSelectedAddress(address);
  }

  const handleRemoveItemCart = async (food) => {
    const result = removeItemInCart(food);
    if (result.status === 200) {
      await reload();
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
            <CloseButton style={IndexStyles.closeButton} onClick={() => handleRemoveItemCart(food)} />
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{food.type}</Card.Subtitle>
          <Form.Control
              type="number"
              id="numberOfFood"
              value={food.order}
              onChange={(event) => onChangeNumberOfFood(event, food)}
              min={1}
              max={food.quantity}
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
            <div key={food.name}>
              {renderCardFood(food)}
            </div>
          )) : <EmptyData />
        }
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col>
          <div className="mb-3">
            {listAddress && listAddress.length > 0 && listAddress.map((address, index) => (
              <Form.Check
                key={address}
                value={address}
                inline
                label={address}
                name="address"
                type="radio"
                id={`rad-${index}`}
                checked={selectedAddress === address}
                onChange={() => onChangeRadioAddress(address)}
              />
            ))}
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="primary" onClick={onBuyNow} size="sm">
            {loadingBuyNow ? <AppLoading type="button" /> : 'Buy now'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
