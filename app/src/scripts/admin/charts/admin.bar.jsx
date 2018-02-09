// dependencies ----------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { VictoryChart, VictoryAxis, VictoryStack, VictoryBar } from 'victory'

// Life Cycle ----------------------------------------------------------------------

const Bar = ({ year, logs, months }) => {
  let ms = months
  let key
  // ARRAY AND OBJECT VARS FOR DATA
  let failed = []
  let succeeded = []
  let entries = {
    failed: [],
    succeeded: [],
  }

  Object.keys(logs).map(type => {
    if (logs[type][year]) {
      Object.values(logs[type][year]).map(job => {
        let dateArr = job.dateTime.split(' ')
        let status = job.log.data.job.status.toLowerCase()
        key = dateArr[1]
        if (!entries[status][key]) {
          entries[status][key] = []
          entries[status][key].push({ date: job.dateTime, status: status })
        } else {
          entries[status][key].push({ date: job.dateTime, status: status })
        }
      })
    }
  })
  Object.keys(entries).map(log => {
    if (entries[log][key]) {
      if (log === 'failed') {
        failed.push({ x: key, y: entries[log][key].length })
      } else if (log === 'succeeded') {
        succeeded.push({ x: key, y: entries[log][key].length })
      }
    }
  })

  if (logs.FAILED[year].length || logs.SUCCEEDED[year].length) {
    return (
      <div className="chart-container">
        <VictoryChart>
          <VictoryAxis
            style={{ tickLabels: { fontSize: 15 } }}
            tickValues={ms}
            tickFormat={ms}
          />
          <VictoryStack colorScale={['#38A171', '#c82424']}>
            <VictoryBar data={succeeded} />
            <VictoryBar data={failed} />
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
  months: PropTypes.array,
}

export default Bar
