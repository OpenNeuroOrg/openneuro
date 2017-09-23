import LogLink from '../admin.logs.link'

describe('admin/LogLink', () => {
  it('renders successfully', () => {
    const log = { data: {} }
    const wrapper = shallow(<LogLink log={log} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('links to jobs', () => {
    const log = {
      data: {
        job: {
          datasetId: 'someid',
          snapshotId: 'anotherid',
          appLabel: 'someapp',
          appVersion: '1',
          datasetLabel: 'somedataset',
        },
      },
    }
    const wrapper = shallow(<LogLink log={log} />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('Link').length).toBe(1)
  })
  it('links to datasets', () => {
    const log = {
      data: {
        dataset: {
          datasetId: 'someid',
          datasetLabel: 'somedataset',
        },
      },
    }
    const wrapper = shallow(<LogLink log={log} />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('Link').length).toBe(1)
  })
})
