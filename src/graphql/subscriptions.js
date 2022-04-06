/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUserAddress = /* GraphQL */ `
  subscription OnCreateUserAddress {
    onCreateUserAddress {
      id
      userID
      email
      name
      address1
      address2
      address3
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUserAddress = /* GraphQL */ `
  subscription OnUpdateUserAddress {
    onUpdateUserAddress {
      id
      userID
      email
      name
      address1
      address2
      address3
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUserAddress = /* GraphQL */ `
  subscription OnDeleteUserAddress {
    onDeleteUserAddress {
      id
      userID
      email
      name
      address1
      address2
      address3
      createdAt
      updatedAt
    }
  }
`;
export const onCreateMenu = /* GraphQL */ `
  subscription OnCreateMenu {
    onCreateMenu {
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
export const onUpdateMenu = /* GraphQL */ `
  subscription OnUpdateMenu {
    onUpdateMenu {
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
export const onDeleteMenu = /* GraphQL */ `
  subscription OnDeleteMenu {
    onDeleteMenu {
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
export const onCreateOrder = /* GraphQL */ `
  subscription OnCreateOrder {
    onCreateOrder {
      id
      userID
      menuID
      userAddressID
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
      userAddress {
        id
        userID
        email
        name
        address1
        address2
        address3
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      orderMenuId
      orderUserAddressId
    }
  }
`;
export const onUpdateOrder = /* GraphQL */ `
  subscription OnUpdateOrder {
    onUpdateOrder {
      id
      userID
      menuID
      userAddressID
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
      userAddress {
        id
        userID
        email
        name
        address1
        address2
        address3
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      orderMenuId
      orderUserAddressId
    }
  }
`;
export const onDeleteOrder = /* GraphQL */ `
  subscription OnDeleteOrder {
    onDeleteOrder {
      id
      userID
      menuID
      userAddressID
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
      userAddress {
        id
        userID
        email
        name
        address1
        address2
        address3
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      orderMenuId
      orderUserAddressId
    }
  }
`;
