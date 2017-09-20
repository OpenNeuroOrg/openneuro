import Input from '../input'

describe('common/forms/Input', () => {
  it('renders successfully', () => {
    const wrapper = shallow(<Input initialValue="test-value" />)
    expect(wrapper).toMatchSnapshot()
  })
  it('resets when remounted', () => {
    const initValue = 'one'
    const newValue = 'two'
    const component = mount(<Input initialValue={initValue} />)
    const input = component.find('input')
    expect(component.node.state.value).toBe(initValue)

    // User types in a value
    input.node.value = newValue
    input.simulate('change', input)
    expect(component.node.state.value).toBe(newValue)

    // Reset by parent component (cleared)
    component.setProps({ value: initValue })
    expect(component.node.state.value).toBe(initValue)
  })
})
