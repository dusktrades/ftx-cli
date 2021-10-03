const RETRY = {
  ENABLE: {
    name: 'retry',
    flags: '--retry',
    description:
      'Enable Retry-Until-Filled mode. Triggered orders that are executed at market will be retried until the order size is filled.',
    isConfigurable: true,
  },
  DISABLE: {
    flags: '--no-retry',
    description: 'Disable Retry-Until-Filled mode.',
  },
};

export { RETRY };
