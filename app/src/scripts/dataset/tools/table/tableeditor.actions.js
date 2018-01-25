import Reflux from 'reflux'

var Actions = Reflux.createActions([
  'cancelEdit',
  'findRow',
  'getRows',
  'getSize',
  'handleGridRowsUpdated',
  'handleGridSort',
  'handleFilterChange',
  'handleAddRow',
  'handleDeleteRow',
  'handlePaste',
  'onCellSelected',
  'onClearFilters',
  'rowGetter',
  'toggleFilter',
  'updateCoordinate',
  'saveFile',
  'setInitialState',
  'startEdit',
])

export default Actions
