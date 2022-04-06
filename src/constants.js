const ROLE = {
  ADMIN: 'Admin',
  MEMBER: 'Member',
  GUEST: 'Guest'
};

const LOCAL_STORAGE = {
  userInformation: 'userInformation',
  userCart: 'userCart'
};

const STATUS_ORDER = {
  OrderPlaced: 'OrderPlaced',
  Picking: 'Picking',
  Delivery: 'Delivery',
  Delivered: 'Delivered'
};

const TYPE_OF_FOOD = {
  entree: 'entree',
  mainMeal: 'mainMeal',
  dessert: 'dessert'
}

const STATUS_MENU = {
  Active: 'Active',
  Inactive: 'Inactive',
  Deleted: 'Deleted'
}

const WEB_SITE_NAME = 'Exercise HEL';

export { ROLE, LOCAL_STORAGE, STATUS_ORDER, TYPE_OF_FOOD, STATUS_MENU, WEB_SITE_NAME };
