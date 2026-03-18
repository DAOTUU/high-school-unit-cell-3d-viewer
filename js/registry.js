const CellRegistry = (() => {
  const cells = {};
  return {
    register(cell) {
      cells[cell.id] = cell;
    },
    getAll() {
      return Object.values(cells);
    },
    get(id) {
      return cells[id];
    }
  };
})();
