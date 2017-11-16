import assert from 'assert'
import moment from 'moment'
import aws from '../../libs/aws'

const subjectParam = { participant_label: ['01', '02', '03'] }
const nCpusParam = { n_cpus: 4 }
const templateNameParam = { template_name: 'template1' }
const boolParam = { ica: true }
const falseBoolParam = { ica: false }
const emptyParam = { template_name: [] }
const nullParam = { template_name: null }
const spaceParam = {
  license_key: 'Super Secret Shhhhhh',
  cartoons: ['Ren and Stimpy'],
}

describe('libs/aws/batch.js', () => {
  describe('_prepareArguments()', () => {
    it('should return a valid list argument', () => {
      let params = Object.assign({}, subjectParam)
      let args = aws.batch._prepareArguments(params)
      assert.equal(args, '--participant_label 01 02 03')
    })
    it('should return a valid string argument', () => {
      let params = Object.assign({}, templateNameParam)
      let args = aws.batch._prepareArguments(params)
      assert.equal(args, '--template_name template1')
    })
    it('should return a valid numeric argument', () => {
      let params = Object.assign({}, nCpusParam)
      let args = aws.batch._prepareArguments(params)
      assert.equal(args, '--n_cpus 4')
    })
    it('should combine multiple arguments', () => {
      let params = Object.assign({}, subjectParam, nCpusParam)
      let args = aws.batch._prepareArguments(params)
      assert.equal(args, '--participant_label 01 02 03 --n_cpus 4')
    })
    it('should not include empty list parameters', () => {
      let params = Object.assign({}, subjectParam, nCpusParam, emptyParam)
      let args = aws.batch._prepareArguments(params)
      assert.equal(args, '--participant_label 01 02 03 --n_cpus 4')
    })
    it('should not include null parameters', () => {
      let params = Object.assign({}, subjectParam, nCpusParam, nullParam)
      let args = aws.batch._prepareArguments(params)
      assert.equal(args, '--participant_label 01 02 03 --n_cpus 4')
    })
    it('should properly format string arguments with spaces', () => {
      let params = Object.assign({}, subjectParam, spaceParam)
      let args = aws.batch._prepareArguments(params)
      assert.equal(
        args,
        "--participant_label 01 02 03 --license_key 'Super Secret Shhhhhh' --cartoons 'Ren and Stimpy'",
      )
    })
    it('should include booleans as bare flags', () => {
      let params = Object.assign({}, boolParam)
      let args = aws.batch._prepareArguments(params)
      assert.equal(args, '--ica')
    })
    it('should exclude false booleans as bare flags', () => {
      let params = Object.assign({}, falseBoolParam)
      let args = aws.batch._prepareArguments(params)
      assert.equal(args, '')
    })
    it('should include booleans correctly in mixed parameters', () => {
      let params = Object.assign({}, subjectParam, boolParam, nCpusParam)
      let args = aws.batch._prepareArguments(params)
      assert.equal(args, '--participant_label 01 02 03 --ica --n_cpus 4')
    })
    it('should exclude false booleans correctly in mixed parameters', () => {
      let params = Object.assign({}, subjectParam, falseBoolParam, nCpusParam)
      let args = aws.batch._prepareArguments(params)
      assert.equal(args, '--participant_label 01 02 03 --n_cpus 4')
    })
  })
  describe('_partitionLabels()', () => {
    it('should produce 3 expected groupings from 3 labels', () => {
      let labels = [...Array(3).keys()]
      assert.deepEqual(aws.batch._partitionLabels(labels), [[0], [1], [2]])
    })
    it('should produce 20 expected groupings from 23 labels', () => {
      let labels = [...Array(23).keys()]
      let res = aws.batch._partitionLabels(labels)
      assert.deepEqual(res, [
        [0, 20],
        [1, 21],
        [2, 22],
        [3],
        [4],
        [5],
        [6],
        [7],
        [8],
        [9],
        [10],
        [11],
        [12],
        [13],
        [14],
        [15],
        [16],
        [17],
        [18],
        [19],
      ])
    })
    it('should limit 10 labels to 10 groups', () => {
      let labels = [...Array(10).keys()]
      assert.equal(aws.batch._partitionLabels(labels).length, 10)
    })
    it('should limit 25 labels to 20 groups', () => {
      let labels = [...Array(25).keys()]
      assert.equal(aws.batch._partitionLabels(labels).length, 20)
    })
    it('should limit 40 labels to 20 groups', () => {
      let labels = [...Array(40).keys()]
      assert.equal(aws.batch._partitionLabels(labels).length, 20)
    })
    it('should limit 250 labels to 20 groups', () => {
      let labels = [...Array(250).keys()]
      assert.equal(aws.batch._partitionLabels(labels).length, 20)
    })
    it('should limit 1 label to 1 group', () => {
      let labels = ['0']
      assert.equal(aws.batch._partitionLabels(labels).length, 1)
    })
    it('should return 0 groups for 0 labels', () => {
      let labels = []
      assert.equal(aws.batch._partitionLabels(labels).length, 0)
    })
    it('should partition labels into +/- 1 item size groups', () => {
      let labels = [...Array(250).keys()]
      let groups = aws.batch._partitionLabels(labels)
      let lengths = groups.map(group => {
        return group.length
      })
      assert.equal(Math.max(...lengths) - Math.min(...lengths), 1)
    })
  })
  describe('_submitLevels()', () => {
    const batchJob = {
      containerOverrides: {
        environment: [],
      },
    }
    const analysisLevels = [
      { value: 'participant' },
      { value: 'group1' },
      { value: 'group2' },
    ]
    it('calls each level with the correct submit function', () => {
      const submitCallback = (a, b, c) => {
        c(null, ['test'])
      }
      const parallelSubmit = jest.fn(submitCallback)
      const singleSubmit = jest.fn(submitCallback)
      const done = jest.fn()
      aws.batch._submitLevels(
        batchJob,
        analysisLevels,
        parallelSubmit,
        singleSubmit,
        done,
      )
      expect(parallelSubmit).toHaveBeenCalledTimes(1) // One participant level
      expect(singleSubmit).toHaveBeenCalledTimes(2) // Two group levels
      expect(done).toHaveBeenCalled()
    })
    it('passes dependencies up exactly one level', () => {
      const parallelSubmit = jest.fn((a, b, c) => {
        c(null, [1, 2])
      })
      // Simulate group1 returning dependencies (itself) to group2
      const singleSubmit = jest
        .fn()
        .mockImplementationOnce((a, b, c) => {
          // group1
          c(null, [3])
        })
        .mockImplementationOnce((a, b, c) => {
          // group2 (last job in chain)
          c(null, [4])
        })
      const done = jest.fn()
      aws.batch._submitLevels(
        batchJob,
        analysisLevels,
        parallelSubmit,
        singleSubmit,
        done,
      )
      expect(parallelSubmit).toHaveBeenCalledWith(
        batchJob,
        [],
        expect.any(Function),
      )
      // Validate that we aren't getting the [1, 2] deps from the
      // participant level in the second group
      expect(singleSubmit).toHaveBeenLastCalledWith(
        batchJob,
        [3],
        expect.any(Function),
      )
    })
  })
  describe('staleJobFilter', () => {
    it('excludes one day running jobs', () => {
      const oldJob = { startedAt: 1, status: 'RUNNING' }
      const now = new Date(1 + 60 * 60 * 24)
      assert(!aws.batch.staleJobFilter(now)(oldJob))
    })
    it('excludes two day old jobs that are not running', () => {
      const oldJob = { startedAt: 1, status: 'FAILED' }
      const now = new Date(1 + 60 * 60 * 48)
      assert(!aws.batch.staleJobFilter(now)(oldJob))
    })
    it('includes two day running jobs', () => {
      const oldJob = { startedAt: 1, status: 'RUNNING' }
      const now = new Date(1 + 60 * 60 * 48)
      assert(aws.batch.staleJobFilter(now)(oldJob))
    })
  })
  describe('_terminateOldJobs', () => {
    it('terminates the input jobs', () => {
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
      const batch = {
        describeJobs: jest.fn((params, callback) => {
          callback(null, {
            jobs: params.jobs.map(jobId => {
              return {
                jobId: jobId,
                status: 'RUNNING',
                startedAt: threeDaysAgo,
              }
            }),
          })
        }),
        terminateJob: jest.fn(),
      }
      const jobIds = [
        'f1a5320d-f0d3-4cfb-8c26-f725c3b9a48e',
        'abbcce16-f0ff-4ec1-8ede-4502660e8aa2',
      ]
      const params = { jobs: jobIds }
      aws.batch._terminateOldJobs(batch, jobIds)
      expect(batch.describeJobs).toBeCalledWith(params, expect.any(Function))
      expect(batch.terminateJob).toHaveBeenCalledTimes(jobIds.length)
    })
  })
  describe('_parentStatus', () => {
    it('returns the existing status with an unknown', () => {
      const analysis = {
        analysis: {
          status: 'UPLOADING',
          batchStatus: [{ job: 'testing', status: 'UPLOADING' }],
        },
      }
      expect(aws.batch._parentStatus(analysis)).toEqual('UPLOADING')
    })
    it('returns pending for pending, runnable, starting', () => {
      const analysis = {
        analysis: {
          status: 'STARTING',
          batchStatus: [
            { job: 'testing', status: 'STARTING' },
            { job: 'test', status: 'RUNNABLE' },
          ],
        },
      }
      expect(aws.batch._parentStatus(analysis)).toEqual('PENDING')
    })
    it('returns pending failed if any jobs failed', () => {
      const analysis = {
        analysis: {
          status: 'RUNNING',
          batchStatus: [
            { job: 'testing', status: 'SUCCEEDED' },
            { job: 'test', status: 'FAILED' },
          ],
        },
      }
      expect(aws.batch._parentStatus(analysis)).toEqual('FAILED')
    })
    it('returns succeeded if all jobs succeeded', () => {
      const analysis = {
        analysis: {
          status: 'RUNNING',
          batchStatus: [
            { job: 'testing', status: 'SUCCEEDED' },
            { job: 'test', status: 'SUCCEEDED' },
          ],
        },
      }
      expect(aws.batch._parentStatus(analysis)).toEqual('SUCCEEDED')
    })
    it('returns running if any job has been through running', () => {
      const analysis = {
        analysis: {
          status: 'RUNNING',
          batchStatus: [
            { job: 'testing', status: 'PENDING' },
            { job: 'test', status: 'SUCCEEDED' },
          ],
        },
      }
      expect(aws.batch._parentStatus(analysis)).toEqual('RUNNING')
    })
    it('returns failed if any job has failed', () => {
      const analysis = {
        analysis: {
          status: 'RUNNING',
          batchStatus: [
            { job: 'testing', status: 'FAILED' },
            { job: 'test', status: 'PENDING' },
          ],
        },
      }
      expect(aws.batch._parentStatus(analysis)).toEqual('FAILED')
    })
  })
})

describe('libs/aws/cloudwatch.js', () => {
  let oldStream =
    'FreeSurfer/eb251a5f-6314-457f-a36f-d11665451ddb/bf4fc87d-2e87-4309-abd9-998a0de708de'
  let newStream = 'FreeSurfer/default/bf4fc87d-2e87-4309-abd9-998a0de708de'
  let streamObjOrig = {
    name: oldStream,
    exitCode: 0,
    environment: { TEST_ENV: true },
  }
  let streamObj = {}
  beforeEach(() => {
    // Use the copy since some tests modify it in place
    streamObj = Object.assign({}, streamObjOrig)
  })
  describe('streamNameVersion()', () => {
    let versions = {
      0: {
        analysis: { created: moment('2017-08-21T13:23-07:00') },
      },
      1: {
        analysis: { created: moment('2017-08-21T18:14-07:00') },
      },
    }
    it('should return 0 for jobs created before 2017-08-21 14:00 UTC-7', () => {
      assert.equal(aws.cloudwatch.streamNameVersion(versions[0]), 0)
    })
    it('should return 1 for jobs created after 2017-08-21 14:00 UTC-7', () => {
      assert.equal(aws.cloudwatch.streamNameVersion(versions[1]), 1)
    })
  })
  describe('_batchRenameStream()', () => {
    it('should translate old stream names to new ones', () => {
      assert.equal(aws.cloudwatch._renameStream(oldStream), newStream)
    })
    it('should leave new stream names unchanged', () => {
      assert.equal(aws.cloudwatch._renameStream(newStream), newStream)
    })
  })
  describe('formatLegacyLogStream', () => {
    it('should return a stream object with string arguments', () => {
      assert(aws.cloudwatch.formatLegacyLogStream(oldStream) instanceof Object)
    })
    it('should return an object for stream object arguments', () => {
      assert(aws.cloudwatch.formatLegacyLogStream(streamObj) instanceof Object)
    })
    it('should not change the format for version 0 stream objects', () => {
      assert.deepEqual(
        aws.cloudwatch.formatLegacyLogStream(streamObj, 0),
        streamObjOrig,
      )
    })
    it('should fix stream names for version 1 objects', () => {
      let formatted = aws.cloudwatch.formatLegacyLogStream(streamObj, 1)
      assert.notDeepEqual(formatted, streamObjOrig)
      assert.equal(formatted.name, newStream)
    })
  })
})
