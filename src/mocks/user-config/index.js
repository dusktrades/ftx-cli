function create(defaults) {
  // TODO: Clean up cloning, although it should be fine for this simple mock.
  const config = JSON.parse(JSON.stringify(defaults));

  return {
    get(key) {
      return config[key];
    },
    set(key, value) {
      config[key] = value;
    },
    delete(key) {
      delete config[key];
    },
    store: config,
  };
}

const MockUserConfig = { create };

export { MockUserConfig };
