// dependencies ----------------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import { VictoryChart } from 'victory'
import { VictoryScatter } from 'victory'
import { VictoryBar } from 'victory'
import { VictoryAxis } from 'victory'

// Life Cycle ----------------------------------------------------------------------

const Scatter = ({ logs, month, year, jobs }) => {
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

  // console.log(year)

  let data = []
  Object.entries(logs).map((log, index) => {
    let key = log[0].split('_')
    data.push({ x: key[0], y: log[1].length })
  })

  return (
    <div>
      <h3>{year != 'all' ? 'Successful jobs for ' + year : null}</h3>
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
          events={[
            {
              target: 'data',
              eventHandlers: {
                onClick: () => {
                  return [
                    {
                      target: 'labels',
                      mutation: props => {
                        // console.log(props.text)
                        jobs(props.text)
                      },
                    },
                  ]
                },
              },
            },
          ]}
        />
      </VictoryChart>
    </div>
  )
}

export default Scatter
