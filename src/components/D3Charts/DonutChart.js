import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import PieClass from './PieClass';
const DonutChart = (props) => {
  const generateData = (value, length = 5) =>
    d3.range(length).map((item, index) => ({
      date: index,
      value:
        value === null || value === undefined ? Math.random() * 100 : value,
    }));

  const [data, setData] = useState(props.data);

  useEffect(() => {
    setData(generateData());
  }, [!data]);

  return (
    <div>
      <PieClass
        data={data}
        width={150}
        height={100}
        innerRadius={40}
        outerRadius={50}
      />
    </div>
  );
};
export default DonutChart;
