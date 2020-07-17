import React, {Component} from 'react';
import * as d3 from 'd3';
class BarChart extends Component {
  componentDidMount() {
    const data = [10, 20, 30, 40, 50,20];
    this.drawBarChart(data);
  }
  drawBarChart(data) {
    const canvasHeight = 500;
    const canvasWidth = 600;
    const scale = 5;
    const svgCanvas = d3
      .select(this.refs.canvas)
      .append('svg')
      .attr('width', canvasWidth)
      .attr("transform", "translate(" + canvasWidth  + "," + canvasHeight  + ")")
      .attr('height', canvasHeight)
      .style('border', '1px solid red');
    svgCanvas
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('width', 40)
      .attr('height', (datapoint) => datapoint * scale)
      .attr('fill', 'orange')
      .attr('x', (datapoint, iteration) => iteration * 45)
      .attr('y', (datapoint) => canvasHeight - datapoint * scale);
      svgCanvas.selectAll("text")
    .data(data).enter()
        .append("text")
        .attr("x", (dataPoint, i) => i * 45 + 10)
        .attr("y", (dataPoint, i) => canvasHeight - dataPoint * scale - 10)
        .text(dataPoint => dataPoint)
  }
  render() {
    return <div ref="canvas"></div>;
  }
}
export default BarChart;
// import React, {Component} from 'react';
// import * as d3 from 'd3';

// class BarChart extends Component {
//   componentDidMount() {
//     const temperatureData = [8, 5, 13, 9, 12];
//     // d3.selectAll('p').style('color', function () {
//     //   return 'hsl(' + Math.random() * 360 + ',100%,50%)';
//     // });
//     // d3.select(this.refs.temperatures)
//     // .selectAll("p")
//     // .data(temperatureData)
//     // .enter()
//     //     .append("p")
//     //     .text((datapoint) => `${datapoint} degrees`)
//     //     .style((datapoint) => {
//     //         if (datapoint > 10) {
//     //             return "red"
//     //         } else { return "blue" }
//     //     })
//     // d3.select(this.refs.temperatures)
//     // .selectAll("h2")
//     // .data(temperatureData)
//     // .enter()
//     //     .append("h2")
//     //     .text((datapoint) => datapoint + " degrees")
//     // d3.select(this.refs.temperatures)
//     //   .selectAll('h2')
//     //   .data(temperatureData)
//     //   .enter()
//     //   .append('h2')
//     //   .text('New Temperature');
//     d3.select(this.ref.temperatures)
//     .transition()
//     .style("background-color", "red");
//   }
//   render() {

// return(<p ref="temperatures"></p>)
//     // return <div ref="temperatures">
//     // <p>test</p>
//     // </div>;
//   }
// }
// export default BarChart;
