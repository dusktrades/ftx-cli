class OptionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'OptionError';
  }
}

export { OptionError };
