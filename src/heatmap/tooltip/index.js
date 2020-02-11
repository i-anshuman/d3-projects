import React from 'react';
import './index.scss';

const Tooltip = (props) => {
  return (
    <div id="tooltip" className="tooltip" data-year={props.year} style={{
        transform: `translateX(${props.x+4}px) translateY(${props.y+4}px)`
    }}>
      <span>{props.year} - {props.month}</span>
      <span>{props.temp} &deg;C</span>
      <span>{props.variance} &deg;C</span>
    </div>
  );
}

export default Tooltip;
