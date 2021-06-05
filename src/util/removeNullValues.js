function removeNullValues(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value != null)
  );
}

export { removeNullValues };
