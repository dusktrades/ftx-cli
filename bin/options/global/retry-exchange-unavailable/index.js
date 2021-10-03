const RETRY_EXCHANGE_UNAVAILABLE = {
  ENABLE: {
    name: 'retryExchangeUnavailable',
    flags: '--retry-exchange-unavailable',
    description:
      'Advanced users only. Enable retrying order placement requests that are rejected due to the exchange being unavailable.',
    isConfigurable: true,
  },
  DISABLE: {
    flags: '--no-retry-exchange-unavailable',
    description:
      'Disable retrying order placement requests that are rejected due to the exchange being unavailable.',
  },
};

export { RETRY_EXCHANGE_UNAVAILABLE };
