import React from 'react';
import './index.scss';

const Tooltip = (props) => {
  return (
    <div id="tooltip" className="tooltip" data-date={props.year} style={{
        transform: `translateX(${props.x + 4}px) translateY(${props.y + 4}px)`
    }}>
      <span>{props.name}: {props.nationality}</span>
      <span>Year: {props.year}, Time: {props.time}</span>
      {props.allegation !== '' && <span>{props.allegation}</span>}
    </div>
  );
}

export default Tooltip;
