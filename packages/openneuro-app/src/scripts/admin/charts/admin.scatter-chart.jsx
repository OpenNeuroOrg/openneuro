// dependencies ----------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import {
  VictoryChart,
  VictoryScatter,
  VictoryAxis,
  VictoryStack,
  VictoryLine,
} from 'victory'

// Life Cycle ----------------------------------------------------------------------

const Scatter = ({ months, index, succeeded, failed }) => {
  return (
    <div className="chart-container">
      <VictoryChart>
        <VictoryAxis
          style={{ tickLabels: { fontSize: 15 } }}
          tickValues={index}
          tickFormat={months}
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
        <VictoryLine
          style={{ data: { stroke: '#009b76' } }}
          data={succeeded}
          animate={{ duration: 800 }}
        />
      </VictoryChart>
    </div>
  )
}

Scatter.propTypes = {
  months: PropTypes.array,
  index: PropTypes.array,
  succeeded: PropTypes.array,
  failed: PropTypes.array,
}

export default Scatter
