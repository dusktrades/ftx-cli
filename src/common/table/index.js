import Table from 'cli-table3';

function createTable(headings) {
  return new Table({
    head: headings,
    style: {
      head: [],
      border: [],
    },
  });
}

export { createTable };
