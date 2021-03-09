import React from 'react'

/**
 * Required to use the webkitdirectory attribute on <input>
 */
declare module 'react' {
  interface InputHTMLAttributes<InputHTMLElement>
    extends AriaAttributes,
      DOMAttributes<InputHTMLElement> {
    directory?: string
    webkitdirectory?: string
  }
}