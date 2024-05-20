import React, { useEffect, useRef } from "react"
import PropTypes from "prop-types"
import { Niivue } from "@niivue/niivue"

const FileViewerNifti = ({
  imageUrl,
}: {
  imageUrl: string
}): React.ReactElement => {
  const canvas = useRef()
  useEffect(() => {
    const volumeList = [
      {
        url: imageUrl,
        colorMap: "gray",
        opacity: 1,
        limitFrames4D: 5,
      },
    ]
    const nv = new Niivue({ dragAndDropEnabled: false })
    ;(window as any).niivue = nv
    nv.attachToCanvas(canvas.current)
    nv.loadVolumes(volumeList) // press the "v" key to cycle through views (axial, coronal, sagittal, 3D, etc.)
    nv.graph.autoSizeMultiplanar = true // use autosizing
    nv.opts.multiplanarForceRender = true // ensure that we draw the time series graph in the tile usually reserved for the 3D render
    nv.graph.normalizeValues = false // use raw data values on y-axis
    nv.graph.opacity = 1.0 // show the graph
    // Notes: 
    // 1.   If an image only has one volume, the timeseries graph will not be visible.
    //      The 3D render will be placed in the graph tile instead. 
    // 2.   Users can navigate volumes forward and backward in the series using the left and right arrow keys on desktop devices
    // 3.   On touch screens, users can tap on the timeseries graph to jump to a volume index
    // 4.   Users can load all volumes by clicking on the "..." displayed on the timeseries graph
  }, [imageUrl])

  return <canvas ref={canvas} height={800} />
}

FileViewerNifti.propTypes = {
  imageUrl: PropTypes.string,
}

export default FileViewerNifti
