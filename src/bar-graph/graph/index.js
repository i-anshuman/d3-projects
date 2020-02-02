import React, {Component} from 'react';
import './index.scss';
import * as d3 from 'd3';

class Graph extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.drawGraph = this.drawGraph.bind(this);
  }

  drawGraph = (dataset, width, height) => {
    const svg = d3.select(this.ref.current)
                  .append('svg')
                  .attr('width', width+100)
                  .attr('height', height+60);

    const barWidth = width / dataset.length;
    const padding = 55;

    const years = dataset.map(data => new Date(data[0]));
    const gdp = dataset.map(data => data[1]);

    const fromDate = new Date(d3.min(years));
    const toDate = new Date(d3.max(years));
    toDate.setMonth(toDate.getMonth() + 3);

    const xScale = d3.scaleTime()
                      .domain([fromDate, toDate])
                      .range([0, width]);

    const yScale = d3.scaleLinear()
                      .domain([0, d3.max(gdp)])
                      .range([height, padding]);

    const xAxis = d3.axisBottom().scale(xScale);
    const yAxis = d3.axisLeft(yScale);

    const gdpScale = d3.scaleLinear()
                          .domain([0, d3.max(gdp)])
                          .range([padding, height]);

    svg.append('g')
       .attr('transform', `translate(${padding}, ${height})`)
       .attr('id', 'x-axis')
       .call(xAxis);

    svg.append('g')
       .attr('transform', `translate(${padding}, 0)`)
       .attr('id', 'y-axis')
       .call(yAxis);

    svg.selectAll('rect')
       .data(gdp.map(d => gdpScale(d)))
       .enter()
       .append('rect')
       .attr('x', (d, i) => xScale(years[i]))
       .attr('y', (d, i) => height + padding - d)
       .attr('width', barWidth)
       .attr('height', (d) => d-padding)
       .attr('data-date', (d, i) => dataset[i][0])
       .attr('data-gdp', (d, i) => dataset[i][1])
       .attr('class', 'bar')
       .attr('transform', `translate(${padding}, 0)`)
       .on('mouseover', (d, i) => {
         this.props.dataGDP({
           index: i,
           year: dataset[i][0],
           gdp: dataset[i][1]
         });
       })
       .on('mouseleave', () => {
         this.props.dataGDP(null);
       });

    svg.append('text')
      .attr('x', -260)
      .attr('y', 80)
      .attr('transform', 'rotate(-90)')
      .text('Gross Domestic Product');
  }

  componentDidMount() {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
      .then(res => res.json())
      .then(
        (result) => {
          this.drawGraph(result.data, this.props.width, this.props.height);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  render () {
    return (
      <div className="bar-graph" ref={this.ref} id="barGraph" />
    );
  }
}

export default Graph;
