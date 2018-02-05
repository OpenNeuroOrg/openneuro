// dependencies ----------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { VictoryChart, VictoryScatter, VictoryAxis } from 'victory'

// Life Cycle ----------------------------------------------------------------------

const Scatter = ({ logs, year, months }) => {
  let ms = months

  let data = []
  let entries = {}
  let key
  let dataLength = 0

  if (logs.SUCCEEDED[year]) {
    Object.values(logs.SUCCEEDED[year]).map(job => {
      let dateArr = job.dateTime.split(' ')
      key = dateArr[1]
      if (!entries[key]) {
        entries[key] = []
        entries[key].push(job.dateTime)
      } else {
        entries[key].push(job.dateTime)
      }
    })

    entries[key] ? (dataLength = entries[key].length) : null
    data.push({ x: key, y: dataLength })

    return (
      <div className="chart-container">
        <VictoryChart>
          <VictoryAxis
            style={{ tickLabels: { fontSize: 15 } }}
            tickValues={ms}
            tickFormat={ms}
          />
          <VictoryScatter
            style={{ data: { fill: '#007c92' } }}
            data={data}
            labels={datum => datum.y}
            size={10}
          />
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
}

export default Scatter
