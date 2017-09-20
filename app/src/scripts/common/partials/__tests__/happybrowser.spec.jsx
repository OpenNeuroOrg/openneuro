import Happybrowser from '../happybrowser'

const chrome =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36'
const chromium =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/60.0.3112.113 Chrome/60.0.3112.113 Safari/537.36'
const googlebot =
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
const ie =
  'Mozilla/5.0 (Windows; U; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727)'
const firefox =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0'

describe('common/partials/happybrowser', () => {
  it('renders successfully', () => {
    const wrapper = shallow(<Happybrowser ua={chrome} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('is hidden in Chrome', () => {
    const wrapper = shallow(<Happybrowser ua={chrome} />)
    expect(wrapper.hasClass('hidden')).toBe(true)
  })
  it('is hidden in Chromium', () => {
    const wrapper = shallow(<Happybrowser ua={chromium} />)
    expect(wrapper.hasClass('hidden')).toBe(true)
  })
  it('is hidden when accessed by Googlebot', () => {
    const wrapper = shallow(<Happybrowser ua={googlebot} />)
    expect(wrapper.hasClass('hidden')).toBe(true)
  })
  it('is visible in IE', () => {
    const wrapper = shallow(<Happybrowser ua={ie} />)
    expect(wrapper.hasClass('hidden')).toBe(false)
  })
  it('is visible in Firefox', () => {
    const wrapper = shallow(<Happybrowser ua={firefox} />)
    expect(wrapper.hasClass('hidden')).toBe(false)
  })
})
