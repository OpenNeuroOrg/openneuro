// dependencies ----------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import {
  VictoryChart,
  VictoryScatter,
  VictoryAxis,
  VictoryStack,
} from 'victory'

// Life Cycle ----------------------------------------------------------------------

const Scatter = ({ logs, year, months, entries }) => {
  let dataLength = 0
  let ms = months
  let failed = []
  let succeeded = []

  Object.keys(entries).map(status => {
    for (let month of ms) {
      if (entries[status][month]) {
        if (status === 'failed') {
          failed.push({ x: month, y: entries.failed[month].length })
        } else if (status === 'succeeded') {
          succeeded.push({ x: month, y: entries.succeeded[month].length })
        }
      }
    }
  })

  if (logs.SUCCEEDED[year]) {
    return (
      <div className="chart-container">
        <VictoryChart>
          <VictoryAxis
            style={{ tickLabels: { fontSize: 15 } }}
            tickValues={ms}
            tickFormat={ms}
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
        </VictoryChart>
      </div>
    )
  } else {
    return (
      <div className="chart-container">
        <h4>Sorry, we can't find any data on jobs in {year}.</h4>
      </div>
    )
  }
}

Scatter.propTypes = {
  logs: PropTypes.object,
  year: PropTypes.node,
  months: PropTypes.array,
  entries: PropTypes.object,
}

export default Scatter
