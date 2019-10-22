import styled from '@emotion/styled'

//styled components for custom support modal
const Overlay = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding-top: 55px;
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  -webkit-transition: opacity 400ms ease-in;
  -moz-transition: opacity 400ms ease-in;
  transition: opacity 400ms ease-in;
  display: inline-block;
  opacity: 100;
  z-index: 999;
`

const ModalContainer = styled.div`
  background-color: white;
  width: 100%;
  position: relative;
  margin: 0 auto;
  padding: 3em;
  height: 100%;
  overflow: auto;
`

const ExitButton = styled.a`
  color: black;
  font-size: 34px;
  padding: 12px 12px;
  padding-top: 20px;
  position: absolute;
  right: 0;
  text-align: center;
  pointer-events: auto;
  top: 0;
  z-index: 100;
`

export { Overlay, ModalContainer, ExitButton }
