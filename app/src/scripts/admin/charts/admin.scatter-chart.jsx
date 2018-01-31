// dependencies ----------------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import { VictoryChart } from 'victory'
import { VictoryScatter } from 'victory'
import { VictoryBar } from 'victory'
import { VictoryAxis } from 'victory'

// Life Cycle ----------------------------------------------------------------------

const Scatter = ({ logs, year }) => {
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
        <h4>Sorry, there were not any successful jobs in {year}.</h4>
      </div>
    )
  }
}

export default Scatter
