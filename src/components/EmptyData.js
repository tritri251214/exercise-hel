import React from 'react';

const TEXT = 'No data';

const EmptyData = (props) => {
  const { type } = props;
  let component = <p className="text-center">{TEXT}</p>;
  switch (type) {
    case 'table':
      component = (
        <tr>
          <td colSpan={props.colSpan} className="text-center">{TEXT}</td>
        </tr>
      );
      break;
    default:
      break;
  }
  return component;
};

export default EmptyData;
