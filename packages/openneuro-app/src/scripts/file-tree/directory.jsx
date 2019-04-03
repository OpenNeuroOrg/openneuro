import React, { useState } from 'react'
import PropTypes from 'prop-types'
import FileTree from './file-tree.jsx'

const Directory = ({ name, files, directories }) =>
  (Directory.propTypes = {
    name: PropTypes.string,
    files: PropTypes.array,
    directories: PropTypes.array,
  })

export default Directory
