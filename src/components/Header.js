import React from 'react';
import { Col, Row } from 'react-bootstrap';

const Header = (props) => {
  const { title } = props;
  return (
    <Row>
      <Col>
        <h2>{title}</h2>
      </Col>
    </Row>
  );
};

export default Header;
