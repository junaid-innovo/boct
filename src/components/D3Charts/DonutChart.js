import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import PieClass from './PieClass';
import { Ref } from 'semantic-ui-react';
const DonutChart = (props) => {
  const data=[10,20,30,40,50]

  return (
    <div>
      
    </div>
  );
};
const Chart=()=>{
  return React.forwardRef((props,ref)=>
  <DonutChart {...props} ref={ref}></DonutChart>
  )
}
export default Chart
