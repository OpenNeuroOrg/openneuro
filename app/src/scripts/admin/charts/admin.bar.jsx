// dependencies ----------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import {
  VictoryChart,
  VictoryScatter,
  VictoryAxis,
  VictoryStack,
  VictoryBar,
} from 'victory'

// Life Cycle ----------------------------------------------------------------------

const Bar = ({ year, logs, months }) => {
  let ms = months
  let dataLength = 0
  let key
  // ARRAY AND OBJECT VARS FOR DATA
  let data = []
  let total = []
  let failed = []
  let succeeded = []
  let entries = {}

  Object.keys(logs).map(type => {
    if (logs[type][year]) {
      Object.values(logs[type][year]).map(job => {
        let dateArr = job.dateTime.split(' ')
        let status = job.log.data.job.status
        key = dateArr[1]
        if (!entries[key]) {
          entries[key] = []
          entries[key].push({ date: job.dateTime, status: status })
        } else {
          entries[key].push({ date: job.dateTime, status: status })
        }
      })
    }
  })

  // if array is not empty
  if (entries[key]) {
    dataLength = entries[key].length
    total.push({ x: key, y: dataLength })
    // need to get length of job statuses for the month
    Object.values(entries).map(jobs => {
      let count = []
      jobs.map(job => {
        // Add data to chart
        if (job.status === 'FAILED') {
          count.push(job.date)
          failed.push({ x: key, y: count.length })
        } else if (job.status === 'SUCCEEDED') {
          count.push(job.date)
          succeeded.push({ x: key, y: count.length })
        }
      })
    })
  }

  console.log(total)
  if (logs.FAILED[year].length || logs.SUCCEEDED[year].length) {
    return (
      <div className="chart-container">
        <VictoryChart>
          <VictoryAxis
            style={{ tickLabels: { fontSize: 15 } }}
            tickValues={ms}
            tickFormat={ms}
          />
          <VictoryStack colorScale={['#38A171', '#c82424', '#df7600']}>
            <VictoryBar data={failed} />
            <VictoryBar data={succeeded} />
            <VictoryBar data={total} />
          </VictoryStack>
        </VictoryChart>
      </div>
    )
  } else {
    return (
      <div className="chart-container">
        <h4>Sorry, we can't find any data for {year}.</h4>
      </div>
    )
  }
}

Bar.propTypes = {
  logs: PropTypes.object,
  year: PropTypes.node,
}

export default Bar
