import config from '../../../config.js'

/**
 * Extract kibana deployment uri from ELASTICSEARCH_CLOUD_ID (prod/staging)
 *   or use localhost url.
 * For localhost url to be available, the kibana service must be enabled (docker-compose).
 */
export const getKibanaURL = () => {
  if (config.elasticsearch.cloudID) {
    const ELASTICSEARCH_CLOUD_ID = config.elasticsearch.cloudID
    const base64 = /:(.+?==)$/.exec(ELASTICSEARCH_CLOUD_ID)[1]
    const decoded = atob(base64)
    const [_, hostname, deploymentId] = /^(.+?)\$.+?\$(.+?)$/.exec(decoded)
    return `https://${deploymentId}.${hostname}:9243/app/discover#/`
  } else {
    return 'http://localhost:5601/app/discover#/'
  }
}
const url = getKibanaURL()
// query params for index "logs-reexporter" with selected fields "dataset_id" and "text"
const reexportLogQueryParams =
  "_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&_a=(columns:!(dataset_id,tag,s3_export_successful,github_export_successful,error),filters:!(),index:'548067b0-607a-11eb-becc-a73e7e29924c',interval:auto,query:(language:kuery,query:''),sort:!())"

export const reexporterLogsURL = `${url}?${reexportLogQueryParams}`
