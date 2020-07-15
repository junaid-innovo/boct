import React from 'react';
import * as d3 from 'd3';

class PieceSign2 extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.newRef=React.createRef();
  }
  componentDidMount() {
    const data = [35, 10, 15, 35, 40, 10, 70];
    const div = d3.select(this.myRef.current);
    // const div = d3.select('body');
    const width = 100;
    const height = 100;
    // const width = window.innerWidth;
    // const height = window.innerWidth;
    const radius = Math.min(width, height) / 2;
    const colors = d3.scaleOrdinal(d3.schemeSet3);
    // const colorScale = d3.scaleOrdinal([
    //   '#0000ff',
    //   '#e60000',
    //   '#000000',
    //   '#ff6600',
    // ]);
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

    const zeroArc = d3.arc().innerRadius(0).outerRadius(1).cornerRadius(1);
    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius)
      .cornerRadius(radius);
    const hoverArc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius + 30)
      .cornerRadius(radius + 30);
    const labelArc = d3
      .arc()
      .innerRadius(radius / 4)
      .outerRadius(radius);
    const g = svg
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', zeroArc)
      .attr('class', 'arc')
      .style('fill', (d, i) => colors(d.index))
      .style('fill-opacity', 0.7)
      //   .style('stroke', '#11141C')
      .style('stroke-width', 5)
      .on('mouseover', function (d, i) {
        d3.select(this)
          .style('fill-opacity', 1)
          .transition()
          .duration(500)
          .attr('d', hoverArc);
      })
      .on('mouseout', function (d, i) {
        d3.select(this)
          .style('fill-opacity', 0.7)
          .transition()
          .duration(500)
          .attr('d', arc);
      })
      .transition()
      .duration(1000)
      .delay((d, i) => i * 300)
      .attr('d', arc);

    const text = g
      .append('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
      .text((d) => `${d.value}%`)
      .style('font-size', 10)
      .style('font-family', 'cursive')
      //   .style('font-wieght', 800)
      .style('fill', '#FFF')
      .style('fill-opacity', 0)
      .style('text-shadow', '2px 2px #0E0B16')
      .style('text-anchor', 'middle')
      .transition()
      .duration(3000)
      .delay((d, i) => i * 300)
      .style('fill-opacity', 1);

      const legsvg =d3.select(this.props.legref.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      //   .attr('class','arc')
      .attr('transform', `translate(${width / 2},${height / 15})`);
    var legendG = legsvg
      .selectAll('.legends')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('transform', function (d, i) {
        return 'translate(' + width * 0.1 + ',' + (i * 15 + 20) + ')';
      })
      .attr('class', 'legend');

    legendG
      .append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', function (d, i) {
        return colors(i);
      });

    legendG
      .append('text')
      .text(function (d) {
        return d.value + '  ';
      })
      .style('font-size', 12)
      .attr('y', 10)
      .attr('x', 11);
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-6">
            <div ref={this.props.legref}></div>
        </div>
        <div className="col-md-6">
          <div ref={this.myRef}></div>
        </div>
      </div>
    );
  }
}

export default PieceSign2;

// const arc = d3
//   .arc()
//   .outerRadius(radius * 0.75)
//   .innerRadius(radius);
// //   .startAngle(  Math.PI)
// //   .startAngle(-0.5 * Math.PI)
// //   .endAngle(0.5 * Math.PI);
// const hoverArc = d3
//   .arc()
//   .outerRadius(radius * 0.85)
//   .innerRadius(radius * 1.1);
// const g = svg
//   .selectAll('.arc')
//   .data(pie(data))
//   .enter()
//   .append('g')
//   .attr('class', 'arc');
// g.append('path')
//   .attr('d', arc)
//   .attr('class', 'arc')
//   .style('fill', (d, i) => colors(d.index))
// //   .style('fill-opacity', 0.7)
//   .style('stroke', '#11141C')
//   .style('stroke-width', 0.5)
//   .on('mouseover', function (d, i) {
//     d3.select(this)
//     //   .style('fill-opacity', 1)
//       .transition()
//       .duration(500)
//       .attr('d', hoverArc);
//   })
//   .on('mouseout', function (d, i) {
//     d3.select(this)
//     //   .style('fill-opacity', 0.7)
//       .transition()
//       .duration(500)
//       .attr('d', arc);
//   });

// g.append('text')
//   .attr('transform', (d) => `translate(${arc.centroid(d)})`)
//   .text((d) => d.value)
//   .style('font-size', 10)
//   .style('font-wieght', 800)
//   .style('fill', '#FFF')
//   .style('text-anchor', 'middle')
//   .style('text-shadow', '2px 2px #0E0B16');
