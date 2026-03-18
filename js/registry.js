const CellRegistry = (() => {
  const cells = {}
  return {
    register(cell) {
      cells[cell.id] = cell
    },
    getAll() {
      return cells
    },
    get(id) {
      return cells[id]
    }
  }
})()
