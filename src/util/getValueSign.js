function getValueSign(value) {
  if (value > 0) {
    return '+';
  }

  if (value < 0) {
    return '-';
  }

  return '±';
}

export { getValueSign };
