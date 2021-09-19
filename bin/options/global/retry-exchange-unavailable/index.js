const RETRY_EXCHANGE_UNAVAILABLE = {
  ENABLE: {
    name: 'retryExchangeUnavailable',
    FLAGS: '--retry-exchange-unavailable',
    DESCRIPTION:
      'Advanced users only. Enable retrying order placement requests that are rejected due to the exchange being unavailable.',
    isConfigurable: true,
  },
  DISABLE: {
    FLAGS: '--no-retry-exchange-unavailable',
    DESCRIPTION:
      'Disable retrying order placement requests that are rejected due to the exchange being unavailable.',
  },
};

export { RETRY_EXCHANGE_UNAVAILABLE };
