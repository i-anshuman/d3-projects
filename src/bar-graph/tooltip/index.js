import React from 'react';
import './index.scss';

const Tooltip = (props) => {
  return (
    <div id="tooltip" className="tooltip" data-date={props.date} style={{
        transform: `translateX(${props.positionX})`
    }}>
      <span>{props.year} {props.quarter}</span>
      <span>${props.gdp} Billion</span>
    </div>
  );
}

export default Tooltip;
