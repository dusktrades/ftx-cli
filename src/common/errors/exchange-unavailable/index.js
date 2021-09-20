class ExchangeUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ExchangeUnavailableError';
  }
}

export { ExchangeUnavailableError };
