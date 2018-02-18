// dependencies ----------------------------------------------------------------------
import React from 'react'
import PropTypes from 'prop-types'
import { VictoryPie, VictoryLabel } from 'victory'

// Life Cycle ----------------------------------------------------------------------

const Pie = ({ failed, success, total, year }) => {
  let dataPoints = { failed, success }
  let data = []
  let dataP

  Object.entries(dataPoints).forEach(([key, value]) => {
    if (value && total) {
      dataP = Math.round(value / total * 100)
      let label = key + ' ' + dataP + '%'
      data.push({ x: label, y: dataP })
    }
  })

  return (
    <div className="pie-container">
      <svg viewBox="0 0 400 400">
        <VictoryPie
          standalone={false}
          width={400}
          height={400}
          data={data}
          innerRadius={70}
          labelRadius={100}
          style={{ labels: { fontSize: 16, fill: 'black' } }}
          colorScale={['rgba(236, 71, 46, 0.4', '#009b76']}
        />
        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={200}
          y={200}
          style={{ fontSize: 30 }}
          text={year}
        />
      </svg>
    </div>
  )
}

Pie.propTypes = {
  failed: PropTypes.node,
  success: PropTypes.node,
  total: PropTypes.node,
  year: PropTypes.string,
}

export default Pie
