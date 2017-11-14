window.onerror = function(message, url, lineNo, colNo, error) {
  console.log(arguments)

  let container = document.createElement('div')

  container.style.color = 'red'
  container.style.position = 'fixed'
  container.style.background = '#eee'
  container.style.padding = '2em'
  container.style.top = '1em'
  container.style.left = '1em'

  let msg = document.createElement('pre')
  msg.innerText = [
    'Message: ' + message,
    'URL: ' + url,
    'Line: ' + lineNo,
    'Column: ' + colNo,
    'Stack: ' + (error && error.stack),
  ].join('\n')

  container.appendChild(msg)

  document.body.appendChild(container)
}

// dependencies ---------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Index from './index.jsx'
import analyticsWrapper from './utils/analytics.js'

ReactDOM.render(
  <Router>
    <Route component={analyticsWrapper(Index)} />
  </Router>,
  document.getElementById('main'),
)
