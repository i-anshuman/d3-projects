import React, {Component} from 'react';
import Graph from './graph';
import Tooltip from './tooltip';
import './index.scss';

class BarGraph extends Component {
  constructor (props) {
    super(props);
    this.state = {
      data : null
    };
    this.handleGDPData = this.handleGDPData.bind(this);
    this.calculateQuarter = this.calculateQuarter.bind(this);
  }

  handleGDPData = (data) => {
    this.setState({data});
  }

  calculateQuarter = (month) => {
    if (month < 3) {
      return 'Q1';
    }
    else if (month < 6) {
      return 'Q2';
    }
    else if (month < 9) {
      return 'Q3';
    }
    else {
      return 'Q4';
    }
  }

  render () {
    let tooltip = null;
    if (this.state.data) {
      const date = new Date(this.state.data['year']);
      tooltip = <Tooltip
        date={this.state.data['year']}
        year={date.getFullYear()}
        quarter={this.calculateQuarter(date.getMonth())}
        gdp={this.state.data['gdp']}
        positionX={`${this.state.data.index * 2.9091}px`}
      />
    }

    return (
      <div className="container">
        <section className="wrapper">
          <h1 id="title" className="title">United States GDP </h1>
          {tooltip}
          <Graph width={800} height={400} dataGDP={this.handleGDPData}/>
          <span className="caption">
            More Information:&nbsp;
            <a href="http://www.bea.gov/national/pdf/nipaguid.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              http://www.bea.gov/national/pdf/nipaguid.pdf
            </a>
          </span>
        </section>
      </div>
    );
  }
}

export default BarGraph;
