import Cart from "./components/Cart";
import DetailMenu from "./components/DetailMenu";
import ErrorPage from "./components/ErrorPage";
import ListFoods from "./components/ListFoods";
import ListMenus from "./components/ListMenus";
import ListOrders from "./components/ListOrders";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";
import { ROLE } from "./constants";

const defineRoutes = [
  {
    path: '/login',
    component: () => <Login />,
    name: 'Login',
    navbar: false,
    permission: [ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST]
  },
  {
    path: '/register',
    component: () => <Register />,
    name: 'Register',
    navbar: false,
    permission: [ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST]
  },
  {
    path: '/food/list',
    component: () => <ListFoods />,
    name: 'Foods',
    navbar: true,
    permission: [ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST]
  },
  {
    path: '/order/list',
    component: () => <ListOrders />,
    isAuthenticated: true,
    name: 'Orders',
    navbar: true,
    permission: [ROLE.ADMIN]
  },
  {
    path: '/menu/list',
    component: () => <ListMenus />,
    name: 'Menus',
    navbar: true,
    permission: [ROLE.ADMIN]
  },
  {
    path: '/menu/add',
    component: () => <DetailMenu />,
    name: 'Detail Menu',
    navbar: false,
    permission: [ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST]
  },
  {
    path: '/profile',
    component: () => <Profile />,
    name: 'Profile',
    navbar: false,
    permission: [ROLE.ADMIN, ROLE.MEMBER]
  },
  {
    path: '/cart',
    component: () => <Cart />,
    name: 'Cart',
    navbar: false,
    permission: [ROLE.ADMIN, ROLE.MEMBER]
  },
  {
    path: '/403',
    component: () => <ErrorPage error={403} />,
    name: 'Unauthorized',
    navbar: false,
    permission: [ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST]
  }
];

function getRoutes(role) {
  let routes = [];
  if (role) {
    routes = defineRoutes.reduce((arr, cur) => {
      if (cur.permission.indexOf(role) !== -1) {
        arr.push(cur);
      }
      return arr;
    }, []);
  } else {
    routes = defineRoutes.reduce((arr, cur) => {
      if (cur.permission.indexOf(ROLE.GUEST) !== -1) {
        arr.push(cur);
      }
      return arr;
    }, []);
  }

  return routes;
};

export default getRoutes;