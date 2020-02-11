import React, {Component} from 'react';
import './index.scss';
import * as d3 from 'd3';

class Map extends Component {
  constructor (props) {
    super(props);
    this.ref = React.createRef();
    this.draw = this.draw.bind(this);
  }

  draw = (dataset, width, height) => {
    const padding = {
      top: 15,
      right: 120,
      bottom: 120,
      left: 120
    };

    const inner = {
      width: width - padding.left - padding.right,
      height: height - padding.top - padding.bottom
    };

    const temperatures = dataset.monthlyVariance.map(d => d.variance + dataset.baseTemperature);

    const colors = ['#a50026','#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4','#313695'];

    const svg = d3.select(this.ref.current)
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    const xScale = d3.scaleBand()
                     .domain(dataset.monthlyVariance.map(d => d.year))
                     .range([padding.left, width-padding.right]);

    const yScale = d3.scaleBand()
                     .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
                     .range([padding.top, height-padding.bottom])

    const xAxis = d3.axisBottom(xScale)
                    .tickValues(xScale.domain().filter(d => d % 10 === 0));

    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(month => {
                      const d = new Date();
                      d.setUTCMonth(month);
                      return d3.timeFormat('%B')(d);
                    });

    const threshold = d3.scaleQuantize()
                        .domain([d3.min(temperatures), d3.max(temperatures)])
                        .range(colors.reverse());

    svg.append('g')
       .attr('id', 'x-axis')
       .attr('transform', `translate(0, ${height-padding.bottom})`)
       .call(xAxis);

    svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${padding.left}, 0)`)
      .call(yAxis);

    svg.append('text')
       .attr('x', -1*padding.top*16)
       .attr('y', padding.left/2)
       .attr('transform', 'rotate(-90)')
       .text('Months');

    svg.append('text')
       .attr('x', width/2)
       .attr('y', inner.height+padding.top*4)
       .text('Years');

    const legend = svg.append('g')
                      .attr('id', 'legend')
                      .attr('class', 'legend')
                      .attr('transform', `translate(${width/8}, ${inner.height+padding.top*5})`);

    const legendThreshold = d3.scaleThreshold()
                              .domain(((min, max, count) => {
                                let array = [];
                                let step = (max-min)/count;
                                for(let i = 1; i < count; i++) {
                                  array.push(min + i*step);
                                }
                                return array;
                              })(d3.min(temperatures), d3.max(temperatures), colors.length))
                              .range(colors);

    const legendScale = d3.scaleLinear()
                          .domain([d3.min(temperatures), d3.max(temperatures)])
                          .range([0, 400])

    const legendAxis = d3.axisBottom(legendScale)
                         .tickValues(legendThreshold.domain())
                         .tickFormat(d3.format(".1f"));

    legend.append('g')
       .attr('id', 'legend-axis')
       .attr('transform', `translate(0, 30)`)
       .call(legendAxis);

    legend.selectAll('rect')
          .data(legendThreshold.domain())
          .enter()
          .append('rect')
          .attr('x', (d, i) => 40*i)
          .attr('width', 40)
          .attr('height', 30)
          .attr('fill', d => threshold(d))

    svg.append('g')
       .attr('class', 'map')
       .selectAll('rect')
         .data(dataset.monthlyVariance)
         .enter()
         .append('rect')
         .attr('x', d => xScale(d.year)+1)
         .attr('y', d => yScale(d.month-1)+1)
         .attr('width', Math.floor(inner.width/(dataset.monthlyVariance.length/12)))
         .attr('height', Math.floor(inner.height/12))
         .attr('fill', (d,i) => threshold(temperatures[i]))
         .attr('data-year', d => d.year)
         .attr('data-month', d => d.month-1)
         .attr('data-temp', (d,i) => temperatures[i])
         .attr('class', 'cell')
         .on('mouseover', (d, i) => {
           const date = new Date();
           date.setUTCMonth(d.month-1);
           const month = d3.timeFormat('%B')(date);
           this.props.data({
             year: d.year,
             month: month,
             variance: d.variance.toFixed(1),
             temperature: temperatures[i].toFixed(1),
             coords: {
               x: d3.event.pageX,
               y: d3.event.pageY
             }
           });
         })
         .on('mouseleave', d => {
           this.props.data(null)
         });
  }

  componentDidMount() {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
      .then(res => res.json())
      .then(
        (result) => {
          this.draw(result, this.props.width, this.props.height);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  render () {
    return (
      <div className="heatmap" ref={this.ref} id="barGraph" />
    );
  }
}

export default Map;
