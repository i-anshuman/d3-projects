import React, {Component} from 'react';
import './index.scss';
import ScatterPlot from './plot';
import Tooltip from './tooltip';

class ScatterplotGraph extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.handleDescription = this.handleDescription.bind(this);
  }

  handleDescription = (desc) => {
    this.setState({
      desc
    });
  }

  render () {
    let tooltip = null;
    if (this.state.desc) {
      tooltip = <Tooltip
        name={this.state.desc['name']}
        year={this.state.desc['year']}
        time={this.state.desc['time']}
        nationality={this.state.desc['nationality']}
        allegation={this.state.desc['allegation']}
        x={this.state.desc.coords['x']}
        y={this.state.desc.coords['y']}
      />
    }
    return (
      <section className="wrapper">
        <div className="title">
          <h1 id="title">Doping in Professional Bicycle Racing</h1>
          <h3>35 Fastest times up Alpe d'Huez</h3>
        </div>
        {tooltip}
        <ScatterPlot width={850} height={500} desc={this.handleDescription}/>
      </section>
    );
  }
}

export default ScatterplotGraph;
