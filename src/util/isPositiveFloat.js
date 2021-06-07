const MATCH_FLOAT = /^\d+(?:\.\d+)?$/;

function isPositiveFloat(value) {
  return MATCH_FLOAT.test(value);
}

export { isPositiveFloat };
