import React from "react";

import { Cards, Chart } from "./components";

const ReactChar = ({ data, country }) => {
  return (
    <div>
      <Cards data={data} country={country} />
      <Chart data={data} country={country} />
    </div>
  );
};

export default ReactChar;
