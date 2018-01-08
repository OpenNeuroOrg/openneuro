// dependencies ----------------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import { VictoryChart } from 'victory'
import { VictoryScatter } from 'victory'
import { VictoryBar } from 'victory'
import { VictoryAxis } from 'victory'

// Life Cycle ----------------------------------------------------------------------

const Scatter = ({ logs, month, year }) => {
  let ms = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ]

  let data = []
  logs.forEach(log => {
    data.push({ x: log.month, y: log.entries.length })
  })

  return (
    <div>
      <div>
        <VictoryChart>
          <VictoryAxis
            style={{ tickLabels: { fontSize: 15 } }}
            tickValues={ms}
            tickFormat={ms}
          />
          <VictoryScatter
            style={{ data: { fill: '#24c85e' } }}
            data={data}
            labels={datum => datum.y}
          />
        </VictoryChart>
      </div>
    </div>
  )
}

export default Scatter
