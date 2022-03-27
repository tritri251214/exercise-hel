/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserAddress = /* GraphQL */ `
  query GetUserAddress($id: ID!) {
    getUserAddress(id: $id) {
      id
      userID
      email
      address1
      address2
      address3
      createdAt
      updatedAt
    }
  }
`;
export const listUserAddresses = /* GraphQL */ `
  query ListUserAddresses(
    $filter: ModelUserAddressFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserAddresses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        email
        address1
        address2
        address3
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMenu = /* GraphQL */ `
  query GetMenu($id: ID!) {
    getMenu(id: $id) {
      id
      week
      entree {
        name
        quantity
        remaining
      }
      mainMeal {
        name
        quantity
        remaining
      }
      dessert {
        name
        quantity
        remaining
      }
      status
      createdAt
      updatedAt
    }
  }
`;
export const listMenus = /* GraphQL */ `
  query ListMenus(
    $filter: ModelMenuFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMenus(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        week
        entree {
          name
          quantity
          remaining
        }
        mainMeal {
          name
          quantity
          remaining
        }
        dessert {
          name
          quantity
          remaining
        }
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getOrder = /* GraphQL */ `
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
      id
      userID
      menuID
      orderTime
      entree {
        name
        quantity
        remaining
      }
      mainMeal {
        name
        quantity
        remaining
      }
      dessert {
        name
        quantity
        remaining
      }
      status
      deliveryAddress
      menu {
        id
        week
        entree {
          name
          quantity
          remaining
        }
        mainMeal {
          name
          quantity
          remaining
        }
        dessert {
          name
          quantity
          remaining
        }
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      orderMenuId
    }
  }
`;
export const listOrders = /* GraphQL */ `
  query ListOrders(
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        menuID
        orderTime
        entree {
          name
          quantity
          remaining
        }
        mainMeal {
          name
          quantity
          remaining
        }
        dessert {
          name
          quantity
          remaining
        }
        status
        deliveryAddress
        menu {
          id
          week
          status
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        orderMenuId
      }
      nextToken
    }
  }
`;
export const getUserByEmail = /* GraphQL */ `
  query GetUserByEmail(
    $email: String!
    $userID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserAddressFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getUserByEmail(
      email: $email
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userID
        email
        address1
        address2
        address3
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
