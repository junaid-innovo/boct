import React, {createRef, Component} from 'react';
import * as d3 from 'd3';

class PieClass extends Component {
  constructor(props) {
    super(props);
    this.myRef = createRef();
    // this.createPie = d3
    //   .pie()
    //   .value(d => d.value)
    //   .sort(null);
    // this.createArc = d3
    //   .arc()
    //   .innerRadius(props.innerRadius)
    //   .outerRadius(props.outerRadius);
    // this.colors = d3.scaleOrdinal(d3.schemeCategory10);
    // this.format = d3.format(".2f");
  }
  // componentDidMount() {
  //   const svg = d3.select(this.ref.current);
  //   const data = this.createPie(this.props.data);
  //   const { width, height, innerRadius, outerRadius } = this.props;

  //   svg
  //     .attr("class", "chart")
  //     .attr("width", width)
  //     .attr("height", height);

  //   const group = svg
  //     .append("g")
  //     .attr("class", "legend")
  //     .attr("transform", `translate(${outerRadius} ${outerRadius})`);

  //   const groupWithEnter = group
  //     .selectAll("g.arc")
  //     .data(data)
  //     .enter();

  //   const path = groupWithEnter.append("g").attr("class", "arc");

  //   path
  //     .append("path")
  //     .attr("class", "arc")
  //     .attr("d", this.createArc)
  //     .attr("fill", (d, i) => this.colors(d.index));

  //   path
  //     .append("text")
  //     .attr("text-anchor", "middle")
  //     .attr("alignment-baseline", "middle")
  //     .attr("transform", d => `translate(${this.createArc.centroid(d)})`)
  //     .style("fill", "white")
  //     .style("font-size", 10)
  //   //   .text(d => this.format(d.value));
  // }

  componentDidMount() {
    // const data = [35, 10, 15, 35, 40, 10, 70];
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
    const labelArc = d3
      .arc()
      .innerRadius(radius / 1.4)
      .outerRadius(radius);
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
      // .style('fill-opacity', 0.7)
      .style('stroke', '#11141C')
      .style('stroke-width', 0.5)
      .on('mouseover', function (d, i) {
        d3.select(this)
          // .style('fill-opacity', 1)
          .transition()
          .duration(500)
          .attr('d', hoverArc);
      })
      .on('mouseout', function (d, i) {
        d3.select(this)
          // .style('fill-opacity', 0.7)
          .transition()
          .duration(500)
          .attr('d', arc);
      });

    g.append('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
      .text((d) => d.value)
      .style('font-size', 10)
      .style('font-wieght', 800)
      .style('fill', '#FFF')
      .style('text-anchor', 'middle')
      .style('fill-opacity', 0)
      .style('text-shadow', '2px 2px #0E0B16')
      .transition()
      .duration(3000)
      .delay((d, i) => i * 300)
      .style('fill-opacity', 1);

    const legsvg = d3
      .select(this.props.legendRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      //   .attr('class','arc')
      .attr('transform', `translate(${width / 15},${height / 15})`);

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

  // UNSAFE_componentWillUpdate(nextProps, nextState) {
  //   const svg = d3.select(this.ref.current);
  //   const data = this.createPie(nextProps.data);

  //   const group = svg
  //     .select("g")
  //     .selectAll("g.arc")
  //     .data(data);

  //   group.exit().remove();

  //   const groupWithUpdate = group
  //     .enter()
  //     .append("g")
  //     .attr("class", "arc");

  //   const path = groupWithUpdate.append("path").merge(group.select("path.arc"));

  //   path
  //     .attr("class", "arc")
  //     .attr("d", this.createArc)
  //     .attr("fill", (d, i) => this.colors(i));

  //   // const text = groupWithUpdate.append("text").merge(group.select("text"));

  //   // text
  //   //   .attr("text-anchor", "middle")
  //   //   .attr("alignment-baseline", "middle")
  //   //   .attr("transform", d => `translate(${this.createArc.centroid(d)})`)
  //   //   .text(d => this.format(d.value));
  // }

  render() {
    return (
      <React.Fragment>
        <div className="col-md-6">
          <div ref={this.props.legendRef}>
            <div className="legends"></div>
          </div>
        </div>
        <div className="col-md-5 offset-1">
          <svg ref={this.myRef} />
        </div>
      </React.Fragment>
    );
  }
}

export default PieClass;
