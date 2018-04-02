// TODO - Remove this when https://github.com/react-bootstrap/react-bootstrap/issues/2812 is fixed
import { Modal as ReactOverlayModal } from 'react-overlays'
import { Modal } from 'react-bootstrap'

const focus = () => {}
const cDU = ReactOverlayModal.prototype.componentDidUpdate
const cDM = ReactOverlayModal.prototype.componentDidMount

ReactOverlayModal.prototype.componentDidUpdate = function(prevProps) {
  if (this.focus !== focus) {
    this.focus = focus
  }
  cDU.call(this, prevProps)
}

ReactOverlayModal.prototype.componentDidMount = function() {
  if (this.focus !== focus) {
    this.focus = focus
  }
  cDM.call(this)
}

export default Modal
export { Modal }
