// dependencies ----------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { VictoryChart, VictoryAxis, VictoryStack, VictoryBar } from 'victory'

// Life Cycle ----------------------------------------------------------------------

const Bar = ({ months, index, succeeded, failed }) => {
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
}

Bar.propTypes = {
  months: PropTypes.array,
  index: PropTypes.array,
  succeeded: PropTypes.array,
  failed: PropTypes.array,
}

export default Bar
