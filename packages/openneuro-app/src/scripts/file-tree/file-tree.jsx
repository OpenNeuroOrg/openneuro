import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSpring, animated } from 'react-spring'
import { useMeasure } from '../hooks/use-measure.js'
import { usePrevious } from '../hooks/use-previous.js'
import { Frame, Title, Content } from './file-tree-styles.jsx'
import File from './file.jsx'
import UpdateFile from '../datalad/mutations/update-file.jsx'
import DeleteDir from '../datalad/mutations/delete-dir.jsx'
import FileTreeUnloadedDirectory from './file-tree-unloaded-directory.jsx'

export const sortByFilename = (a, b) => a.filename.localeCompare(b.filename)

export const sortByName = (a, b) => a.name.localeCompare(b.name)

export const unescapePath = path => path.replace(/:/g, '/')

const isTopLevel = dir => !dir.path.includes(':')

const FileTree = ({
  datasetId,
  snapshotTag = null,
  path = '',
  name = '',
  files = [],
  directories = [],
  editMode = false,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const previous = usePrevious(expanded)
  const [bind, { height: viewHeight }] = useMeasure()
  const { height, opacity, transform } = useSpring({
    from: { height: 0, opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: {
      height: expanded ? viewHeight : 0,
      opacity: expanded ? 1 : 0,
      transform: `translate3d(${expanded ? 0 : 20}px,0,0)`,
    },
  })
  return (
    <Frame>
      <button
        className="btn-file-folder"
        onClick={() => setExpanded(!expanded)}>
        <i className={`type-icon fa fa-folder${expanded ? '-open' : ''}`} />{' '}
        <Title>{name}</Title>
        <i
          className={`accordion-icon fa fa-caret${expanded ? '-up' : '-down'}`}
        />
      </button>
      <Content
        style={{
          opacity,
          height: expanded && previous === expanded ? 'auto' : height,
        }}>
        <animated.div style={{ transform }} {...bind}>
          {editMode && (
            <span className="filetree-editfile">
              <UpdateFile datasetId={datasetId} path={unescapePath(path)}>
                <i className="fa fa-plus" /> Add File
              </UpdateFile>
              <UpdateFile
                datasetId={datasetId}
                path={unescapePath(path)}
                multiple>
                <i className="fa fa-plus" /> Add Directory
              </UpdateFile>
              <DeleteDir
                datasetId={datasetId}
                fileTree={{ name, path, files, directories }}
              />
            </span>
          )}
          <ul className="child-files">
            {files.sort(sortByFilename).map((file, index) => (
              <li className="clearfix" key={index}>
                <File
                  datasetId={datasetId}
                  snapshotTag={snapshotTag}
                  path={path}
                  editMode={editMode}
                  {...file}
                />
              </li>
            ))}
            {directories.sort(sortByName).map((dir, index) => {
              if ('files' in dir || 'directories' in dir) {
                // Loaded directory
                return (
                  <li className="clearfix" key={index}>
                    <FileTree
                      datasetId={datasetId}
                      snapshotTag={snapshotTag}
                      editMode={editMode}
                      defaultExpanded={isTopLevel(dir)}
                      {...dir}
                    />
                  </li>
                )
              } else {
                // Unloaded
                return (
                  <li className="clearfix" key={index}>
                    <FileTreeUnloadedDirectory
                      datasetId={datasetId}
                      snapshotTag={snapshotTag}
                      directory={dir}
                    />
                  </li>
                )
              }
            })}
          </ul>
        </animated.div>
      </Content>
    </Frame>
  )
}

FileTree.propTypes = {
  datasetId: PropTypes.string,
  files: PropTypes.array,
  snapshotTag: PropTypes.string,
  path: PropTypes.string,
  name: PropTypes.string,
  directories: PropTypes.array,
  editMode: PropTypes.bool,
  defaultExpanded: PropTypes.bool,
}

export default FileTree
