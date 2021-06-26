class EmptyResultsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmptyResultsError';
  }
}

export { EmptyResultsError };
