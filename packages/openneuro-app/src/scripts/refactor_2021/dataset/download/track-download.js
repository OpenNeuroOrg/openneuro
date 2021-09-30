import { event } from '../../utils/gtag'
import { trackAnalytics } from '../../utils/datalad'

export const trackDownload = (client, datasetId, snapshotTag) => {
  event({
    category: 'Download',
    action: 'Started web download',
    label: snapshotTag ? `${datasetId}:${snapshotTag}` : datasetId,
  })
  trackAnalytics(client, datasetId, {
    snapshot: true,
    tag: snapshotTag,
    type: 'downloads',
  })
}
