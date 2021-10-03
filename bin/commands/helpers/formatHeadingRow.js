import chalk from 'chalk';

function formatHeadingRow(row) {
  return row.map((heading) => chalk.bold(heading));
}

export { formatHeadingRow };
