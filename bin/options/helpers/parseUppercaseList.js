function parseUppercaseList(values) {
  return values.split(',').map((entry) => entry.toUpperCase());
}

export { parseUppercaseList };
