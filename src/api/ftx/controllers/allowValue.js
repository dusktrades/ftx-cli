function allowValue(allowedValues, value) {
  if (allowedValues == null) {
    return true;
  }

  return allowedValues.includes(value);
}

export { allowValue };
