import Summary from '../dataset.summary.jsx'

const defProps = {
  summary: {
    sessions: [],
    totalFiles: 1,
    size: 5824,
    subjects: ['01', '02'],
    tasks: ['psuedotask'],
    modalities: ['MRI'],
  },
  minimal: false,
}

describe('dataset/Summary', () => {
  it('renders successfully', () => {
    const wrapper = shallow(<Summary {...defProps} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('applies the minimal-summary class with the minimal prop', () => {
    const minimalProps = Object.assign({}, defProps, { minimal: true })
    const wrapper = shallow(<Summary {...minimalProps} />)
    expect(wrapper.find('.minimal-summary')).toHaveLength(1)
  })
})
