import React from "react"
import PropTypes from "prop-types"
import { gql, useMutation } from "@apollo/client"
import { WarnButton } from "../../components/warn-button/WarnButton"

const DELETE_FILE = gql`
  mutation deleteFiles($datasetId: ID!, $files: [DeleteFile]) {
    deleteFiles(datasetId: $datasetId, files: $files)
  }
`

/**
 * Given a file object, path/filename for deletion, and a list of currently loaded files, filter any that will be deleted and orphan directories
 */
export function fileCacheDeleteFilter(file, path, filename, cachedFileObjects) {
  const fullPath = [path, filename].filter(Boolean).join(":")
  if (file.filename === fullPath) {
    return false
  } else {
    if (file.directory && fullPath.startsWith(file.filename)) {
      // If a file other than the deletion target is removed
      // And no other files match this directory prefix
      for (const f of cachedFileObjects) {
        if (f.directory || f.filename === fullPath) {
          continue
        } else {
          if (f.filename.startsWith(path)) {
            return true
          }
        }
      }
      return false
    }
    return true
  }
}

const DeleteFile = ({ datasetId, path, filename }) => {
  const [deleteFiles] = useMutation(DELETE_FILE, {
    awaitRefetchQueries: true,
    update(cache, { data: { deleteFiles } }) {
      if (deleteFiles) {
        cache.modify({
          id: `Draft:${datasetId}`,
          fields: {
            files(cachedFiles) {
              // Filter any removed files from the Draft.files cache
              const cachedFileObjects = cachedFiles.map((f) =>
                cache.readFragment({
                  id: cache.identify(f),
                  fragment: gql`
                    fragment DeletedFile on DatasetFile {
                      id
                      key
                      filename
                      directory
                    }
                  `,
                })
              )
              const remainingFiles = cachedFiles.filter((f) => {
                // Get the cache key for each file we have loaded
                const file = cache.readFragment({
                  id: cache.identify(f),
                  fragment: gql`
                    fragment DeletedFile on DatasetFile {
                      id
                      key
                      filename
                      directory
                    }
                  `,
                })
                return fileCacheDeleteFilter(
                  file,
                  path,
                  filename,
                  cachedFileObjects,
                )
              })
              return remainingFiles
            },
          },
        })
      }
    },
  })

  return (
    <span className="delete-file">
      <WarnButton
        message=""
        iconOnly={true}
        icon="fa-trash"
        className="edit-file"
        onConfirmedClick={() => {
          deleteFiles({
            variables: { datasetId, files: [{ path, filename }] },
          })
        }}
      />
    </span>
  )
}

DeleteFile.propTypes = {
  datasetId: PropTypes.string,
  path: PropTypes.string,
  filename: PropTypes.string,
}

export default DeleteFile
