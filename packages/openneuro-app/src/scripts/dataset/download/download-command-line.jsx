import React from "react"
import PropTypes from "prop-types"
import ShellExample from "./shell-example.jsx"

export const DownloadSampleCommand = ({ datasetId, snapshotTag }) => (
  <ShellExample>
    # Login by following the prompts<br />
    deno run -A jsr:@openneuro/cli login<br />
    # Download the repository<br />
    deno run -A jsr:@openneuro/cli download{" "}
    {snapshotTag ? `--version ${snapshotTag}` : "--draft"} {datasetId}{" "}
    {datasetId}
    -download/
  </ShellExample>
)

DownloadSampleCommand.propTypes = {
  datasetId: PropTypes.string,
  snapshotTag: PropTypes.string,
}

const DownloadCommandLine = ({ datasetId, snapshotTag }) => (
  <div>
    <h4>Download with Deno</h4>
    <p>
      Using <a href="https://jsr.io/@openneuro/cli">@openneuro/cli</a>{" "}
      you can download this dataset from the command line using{" "}
      <a href="https://docs.deno.com/runtime/getting_started/installation/">
        Deno
      </a>.
    </p>
    <DownloadSampleCommand datasetId={datasetId} snapshotTag={snapshotTag} />
    <p>
      This will download a DataLad dataset to {datasetId}
      -download/ in the current directory. To download annexed files, use
      datalad or git-annex.
    </p>
    <ShellExample>
      cd {datasetId}-download && datalad get [PATH]
    </ShellExample>
  </div>
)

DownloadCommandLine.propTypes = {
  datasetId: PropTypes.string,
  snapshotTag: PropTypes.string,
}

export default DownloadCommandLine
