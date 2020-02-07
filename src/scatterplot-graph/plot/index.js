import React, {Component} from 'react';
import './index.scss';
import * as d3 from 'd3';

class ScatterPlot extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.drawScatterPlot = this.drawScatterPlot.bind(this);
  }

  drawScatterPlot = (dataset, width, height) => {
    const svg = d3.select(this.ref.current)
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    const padding = 35;
    const years = dataset.map(d => {
      const date = new Date();
      date.setFullYear(d.Year);
      return [d.Year, date];
    });
    const times = dataset.map(d => {
      const date = new Date();
      date.setMinutes(d.Time.slice(0,2));
      date.setSeconds(d.Time.slice(3));
      return date;
    });

    const minYear = new Date(`${d3.min(years)[0]-1}`);
    const maxYear = new Date(`${d3.max(years)[0]+1}`);

    const xScale = d3.scaleTime()
                     .domain([minYear, maxYear])
                     .range([padding, width-padding]);

    const yScale = d3.scaleTime()
                    .domain([d3.min(times), d3.max(times)])
                    .range([padding, height-padding]);

    const xAxis = d3.axisBottom().scale(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

    svg.selectAll('circle')
       .data(dataset)
       .enter()
       .append('circle')
       .attr('cx', (d, i) => xScale(years[i][1]))
       .attr('cy', (d, i) => yScale(times[i]))
       .attr('r', 6)
       .attr('data-xvalue', d => d.Year)
       .attr('data-yvalue', d => d.Time)
       .attr('class', 'dot')
       .style('fill', d => d.Doping !== '' ? 'rgba(31, 119, 180, 0.7)' : 'rgba(255, 127, 14, 0.7)')
       .on('mouseover', (d, i) => {
          this.props.desc({
            name: d.Name,
            year: d.Year,
            time: d.Time,
            nationality: d.Nationality,
            allegation: d.Doping,
            coords: {
              x: xScale(years[i][1]),
              y: yScale(times[i])
            }
          });
       })
       .on('mouseleave', () => {
          this.props.desc(null);
       });

    svg.append('g')
       .attr('transform', `translate(0, ${height-padding})`)
       .attr('id', 'x-axis')
       .call(xAxis);

    svg.append('g')
       .attr('transform', `translate(${padding}, 0)`)
       .attr('id', 'y-axis')
       .call(yAxis);
  }

  componentDidMount() {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
      .then(res => res.json())
      .then(
        (result) => {
          this.drawScatterPlot(result, this.props.width, this.props.height);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  render () {
    return (
      <div className="scatterplot" ref={this.ref} id="scatterPlot" />
    );
  }
}

export default ScatterPlot;
