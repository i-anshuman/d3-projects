import React, {Component} from 'react';
import './index.scss';
import Map from './map';
import Tooltip from './tooltip';

class HeatMap extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.handleData = this.handleData.bind(this);
  }

  handleData = (data) => {
    this.setState({
      data
    });
  }

  render () {
    let tooltip = null;
    if (this.state.data) {
      tooltip = <Tooltip
        month={this.state.data['month']}
        year={this.state.data['year']}
        temp={this.state.data['temperature']}
        variance={this.state.data['variance']}
        x={this.state.data.coords['x']}
        y={this.state.data.coords['y']}
      />
    }
    return (
      <section className="wrapper">
        <header id="title">
          <h1>Monthly Global Land-Surface Temperature</h1>
          <h3 id="description">1753 - 2015: base temperature 8.66℃</h3>
        </header>
        {tooltip}
        <Map width={1603} height={540} data={this.handleData}/>
      </section>
    );
  }
}

export default HeatMap
