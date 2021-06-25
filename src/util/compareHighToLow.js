function compareHighToLow(a, b) {
  if (a === b) {
    return 0;
  }

  if (a == null) {
    return 1;
  }

  if (b == null) {
    return -1;
  }

  return b - a;
}

export { compareHighToLow };
