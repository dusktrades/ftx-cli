function composeTableData(data, composeEntry) {
  return data.map((entry) => composeEntry(entry));
}

export { composeTableData };
