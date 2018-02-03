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
  let types = ['FAILED', 'SUCCEEDED']

  for (let type of types) {
    if (logs[type][year]) {
      Object.values(logs[type][year]).map(job => {
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
      console.log(data)

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
          <VictoryChart>
            <VictoryAxis
              style={{ tickLabels: { fontSize: 15 } }}
              tickValues={ms}
              tickFormat={ms}
            />
            <VictoryStack colorScale={['red', '#007c92', 'gold']}>
              <VictoryBar
                data={[
                  { x: 'Jan', y: 2 },
                  { x: 'Feb', y: 3 },
                  { x: 'Mar', y: 5 },
                ]}
              />
              <VictoryBar
                data={[
                  { x: 'Jan', y: 8 },
                  { x: 'Feb', y: 8 },
                  { x: 'Mar', y: 7 },
                ]}
              />
              <VictoryBar
                data={[
                  { x: 'Jan', y: 10 },
                  { x: 'Feb', y: 10 },
                  { x: 'Mar', y: 10 },
                ]}
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
}

Scatter.propTypes = {
  logs: PropTypes.object,
  year: PropTypes.node,
}

export default Scatter
