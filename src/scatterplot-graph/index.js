import React, {Component} from 'react';
import './index.scss';
import ScatterPlot from './plot';
import Tooltip from '../bar-graph/tooltip';

class ScatterplotGraph extends Component {
  constructor (props) {
    super(props);
    this.handleDescription = this.handleDescription.bind(this);
  }

  handleDescription = (desc) => {
    this.setState({
      desc
    });
  }

  render () {
    console.log(this.state);
    return (
      <div className="container">
        <div className="wrapper">
          <div className="title">
            <h1 id="title">Doping in Professional Bicycle Racing</h1>
            <h3>35 Fastest times up Alpe d'Huez</h3>
          </div>
          <ScatterPlot width={850} height={500} desc={this.handleDescription}/>
        </div>
      </div>
    );
  }
}

export default ScatterplotGraph;
