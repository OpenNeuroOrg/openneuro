/**
 * AWS
 *
 * Utils for interacting with AWS Batch jobs
 */
export default {
  /* Return valid BIDS apps from a list of AWS Batch jobs */
  filterAppDefinitions(appDefs) {
    return Object.keys(appDefs).reduce((apps, key) => {
      let appVersions = appDefs[key]
      let appsToKeep = {}
      let appsArray = []
      Object.keys(appVersions).forEach(function(version) {
        let app = appVersions[version]
        if (
          !app.containerProperties.environment.filter(envProp => {
            return (
              envProp.hasOwnProperty('name') &&
              envProp.name === 'BIDS_CONTAINER'
            )
          }).length > 0
        ) {
          delete appVersions[version]
        } else {
          appsArray.push(appVersions[version])
        }
      })
      appsToKeep[key] = appsArray

      if (Object.keys(appsToKeep[key]).length > 0) {
        apps.push(appsToKeep)
        return apps
      } else {
        return apps
      }
    }, [])
  },

  /* Search BIDS App job def for the environment container */
  getBidsContainer(app) {
    return app.containerProperties.environment.find(
      envProp => envProp.name === 'BIDS_CONTAINER',
    ).value
  },
}
