import markdown from '../markdown'

describe('utils/markdown', () => {
  it('should return an object with an __html property', () => {
    expect(markdown.format()).toHaveProperty('__html')
  })
  it('should render a markdown string', () => {
    const link_md = '[OpenNeuro](https://openneuro.org)'
    const link_html = '<a href="https://openneuro.org">OpenNeuro</a>'
    expect(markdown.format(link_md).__html).toMatch(link_html)
  })
  it('should convert URLs automatically', () => {
    const link_md = 'https://openneuro.org'
    const link_html =
      '<a href="https://openneuro.org">https://openneuro.org</a>'
    expect(markdown.format(link_md).__html).toMatch(link_html)
  })
})
