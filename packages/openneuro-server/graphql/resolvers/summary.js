import mongo from '../../libs/mongo.js'
/**
 * Summary resolver
 *
 * Triggers validation if a summary is invalid or null
 */
export const summary = () => {
  // Stub summary for now
  // This needs the remote validator work completed
  // These will be retrieved by index in mongodb after that
  return {
    id: 'notarealid',
    modalities: ['bold', 'inplaneT2', 'T1w'],
    sessions: ['anat'],
    subjects: ['sub-01', 'sub-02', 'sub-03'],
    tasks: ['balloon analog risk task'],
    size: 65536,
    totalFiles: 10,
  }
}
