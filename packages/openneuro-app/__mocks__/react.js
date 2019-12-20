const react = require('react')
// Resolution for requestAnimationFrame not supported in jest error :
// https://github.com/facebook/react/issues/9102#issuecomment-283873039
global.window = global
window.addEventListener = () => {}
window.requestAnimationFrame = callback => setTimeout(callback, 0)

module.exports = react
