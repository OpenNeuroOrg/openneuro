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
        visible: true,
        limitFrames4D: 5,
      },
    ]
    const nv = new Niivue({ dragAndDropEnabled: false })
    ;(window as any).niivue = nv
    nv.attachToCanvas(canvas.current)
    nv.loadVolumes(volumeList) // press the "v" key to cycle through volumes
  }, [imageUrl])

  return <canvas ref={canvas} height={800} />
}

FileViewerNifti.propTypes = {
  imageUrl: PropTypes.string,
}

export default FileViewerNifti
