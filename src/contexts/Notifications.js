import React from 'react';

const NotificationsContext = React.createContext({
  message: '',
  type: 'success'
});

export default NotificationsContext;
