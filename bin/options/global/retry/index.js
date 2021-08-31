const RETRY = {
  name: 'retry',
  ENABLE: {
    FLAGS: '--retry',
    DESCRIPTION:
      'Enable Retry-Until-Filled mode. Triggered orders that are executed at market will be retried until the order size is filled.',
    isConfigurable: true,
  },
  DISABLE: {
    FLAGS: '--no-retry',
    DESCRIPTION: 'Disable Retry-Until-Filled mode.',
  },
};

export { RETRY };
