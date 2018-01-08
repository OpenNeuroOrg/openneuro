// dependencies ----------------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import { VictoryPie } from 'victory'

// Life Cycle ----------------------------------------------------------------------

const Pie = ({ failed, success, total }) => {
  let dataPoints = { failed, success }
  let data = []
  let dataP

  Object.entries(dataPoints).forEach(([key, value]) => {
    if (value && total) {
      // console.log(total)
      dataP = Math.floor(value / total * 100)
      let label = key + ' ' + dataP + '%'
      // console.log(dataP);
      data.push({ x: label, y: dataP })
    }
    // console.log(dataP);
  })

  return (
    <div>
      <VictoryPie
        width={400}
        height={400}
        data={data}
        innerRadius={49}
        labelRadius={78}
        style={{ labels: { fontSize: 14, fill: 'white' } }}
        colorScale={['black', '#007c92']}
      />
    </div>
  )
}
// padding={{ top: 50, bottom: 80, left: 40, right: 80 }}

export default Pie
