/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const runPrepareFoods = /* GraphQL */ `
  mutation RunPrepareFoods($data: AWSJSON) {
    runPrepareFoods(data: $data)
  }
`;
export const sendMailErrorToAdmin = /* GraphQL */ `
  mutation SendMailErrorToAdmin($data: AWSJSON) {
    sendMailErrorToAdmin(data: $data)
  }
`;
export const createUserAddress = /* GraphQL */ `
  mutation CreateUserAddress(
    $input: CreateUserAddressInput!
    $condition: ModelUserAddressConditionInput
  ) {
    createUserAddress(input: $input, condition: $condition) {
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
export const updateUserAddress = /* GraphQL */ `
  mutation UpdateUserAddress(
    $input: UpdateUserAddressInput!
    $condition: ModelUserAddressConditionInput
  ) {
    updateUserAddress(input: $input, condition: $condition) {
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
export const deleteUserAddress = /* GraphQL */ `
  mutation DeleteUserAddress(
    $input: DeleteUserAddressInput!
    $condition: ModelUserAddressConditionInput
  ) {
    deleteUserAddress(input: $input, condition: $condition) {
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
export const createMenu = /* GraphQL */ `
  mutation CreateMenu(
    $input: CreateMenuInput!
    $condition: ModelMenuConditionInput
  ) {
    createMenu(input: $input, condition: $condition) {
      id
      week
      entree {
        name
        quantity
        ordered
      }
      mainMeal {
        name
        quantity
        ordered
      }
      dessert {
        name
        quantity
        ordered
      }
      statusMenu
      createdAt
      updatedAt
    }
  }
`;
export const updateMenu = /* GraphQL */ `
  mutation UpdateMenu(
    $input: UpdateMenuInput!
    $condition: ModelMenuConditionInput
  ) {
    updateMenu(input: $input, condition: $condition) {
      id
      week
      entree {
        name
        quantity
        ordered
      }
      mainMeal {
        name
        quantity
        ordered
      }
      dessert {
        name
        quantity
        ordered
      }
      statusMenu
      createdAt
      updatedAt
    }
  }
`;
export const deleteMenu = /* GraphQL */ `
  mutation DeleteMenu(
    $input: DeleteMenuInput!
    $condition: ModelMenuConditionInput
  ) {
    deleteMenu(input: $input, condition: $condition) {
      id
      week
      entree {
        name
        quantity
        ordered
      }
      mainMeal {
        name
        quantity
        ordered
      }
      dessert {
        name
        quantity
        ordered
      }
      statusMenu
      createdAt
      updatedAt
    }
  }
`;
export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
      id
      userID
      menuID
      orderTime
      entree {
        name
        quantity
        ordered
      }
      mainMeal {
        name
        quantity
        ordered
      }
      dessert {
        name
        quantity
        ordered
      }
      statusOrder
      deliveryAddress
      menu {
        id
        week
        entree {
          name
          quantity
          ordered
        }
        mainMeal {
          name
          quantity
          ordered
        }
        dessert {
          name
          quantity
          ordered
        }
        statusMenu
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      orderMenuId
    }
  }
`;
export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
      id
      userID
      menuID
      orderTime
      entree {
        name
        quantity
        ordered
      }
      mainMeal {
        name
        quantity
        ordered
      }
      dessert {
        name
        quantity
        ordered
      }
      statusOrder
      deliveryAddress
      menu {
        id
        week
        entree {
          name
          quantity
          ordered
        }
        mainMeal {
          name
          quantity
          ordered
        }
        dessert {
          name
          quantity
          ordered
        }
        statusMenu
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      orderMenuId
    }
  }
`;
export const deleteOrder = /* GraphQL */ `
  mutation DeleteOrder(
    $input: DeleteOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    deleteOrder(input: $input, condition: $condition) {
      id
      userID
      menuID
      orderTime
      entree {
        name
        quantity
        ordered
      }
      mainMeal {
        name
        quantity
        ordered
      }
      dessert {
        name
        quantity
        ordered
      }
      statusOrder
      deliveryAddress
      menu {
        id
        week
        entree {
          name
          quantity
          ordered
        }
        mainMeal {
          name
          quantity
          ordered
        }
        dessert {
          name
          quantity
          ordered
        }
        statusMenu
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      orderMenuId
    }
  }
`;
