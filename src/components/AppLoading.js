import React from 'react';
import { Spinner } from "react-bootstrap";
import IndexStyles from "../styles";

const AppLoading = (props) => {
  const { type } = props;

  let component = (
    <Spinner style={IndexStyles.centering} animation="border" variant="primary" />
  );

  switch (type) {
    case 'button':
      component = (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      );
      break;
    default:
      break;
  }

  return component;
};

export default AppLoading;
