import Logs from '../admin.logs'

describe('admin/Logs', () => {
  it('renders successfully', () => {
    const wrapper = shallow(<Logs />)
    expect(wrapper).toMatchSnapshot()
  })
})
