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

function logTable(table) {
  console.log(table.toString());
}

const CliUi = { createTable, logTable };

export { CliUi };
