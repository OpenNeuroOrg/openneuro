import React from 'react'
import { useTrail, animated } from 'react-spring'
import { useMeasure } from '../hooks/use-measure.js'

const items = [
  <i className="type-icon fa fa-folder"></i>,
  <i className="type-icon fa fa-folder"></i>,
  <i className="type-icon fa fa-folder"></i>,
]
const config = { mass: 5, tension: 2000, friction: 200 }

const FileTreeLoading = () => {
  const [toggle, setToggle] = React.useState(true)
  const [bind, { width: viewWidth }] = useMeasure()
  const trail = useTrail(items.length, {
    config,
    opacity: toggle ? 1 : 0,
    x: toggle ? 0 : viewWidth,
    width: toggle ? 80 : 0,
    from: { opacity: 0, x: viewWidth, width: 0 },
    onRest: () => {
      setToggle(!toggle)
    },
  })
  return (
    <div>
      {trail.map(({ x, width, ...rest }, index) => (
        <animated.div
          key={items[index]}
          className="trails-icon"
          style={{
            ...rest,
            transform: x.interpolate(x => `translate3d(${x}px,0,0)`),
          }}
          {...bind}>
          <animated.div style={{ width }}>{items[index]}</animated.div>
        </animated.div>
      ))}
    </div>
  )
}

export default FileTreeLoading
