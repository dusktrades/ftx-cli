function outputData(data, output, { table, json }) {
  if (output === 'json') {
    json(data);

    return;
  }

  table(data);
}

export { outputData };
