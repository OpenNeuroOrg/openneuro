// dependencies ----------------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import { VictoryChart } from 'victory'
import { VictoryScatter } from 'victory'
import { VictoryBar } from 'victory'
import { VictoryAxis } from 'victory'

// Life Cycle ----------------------------------------------------------------------

const Scatter = ({ logs, year, jobs }) => {
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

    // Need to set a default height and width on this div
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
            onClick={jobs.bind(this)}
          />
        </VictoryChart>
      </div>
    )
  } else {
    return (
      <div className="chart-container">
        <p>Sorry, there were not any successful jobs in {year}.</p>
      </div>
    )
  }
}

export default Scatter
