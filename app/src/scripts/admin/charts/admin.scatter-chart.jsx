// dependencies ----------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import {
  VictoryChart,
  VictoryScatter,
  VictoryAxis,
  VictoryStack,
  VictoryLine,
} from 'victory'

// Life Cycle ----------------------------------------------------------------------

const Scatter = ({ logs, year, months, index, entries }) => {
  let failed = []
  let succeeded = []
  Object.keys(entries).map(status => {
    let counter = 0
    for (let month of months) {
      counter++
      if (entries[status][month]) {
        if (status === 'failed') {
          failed.push({ x: counter, y: entries.failed[month].length })
        } else if (status === 'succeeded') {
          succeeded.push({ x: counter, y: entries.succeeded[month].length })
        }
      }
    }
  })
  return (
    <div className="chart-container">
      <VictoryChart>
        <VictoryAxis
          style={{ tickLabels: { fontSize: 15 } }}
          tickValues={index}
          tickFormat={months}
        />
        <VictoryStack>
          <VictoryScatter
            style={{ data: { fill: '#009b76' } }}
            data={succeeded}
            labels={datum => datum.y}
            size={5}
          />
          <VictoryScatter
            style={{ data: { fill: '#eb472c' } }}
            data={failed}
            labels={datum => datum.y}
            size={5}
          />
        </VictoryStack>
        <VictoryLine
          style={{ data: { stroke: '#009b76' } }}
          data={succeeded}
          animate={{ duration: 800 }}
        />
      </VictoryChart>
    </div>
  )
}

Scatter.propTypes = {
  logs: PropTypes.object,
  year: PropTypes.node,
  months: PropTypes.array,
  entries: PropTypes.object,
}

export default Scatter
