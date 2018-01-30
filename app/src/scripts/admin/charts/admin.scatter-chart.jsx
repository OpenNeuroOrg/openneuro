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

  // console.log(year)

  let data = []
  // console.log(logs)
  Object.values(logs.SUCCEEDED[year]).map(job => {
    let dateArr = job.dateTime.split(' ')
    let key = dateArr[1]
    let entries = {}
    if (!entries[key]) {
      entries[key] = []
      entries[key].push(job.dateTime)
    } else {
      entries[key].push(job.dateTime)
    }
    console.log(entries)
    data.push({ x: key, y: entries[key].length })

    // for (let job of log) {
    // }
    // console.log(index)
    // console.log(log[1][year])
    // let key = log[1][year]
  })

  return (
    <div>
      {/* <h3>{year != 'all' ? 'Successful jobs for ' + year : null}</h3> */}
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
