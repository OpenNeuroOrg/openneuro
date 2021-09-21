import { event } from '../../utils/gtag'
import datalad from '../../utils/datalad'

export const trackDownload = (datasetId, snapshotTag) => {
  event({
    category: 'Download',
    action: 'Started web download',
    label: snapshotTag ? `${datasetId}:${snapshotTag}` : datasetId,
  })
  datalad.trackAnalytics(datasetId, {
    snapshot: true,
    tag: snapshotTag,
    type: 'downloads',
  })
}
