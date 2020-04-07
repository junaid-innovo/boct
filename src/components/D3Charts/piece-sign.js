import React from 'react';
import * as d3 from 'd3';

class PieceSign extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  componentDidMount() {
    const data = [35, 10, 15, 35];
    const div = d3.select(this.myRef.current);
    const width = 100;
    const height = 100;
    const radius = Math.min(width, height) / 2;
    const colors = d3.scaleOrdinal(d3.schemeCategory10);
    const colorScale = d3.scaleOrdinal([
      '#0000ff',
      '#e60000',
      '#000000',
      '#ff6600',
    ]);
    const svg = div
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      //   .attr('class','arc')
      .attr('transform', `translate(${width / 2},${height / 2})`);
    const pie = d3
      .pie()
      .value((d) => d)
      .sort(null);
    const arc = d3
      .arc()
      .outerRadius(radius * 0.75)
      .innerRadius(radius);
    //   .startAngle(  Math.PI)
    //   .startAngle(-0.5 * Math.PI)
    //   .endAngle(0.5 * Math.PI);
    const hoverArc = d3
      .arc()
      .outerRadius(radius * 0.85)
      .innerRadius(radius * 1.1);
    const g = svg
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');
    g.append('path')
      .attr('d', arc)
      .attr('class', 'arc')
      .style('fill', (d, i) => colors(d.index))
    //   .style('fill-opacity', 0.7)
      .style('stroke', '#11141C')
      .style('stroke-width', 0.5)
      .on('mouseover', function (d, i) {
        d3.select(this)
        //   .style('fill-opacity', 1)
          .transition()
          .duration(500)
          .attr('d', hoverArc);
      })
      .on('mouseout', function (d, i) {
        d3.select(this)
        //   .style('fill-opacity', 0.7)
          .transition()
          .duration(500)
          .attr('d', arc);
      });

    g.append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .text((d) => d.value)
      .style('font-size', 10)
      .style('font-wieght', 800)
      .style('fill', '#FFF')
      .style('text-anchor', 'middle')
      .style('text-shadow', '2px 2px #0E0B16');
  }

  render() {
    return <div ref={this.myRef}></div>;
  }
}

export default PieceSign;
