import { API, graphqlOperation } from "aws-amplify";
import { LOCAL_STORAGE } from "./constants";
import { sendMailErrorToAdmin } from "./graphql/mutations";

export function convertDate(date) {
  let d = new Date(date);
  return d.getHours() + ':' + d.getMinutes() + ', ' + d.getDay() + '/' + d.getMonth() + '/' + d.getFullYear();
}

export function getUserInformation() {
  const userInformation = localStorage.getItem(LOCAL_STORAGE.userInformation);
  return JSON.parse(userInformation);
}

export function setUserInformation(user) {
  localStorage.setItem(LOCAL_STORAGE.userInformation, JSON.stringify(user));
}

export function getCart() {
  let userCart = localStorage.getItem(LOCAL_STORAGE.userCart);
  return JSON.parse(userCart);
}

export function addItemToCart(food) {
  let item = {...food};
  if (!item.order) {
    item.order = 1;
  }
  let userCart = JSON.parse(localStorage.getItem(LOCAL_STORAGE.userCart));
  if (userCart) {
    const index = userCart.findIndex(item => item.name === food.name);
    if (index !== -1) {
      return {
        status: 400,
        message: 'Food existed in Cart, please go to cart to select number of food'
      };
    }
    userCart.push(item);
    localStorage.setItem(LOCAL_STORAGE.userCart, JSON.stringify(userCart));
    return {
      status: 200,
      message: 'Add food to cart successfully'
    };
  } else {
    localStorage.setItem(LOCAL_STORAGE.userCart, JSON.stringify([item]));
    return {
      status: 200,
      message: 'Add food to cart successfully'
    };
  }
}

export function removeItemInCart(food) {
  let userCart = JSON.parse(localStorage.getItem(LOCAL_STORAGE.userCart));
  if (userCart) {
    const index = userCart.findIndex(item => item.name === food.name);
    if (index > -1) {
      userCart.splice(index, 1);
      localStorage.setItem(LOCAL_STORAGE.userCart, JSON.stringify(userCart));
      return {
        status: 200,
        message: 'Remove item successfully'
      }
    }
  } else {
    localStorage.setItem(LOCAL_STORAGE.userCart, JSON.stringify([]));
    return {
      status: 400,
      message: 'Cart empty'
    };
  }
}

export function changeNumberOfFoodInCart(food) {
  let userCart = JSON.parse(localStorage.getItem(LOCAL_STORAGE.userCart));
  if (userCart) {
    const index = userCart.findIndex(item => item.name === food.name);
    if (index > -1) {
      userCart[index] = food;
      localStorage.setItem(LOCAL_STORAGE.userCart, JSON.stringify(userCart));
      return {
        status: 200,
        message: 'Changed number of food'
      };
    } else {
      return {
        status: 400,
        message: 'Not found food'
      };
    }
  } else {
    localStorage.setItem(LOCAL_STORAGE.userCart, JSON.stringify([]));
    return {
      status: 400,
      message: 'Cart empty'
    };
  }
}

export function clearCart() {
  localStorage.removeItem(LOCAL_STORAGE.userCart);
}

export function clearLocalStorage() {
  localStorage.removeItem(LOCAL_STORAGE.userCart);
  localStorage.removeItem(LOCAL_STORAGE.userInformation);
}

export async function handleException(error) {
  if (error && error.errors) {
    await API.graphql(graphqlOperation(sendMailErrorToAdmin, { data: JSON.stringify(error) }));
  }
}