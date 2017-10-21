// dependencies ----------------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import { VictoryPie } from 'victory'

// Life Cycle ----------------------------------------------------------------------

const Pie = ({ failed, success, total }) => {
  let fakeTotal = 3060
  let dataPoints = { failed: 1864, success: 1196 }
  let data = []
  let dataP

  Object.entries(dataPoints).forEach(([key, value]) => {
    if (value && total) {
      dataP = Math.floor(value / fakeTotal * 100)
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
        innerRadius={68}
        labelRadius={100}
        style={{ labels: { fontSize: 10, fill: 'white' } }}
      />
    </div>
  )
}

export default Pie
