// dependencies ----------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { VictoryChart, VictoryAxis, VictoryStack, VictoryBar } from 'victory'

// Life Cycle ----------------------------------------------------------------------

const Bar = ({ year, logs, months, index, entries }) => {
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

  if (logs.FAILED[year].length || logs.SUCCEEDED[year].length) {
    return (
      <div className="chart-container">
        <VictoryChart domainPadding={10}>
          <VictoryAxis
            style={{ tickLabels: { fontSize: 15 } }}
            tickValues={index}
            tickFormat={months}
          />
          <VictoryAxis
            dependentAxis
            width={400}
            height={400}
            domain={[0, 100]}
            standalone={false}
          />
          <VictoryStack colorScale={['#009b76', '#eb472c']}>
            <VictoryBar data={succeeded} animate={{ duration: 800 }} />
            <VictoryBar data={failed} animate={{ duration: 800 }} />
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
  entries: PropTypes.object,
  index: PropTypes.array,
}

export default Bar
