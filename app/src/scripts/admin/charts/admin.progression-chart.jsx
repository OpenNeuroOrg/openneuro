// dependencies ----------------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import { VictoryPie } from 'victory'

// Life Cycle ----------------------------------------------------------------------

const Chart = ({ failed, uploading, success }) => {
  let data = [{ x: 'failed', y: failed }, { x: 'successful', y: success }]

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

export default Chart
